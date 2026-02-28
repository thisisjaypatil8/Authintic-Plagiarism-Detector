"""
evaluate.py
===========
Step 4 of the Gold Standard pipeline.

Evaluates all three detection layers independently on the held-out test set
from pan25_test.csv (created by train_bert.py).

Reports Precision / Recall / F1 / Accuracy for:
  - Layer 1: TF-IDF cosine similarity baseline
  - Layer 2: Sentence-BERT + FAISS semantic retrieval (existing system)
  - Layer 3: Fine-tuned BERT classifier
  - Combined Hybrid

Results are printed to terminal and also saved to evaluation_results.csv

Usage : python evaluate.py [--threshold2 FLOAT] [--threshold3 FLOAT]
"""

import os
import pickle
import argparse
import pandas as pd
import numpy as np
import faiss
import torch
from tqdm import tqdm
from sklearn.metrics import precision_recall_fscore_support, accuracy_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from transformers import BertTokenizer, BertForSequenceClassification

# ── PATHS ──────────────────────────────────────────────────────────────────────
BERT_MODEL_DIR = "bert_model"
FAISS_INDEX    = "source_index.faiss"
SOURCE_DATA    = "source_data.pkl"
TEST_CSV       = "pan25_test.csv"
RESULTS_CSV    = "evaluation_results.csv"

# ── Thresholds ─────────────────────────────────────────────────────────────────
TFIDF_THRESHOLD  = 0.50   # Layer 1: TF-IDF cosine ≥ this → plagiarized
FAISS_L2_THRESH  = 0.75   # Layer 2: semantic similarity ≥ this → plagiarized
BERT_PROB_THRESH = 0.60   # Layer 3: BERT probability ≥ this → plagiarized


def compute_metrics(y_true, y_pred, name):
    p, r, f1, _ = precision_recall_fscore_support(y_true, y_pred, average="binary", zero_division=0)
    acc = accuracy_score(y_true, y_pred)
    print(f"\n{'─'*55}")
    print(f"  {name}")
    print(f"{'─'*55}")
    print(f"  Precision : {p:.4f}  ({p*100:.2f}%)")
    print(f"  Recall    : {r:.4f}  ({r*100:.2f}%)")
    print(f"  F1 Score  : {f1:.4f}")
    print(f"  Accuracy  : {acc:.4f}  ({acc*100:.2f}%)")
    return {"method": name, "precision": round(p, 4), "recall": round(r, 4),
            "f1": round(f1, 4), "accuracy": round(acc, 4)}


