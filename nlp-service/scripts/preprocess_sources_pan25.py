"""
preprocess_sources_pan25.py
============================
Step 2 of the Gold Standard pipeline.

Reads .txt source documents from the PAN25 src/ folder, splits them into
sentences using spaCy (replaces NLTK), encodes via sentence-transformers,
and builds a FAISS cosine similarity index.

✅ CHECKPOINT SAVING: Saves progress after every batch.
   Safe to Ctrl+C and resume later with --resume flag.

⚠️  RAM GUIDE (IndexFlatIP stores all vectors in RAM):
   --limit 5000  →  ~2.7 GB FAISS  ← recommended for 8GB machine
   --limit 10000 →  ~5.4 GB FAISS  ← tight but possible
   --limit 20000 →  ~10.7 GB FAISS ← WON'T load on 8GB RAM!

Output: source_index.faiss, source_data.pkl  (overwrites existing files)

Usage : python preprocess_sources_pan25.py [--limit N] [--batch B]
        --limit N  : max source .txt files to index (default: 20000)
        --batch B  : files per processing batch   (default: 500)
"""

import os
import glob
import pickle
import argparse
import numpy as np
import faiss
from tqdm import tqdm
from sentence_transformers import SentenceTransformer

# ── spaCy setup ────────────────────────────────────────────────────────────────
try:
    import spacy
    try:
        nlp = spacy.load("en_core_web_sm", disable=["ner", "parser", "tagger"])
        nlp.add_pipe("sentencizer")          # fast sentence boundary detection
    except OSError:
        print("spaCy model not found. Run:  python -m spacy download en_core_web_sm")
        raise
except ImportError:
    print("spaCy not found. Run:  pip install spacy")
    raise

# ── PATHS ──────────────────────────────────────────────────────────────────────
PAN25_SRC_DIR = os.path.join(os.path.dirname(__file__), "..", "source_texts")
DATA_FILE     = "source_data.pkl"
FAISS_FILE    = "source_index.faiss"

MIN_SENTENCE_LEN = 15   # skip very short fragments


def split_sentences_spacy(text: str) -> list[str]:
    """Sentence-split text using spaCy sentencizer."""
    doc = nlp(text[:100_000])   # cap at 100k chars per doc for speed
    return [sent.text.strip() for sent in doc.sents
            if len(sent.text.strip()) >= MIN_SENTENCE_LEN]


def main(limit: int, batch_size: int, resume: bool):
    model = SentenceTransformer("all-MiniLM-L6-v2")

    all_files = sorted(glob.glob(os.path.join(PAN25_SRC_DIR, "*.txt")))[:limit]
    print(f"Found {len(all_files)} source files (limit={limit}). Processing in batches of {batch_size}.")

    # ── Checkpoint resume ──────────────────────────────────────────────────
    start_batch = 0
    all_sentences: list[str] = []
    all_metadata:  list[tuple[str, int]] = []

    dim = 384
    index = faiss.IndexFlatIP(dim)

    if resume and os.path.exists(DATA_FILE) and os.path.exists(FAISS_FILE):
        print(f"\n🔄 Resuming from existing checkpoint...")
        index = faiss.read_index(FAISS_FILE)
        with open(DATA_FILE, "rb") as f:
            all_sentences, all_metadata = pickle.load(f)
        # Figure out which files were already processed
        processed_files = set(meta[0] for meta in all_metadata)
        remaining = [f for f in all_files if os.path.basename(f) not in processed_files]
        all_files = remaining
        print(f"  Checkpoint has {index.ntotal} vectors. {len(all_files)} files remaining.")
    elif resume:
        print("  No checkpoint found — starting fresh.")

    # ── Process in file batches to control RAM ──────────────────────────────
    total_batches = (len(all_files) + batch_size - 1) // batch_size

    for batch_num, batch_start in enumerate(range(0, len(all_files), batch_size), start=1):
        batch_files = all_files[batch_start : batch_start + batch_size]
        print(f"\n── Batch {batch_num}/{total_batches} ({len(batch_files)} files) ──")

        batch_sentences: list[str] = []
        batch_metadata:  list[tuple[str, int]] = []

        for filepath in tqdm(batch_files, desc="  Reading & splitting"):
            filename = os.path.basename(filepath)
            try:
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    text = f.read()
                sentences = split_sentences_spacy(text)
                for i, sent in enumerate(sentences):
                    batch_sentences.append(sent)
                    batch_metadata.append((filename, i))
            except Exception as e:
                print(f"  Could not read {filename}: {e}")

        if not batch_sentences:
            continue

        print(f"  Encoding {len(batch_sentences)} sentences...")
        embeddings = model.encode(
            batch_sentences,
            convert_to_numpy=True,
            show_progress_bar=True,
            batch_size=256,
        ).astype("float32")

        faiss.normalize_L2(embeddings)
        index.add(embeddings)

        all_sentences.extend(batch_sentences)
        all_metadata.extend(batch_metadata)

        total_vecs = index.ntotal
        index_mb   = (total_vecs * dim * 4) / (1024 ** 2)
        print(f"  FAISS index now has {total_vecs:,} vectors (~{index_mb:.0f} MB on disk / in RAM).")

        # ── CHECKPOINT: Save after every batch ────────────────────────────
        print(f"  💾 Saving checkpoint...")
        faiss.write_index(index, FAISS_FILE)
        with open(DATA_FILE, "wb") as f:
            pickle.dump((all_sentences, all_metadata), f)
        print(f"  ✅ Checkpoint saved. Safe to Ctrl+C here if needed.")

    print(f"\n✅ Done! Indexed {len(all_sentences):,} sentences from {limit} documents.")
    print(f"   Files written: {FAISS_FILE} ({index.ntotal * dim * 4 / 1024**3:.2f} GB), {DATA_FILE}")
    print("\nNext step: python train_bert.py  (or python evaluate.py if BERT is done)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit",  type=int, default=5000,
                        help="Max source .txt files to index (default 5000, safe for 8GB RAM)")
    parser.add_argument("--batch",  type=int, default=500,
                        help="Files per batch (default 500)")
    parser.add_argument("--resume", action="store_true",
                        help="Resume from existing source_index.faiss checkpoint")
    args = parser.parse_args()
    main(args.limit, args.batch, args.resume)

