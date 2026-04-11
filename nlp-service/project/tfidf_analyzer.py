"""
tfidf_analyzer.py
=================
Layer 1 of the Hybrid Detection Pipeline.

Builds a TF-IDF matrix from all source .txt files in the source_texts/
directory and provides a fast cosine-similarity scorer for any query
sentence.  This layer catches near-verbatim copies quickly before the
more expensive semantic and BERT layers run.

IMPORTANT: Call build_tfidf_index() once at startup (called from loader.py).
"""

import os
import glob
import numpy as np
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity as sklearn_cosine

# ── Configuration ─────────────────────────────────────────────────────────────
SOURCE_DIR       = "source_texts"
TFIDF_THRESHOLD  = 0.45   # cosine ≥ this → "Direct Match" by TF-IDF
MAX_FEATURES     = 100_000
NGRAM_RANGE      = (1, 2)  # unigrams + bigrams
INDEX_FILE       = "tfidf_index.joblib"

# ── Module-level globals (populated by build_tfidf_index) ─────────────────────
_vectorizer:   TfidfVectorizer | None = None
_source_matrix = None       # sparse (n_docs × n_features)
_source_files: list[str] = []


def build_tfidf_index() -> bool:
    """
    Attempts to load a pre-computed TF-IDF index from disk to save boot time.
    If not found, reads all .txt files from source_texts/, fits a new TF-IDF
    matrix, and saves it to disk for future fast-loading.

    Returns True on success, False if no files are found.
    """
    global _vectorizer, _source_matrix, _source_files

    if os.path.exists(INDEX_FILE):
        print(f"[TF-IDF] Loading pre-computed index from '{INDEX_FILE}'...")
        try:
            data = joblib.load(INDEX_FILE)
            _vectorizer = data['vectorizer']
            _source_matrix = data['matrix']
            _source_files = data['files']
            print(f"[TF-IDF] Index loaded successfully. Matrix shape: {_source_matrix.shape}")
            return True
        except Exception as e:
            print(f"[TF-IDF] Error loading pre-computed index: {e}. Building from scratch...")

    txt_files = sorted(glob.glob(os.path.join(SOURCE_DIR, "*.txt")))
    if not txt_files:
        print(f"[TF-IDF] WARNING: No .txt files found in '{SOURCE_DIR}'. Layer 1 disabled.")
        return False

    print(f"[TF-IDF] Building index from {len(txt_files)} source files ...")
    docs = []
    for fp in txt_files:
        try:
            with open(fp, "r", encoding="utf-8", errors="ignore") as f:
                docs.append(f.read()[:50_000])   # cap per-doc to save RAM
        except Exception:
            docs.append("")

    _vectorizer   = TfidfVectorizer(max_features=MAX_FEATURES, ngram_range=NGRAM_RANGE)
    _source_matrix = _vectorizer.fit_transform(docs)
    _source_files  = [os.path.basename(fp) for fp in txt_files]
    
    print(f"[TF-IDF] Index ready. Matrix shape: {_source_matrix.shape}")
    
    print(f"[TF-IDF] Saving to disk: '{INDEX_FILE}'...")
    try:
        joblib.dump({
            'vectorizer': _vectorizer,
            'matrix': _source_matrix,
            'files': _source_files
        }, INDEX_FILE)
        print("[TF-IDF] Saved successfully.")
    except Exception as e:
        print(f"[TF-IDF] Failed to save pre-computed index: {e}")

    return True


def tfidf_score(query_sentence: str) -> tuple[float, str]:
    """
    Returns (best_cosine_similarity, matched_source_filename).

    If the index is not built or the vectorizer isn't ready, returns (0.0, "").
    """
    if _vectorizer is None or _source_matrix is None:
        return 0.0, ""

    try:
        query_vec = _vectorizer.transform([query_sentence])
        sims      = sklearn_cosine(query_vec, _source_matrix).flatten()
        best_idx  = int(np.argmax(sims))
        return float(sims[best_idx]), _source_files[best_idx]
    except Exception as e:
        print(f"[TF-IDF] Scoring error: {e}")
        return 0.0, ""


def is_tfidf_plagiarized(query_sentence: str) -> tuple[bool, float, str]:
    """
    Convenience wrapper.  Returns (is_plagiarized, score, matched_filename).
    """
    score, filename = tfidf_score(query_sentence)
    return score >= TFIDF_THRESHOLD, score, filename