def main(thresh2: float, thresh3: float):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # ── Load test data ─────────────────────────────────────────────────────────
    print(f"Loading test set from {TEST_CSV} ...")
    df = pd.read_csv(TEST_CSV).dropna().reset_index(drop=True)
    y_true      = df["label"].tolist()
    susp_texts  = df["suspicious_text"].tolist()
    src_texts   = df["source_text"].tolist()
    print(f"Test set: {len(df)} rows  |  Positive: {sum(y_true)}  |  Negative: {len(y_true)-sum(y_true)}")

    results = []

    # ══════════════════════════════════════════════════════════════════════════
    # LAYER 1 — TF-IDF
    # ══════════════════════════════════════════════════════════════════════════
    print("\n[Layer 1] Computing TF-IDF cosine similarities ...")
    vectorizer = TfidfVectorizer(max_features=50000, ngram_range=(1, 2))
    all_texts  = susp_texts + src_texts
    vectorizer.fit(all_texts)

    susp_vecs = vectorizer.transform(susp_texts)
    src_vecs  = vectorizer.transform(src_texts)

    # Pairwise cosine similarity for each (susp, src) pair
    tfidf_preds = []
    for i in tqdm(range(len(susp_texts)), desc="  TF-IDF scoring"):
        sim = cosine_similarity(susp_vecs[i], src_vecs[i])[0][0]
        tfidf_preds.append(1 if sim >= TFIDF_THRESHOLD else 0)

    results.append(compute_metrics(y_true, tfidf_preds, "Layer 1: TF-IDF Baseline"))

    # ══════════════════════════════════════════════════════════════════════════
    # LAYER 2 — Sentence-BERT + FAISS
    # ══════════════════════════════════════════════════════════════════════════
    print("\n[Layer 2] Loading FAISS index and sentence-transformer ...")
    if not os.path.exists(FAISS_INDEX) or not os.path.exists(SOURCE_DATA):
        print(f"  ⚠️  {FAISS_INDEX} or {SOURCE_DATA} not found. Skipping Layer 2.")
        semantic_preds = [0] * len(y_true)
    else:
        faiss_index = faiss.read_index(FAISS_INDEX)
        with open(SOURCE_DATA, "rb") as f:
            source_sentences, _ = pickle.load(f)

        sem_model = SentenceTransformer("all-MiniLM-L6-v2")

        # Encode suspicious texts
        print("  Encoding suspicious texts ...")
        susp_embs = sem_model.encode(susp_texts, convert_to_numpy=True,
                                      show_progress_bar=True, batch_size=128).astype("float32")
        faiss.normalize_L2(susp_embs)

        D, _ = faiss_index.search(susp_embs, 1)   # top-1 nearest neighbour
        semantic_preds = [1 if d[0] >= thresh2 else 0 for d in D]

    results.append(compute_metrics(y_true, semantic_preds, "Layer 2: Semantic FAISS"))

    # ══════════════════════════════════════════════════════════════════════════
    # LAYER 3 — Fine-tuned BERT
    # ══════════════════════════════════════════════════════════════════════════
    print("\n[Layer 3] Loading fine-tuned BERT classifier ...")
    if not os.path.exists(BERT_MODEL_DIR):
        print(f"  ⚠️  {BERT_MODEL_DIR}/ not found. Run train_bert.py first. Skipping Layer 3.")
        bert_preds = [0] * len(y_true)
    else:
        tokenizer  = BertTokenizer.from_pretrained(BERT_MODEL_DIR)
        bert_model = BertForSequenceClassification.from_pretrained(BERT_MODEL_DIR)
        bert_model.to(device)
        bert_model.eval()

        bert_preds = []
        BERT_BATCH = 16
        for i in tqdm(range(0, len(susp_texts), BERT_BATCH), desc="  BERT inference"):
            batch_susp = susp_texts[i : i + BERT_BATCH]
            batch_src  = src_texts[i  : i + BERT_BATCH]
            enc = tokenizer(batch_susp, batch_src,
                            truncation=True, padding="max_length",
                            max_length=256, return_tensors="pt")
            with torch.no_grad():
                logits = bert_model(**enc.to(device)).logits
            probs = torch.softmax(logits, dim=1)[:, 1].cpu().numpy()
            bert_preds.extend([1 if p >= thresh3 else 0 for p in probs])

    results.append(compute_metrics(y_true, bert_preds, "Layer 3: Fine-tuned BERT"))

    # ══════════════════════════════════════════════════════════════════════════
    # COMBINED HYBRID
    # ══════════════════════════════════════════════════════════════════════════
    # Hybrid: flag as plagiarized if ANY layer says yes (OR strategy → max recall)
    hybrid_preds = [
        1 if (tfidf_preds[i] or semantic_preds[i] or bert_preds[i]) else 0
        for i in range(len(y_true))
    ]
    results.append(compute_metrics(y_true, hybrid_preds, "Hybrid: All Layers (OR)"))

    # ── Save results ──────────────────────────────────────────────────────────
    results_df = pd.DataFrame(results)
    results_df.to_csv(RESULTS_CSV, index=False)
    print(f"\n\n{'═'*55}")
    print(f"  Results saved to {RESULTS_CSV}")
    print(f"  Copy these numbers into your research paper!")
    print(f"{'═'*55}")
    print(results_df.to_string(index=False))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--threshold2", type=float, default=FAISS_L2_THRESH,
                        help=f"FAISS similarity threshold for Layer 2 (default {FAISS_L2_THRESH})")
    parser.add_argument("--threshold3", type=float, default=BERT_PROB_THRESH,
                        help=f"BERT probability threshold for Layer 3 (default {BERT_PROB_THRESH})")
    args = parser.parse_args()
    main(args.threshold2, args.threshold3)
