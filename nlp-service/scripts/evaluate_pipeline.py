"""
evaluate_pipeline.py
====================
Evaluates the full 3-layer cascade pipeline on the PAN25 test set.

For each (suspicious_text, source_text, label) row in pan25_test.csv:
  - Layer 1 only  (TF-IDF):           is_tfidf_plagiarized(suspicious_text)
  - Layer 2 only  (FAISS):            FAISS cosine(suspicious_text) ≥ 0.75
  - Layer 3 only  (BERT):             is_bert_plagiarized(suspicious_text, source_text)
  - Combined Cascade:                 The full classification logic from main.py

Outputs:
  - Per-layer confusion matrix + Precision / Recall / F1 / Accuracy
  - A markdown-formatted summary table for the research paper
  - Results saved to evaluation_pipeline_results.csv

Usage:
  cd nlp-service
  python scripts/evaluate_pipeline.py [--csv scripts/pan25_test.csv] [--limit N]
"""

import os
import sys
import csv
import time
import argparse
import numpy as np

# ── Ensure nlp-service/ is the working dir context ───────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)           # nlp-service/
os.chdir(PROJECT_DIR)
sys.path.insert(0, PROJECT_DIR)

# ── Lazy imports (these trigger model loading) ───────────────────────────────
print("=" * 70)
print("  Authintic — Full Pipeline Evaluation")
print("=" * 70)

print("\n[1/4] Loading Sentence-Transformer + FAISS index ...")
import faiss
import pickle
from sentence_transformers import SentenceTransformer

sbert_model = SentenceTransformer("all-MiniLM-L6-v2")
try:
    faiss_index = faiss.read_index("source_index.faiss")
    with open("source_data.pkl", "rb") as f:
        source_sentences, source_metadata = pickle.load(f)
    print(f"    FAISS index loaded: {faiss_index.ntotal:,} vectors")
    faiss_available = True
except Exception as e:
    print(f"    FAISS not available: {e}")
    faiss_index = None
    source_sentences, source_metadata = [], []
    faiss_available = False

print("[2/4] Loading TF-IDF index ...")
from project.tfidf_analyzer import build_tfidf_index, is_tfidf_plagiarized, tfidf_score
tfidf_ready = build_tfidf_index()

print("[3/4] Loading BERT classifier ...")
from project.bert_classifier import load_bert_model, is_bert_plagiarized, BERT_THRESHOLD
bert_ready = load_bert_model()

print("[4/4] All models loaded.\n")


# ── Thresholds (matching main.py) ────────────────────────────────────────────
DIRECT_THRESHOLD      = 0.95
PARAPHRASED_THRESHOLD = 0.75
BERT_AMBIGUOUS_LOW    = 0.40
BERT_AMBIGUOUS_HIGH   = PARAPHRASED_THRESHOLD
TFIDF_BERT_FLOOR      = 0.30
TFIDF_THRESHOLD       = 0.45


# ── Metrics helper ───────────────────────────────────────────────────────────
def compute_metrics(y_true, y_pred, label=""):
    """Returns dict with TP, FP, TN, FN, Precision, Recall, F1, Accuracy."""
    tp = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 1)
    fp = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 1)
    tn = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 0)
    fn = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 0)

    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall    = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1        = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0.0
    accuracy  = (tp + tn) / len(y_true) if len(y_true) > 0 else 0.0

    return {
        "label": label, "TP": tp, "FP": fp, "TN": tn, "FN": fn,
        "Precision": round(precision, 4),
        "Recall":    round(recall, 4),
        "F1":        round(f1, 4),
        "Accuracy":  round(accuracy * 100, 2),
    }


def print_metrics(m):
    print(f"\n  {'─' * 50}")
    print(f"  {m['label']}")
    print(f"  {'─' * 50}")
    print(f"  Confusion Matrix:")
    print(f"                   Pred Neg    Pred Pos")
    print(f"    Actual Neg     TN={m['TN']:<6d}  FP={m['FP']:<6d}")
    print(f"    Actual Pos     FN={m['FN']:<6d}  TP={m['TP']:<6d}")
    print(f"  Precision : {m['Precision']:.4f}")
    print(f"  Recall    : {m['Recall']:.4f}")
    print(f"  F1-Score  : {m['F1']:.4f}")
    print(f"  Accuracy  : {m['Accuracy']:.2f}%")


# ── Main evaluation ─────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Evaluate the 3-layer cascade pipeline")
    parser.add_argument("--csv", default=os.path.join("scripts", "pan25_test.csv"),
                        help="Path to the PAN25 test CSV (default: scripts/pan25_test.csv)")
    parser.add_argument("--limit", type=int, default=0,
                        help="Limit number of rows to evaluate (0 = all)")
    args = parser.parse_args()

    # ── Load test data ────────────────────────────────────────────────────────
    if not os.path.isfile(args.csv):
        print(f"ERROR: Test CSV not found: {args.csv}")
        sys.exit(1)

    rows = []
    with open(args.csv, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
            if args.limit and len(rows) >= args.limit:
                break

    y_true = [int(row["label"]) for row in rows]
    susp_texts = [row["suspicious_text"] for row in rows]
    src_texts  = [row["source_text"] for row in rows]
    n = len(rows)
    n_pos = sum(y_true)
    n_neg = n - n_pos

    print(f"Test set: {n:,} samples ({n_pos:,} positive, {n_neg:,} negative)")

    # ── Collectors ────────────────────────────────────────────────────────────
    pred_tfidf    = []    # Layer 1 only
    pred_faiss    = []    # Layer 2 only
    pred_bert     = []    # Layer 3 only
    pred_cascade  = []    # Combined pipeline

    # ── Batch FAISS encoding ──────────────────────────────────────────────────
    print("\nEncoding suspicious texts with SBERT ...")
    t0 = time.time()
    susp_embeddings = sbert_model.encode(susp_texts, convert_to_numpy=True,
                                         batch_size=64, show_progress_bar=True).astype("float32")
    faiss.normalize_L2(susp_embeddings)

    if faiss_available:
        D_faiss, I_faiss = faiss_index.search(susp_embeddings, 1)
    else:
        D_faiss = np.zeros((n, 1))
        I_faiss = np.zeros((n, 1), dtype=int)

    print(f"SBERT + FAISS done in {time.time() - t0:.1f}s\n")

    # ── Per-sample evaluation ─────────────────────────────────────────────────
    print("Running per-sample evaluation ...")
    t0 = time.time()

    for i in range(n):
        if (i + 1) % 200 == 0 or i == n - 1:
            print(f"  [{i+1:>{len(str(n))}d}/{n}]  "
                  f"elapsed {time.time() - t0:.1f}s", end="\r")

        susp = susp_texts[i]
        src  = src_texts[i]
        label = y_true[i]

        faiss_score  = float(D_faiss[i][0])
        source_idx   = int(I_faiss[i][0])

        # ── Layer 1: TF-IDF ──────────────────────────────────────────────────
        if tfidf_ready:
            tfidf_hit, tfidf_scr, _ = is_tfidf_plagiarized(susp)
        else:
            tfidf_hit, tfidf_scr = False, 0.0

        pred_tfidf.append(1 if tfidf_hit else 0)

        # ── Layer 2: FAISS only ──────────────────────────────────────────────
        pred_faiss.append(1 if faiss_score >= PARAPHRASED_THRESHOLD else 0)

        # ── Layer 3: BERT only (using the CSV source_text directly) ──────────
        if bert_ready:
            bert_hit, bert_prob = is_bert_plagiarized(susp, src)
        else:
            bert_hit, bert_prob = False, 0.0
        pred_bert.append(1 if bert_hit else 0)

        # ── Combined Cascade (exact logic from main.py) ──────────────────────
        cascade_flag = 0

        if faiss_score >= DIRECT_THRESHOLD or tfidf_scr >= 0.80:
            # Direct Match
            cascade_flag = 1
        elif faiss_score >= PARAPHRASED_THRESHOLD:
            # Paraphrased
            cascade_flag = 1
        elif tfidf_hit:
            # TF-IDF caught it (≥ 0.45) but FAISS was low
            cascade_flag = 1
        elif BERT_AMBIGUOUS_LOW <= faiss_score < BERT_AMBIGUOUS_HIGH:
            # BERT ambiguous zone
            if bert_ready and faiss_available and source_idx < len(source_sentences):
                matched_src = source_sentences[source_idx]
                b_hit, _ = is_bert_plagiarized(susp, matched_src)
                if b_hit:
                    cascade_flag = 1
        elif faiss_score < BERT_AMBIGUOUS_LOW and tfidf_scr >= TFIDF_BERT_FLOOR:
            # BERT fallback — TF-IDF shows some signal
            if bert_ready and faiss_available and source_idx < len(source_sentences):
                matched_src = source_sentences[source_idx]
                b_hit, _ = is_bert_plagiarized(susp, matched_src)
                if b_hit:
                    cascade_flag = 1

        pred_cascade.append(cascade_flag)

    elapsed = time.time() - t0
    print(f"\n\nEvaluation complete in {elapsed:.1f}s "
          f"({elapsed/n*1000:.1f} ms/sample avg)\n")

    # ── Compute & display metrics ─────────────────────────────────────────────
    m_tfidf   = compute_metrics(y_true, pred_tfidf,   "Layer 1 — TF-IDF (τ = 0.45)")
    m_faiss   = compute_metrics(y_true, pred_faiss,   "Layer 2 — FAISS Semantic (τ = 0.75)")
    m_bert    = compute_metrics(y_true, pred_bert,    "Layer 3 — Fine-tuned BERT (τ = 0.60)")
    m_cascade = compute_metrics(y_true, pred_cascade, "Combined — 3-Layer Cascade")

    for m in [m_tfidf, m_faiss, m_bert, m_cascade]:
        print_metrics(m)

    # ── Markdown table (for research paper) ───────────────────────────────────
    print(f"\n{'=' * 70}")
    print("  RESEARCH PAPER TABLE (copy-paste into Section V.B)")
    print(f"{'=' * 70}\n")
    print("| Layer | Method | Precision | Recall | F1-Score | Accuracy | Notes |")
    print("|---|---|:---:|:---:|:---:|:---:|---|")
    print(f"| Layer 1 | TF-IDF Cosine (τ = 0.45) | "
          f"{m_tfidf['Precision']} | {m_tfidf['Recall']} | "
          f"{m_tfidf['F1']} | {m_tfidf['Accuracy']}% | "
          f"Catches verbatim copies |")
    print(f"| Layer 2 | FAISS Semantic (τ = 0.75) | "
          f"{m_faiss['Precision']} | {m_faiss['Recall']} | "
          f"{m_faiss['F1']} | {m_faiss['Accuracy']}% | "
          f"Detects paraphrased content |")
    print(f"| Layer 3 | Fine-tuned BERT (τ = 0.60) | "
          f"{m_bert['Precision']} | {m_bert['Recall']} | "
          f"{m_bert['F1']} | {m_bert['Accuracy']}% | "
          f"Binary sentence-pair classifier |")
    print(f"| **Combined** | **3-Layer Cascade** | "
          f"**{m_cascade['Precision']}** | **{m_cascade['Recall']}** | "
          f"**{m_cascade['F1']}** | **{m_cascade['Accuracy']}%** | "
          f"**Full pipeline** |")

    # ── Save to CSV ───────────────────────────────────────────────────────────
    out_csv = os.path.join("scripts", "evaluation_pipeline_results.csv")
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "label", "TP", "FP", "TN", "FN",
            "Precision", "Recall", "F1", "Accuracy",
        ])
        writer.writeheader()
        for m in [m_tfidf, m_faiss, m_bert, m_cascade]:
            writer.writerow(m)

    print(f"\n✓ Results saved to {out_csv}")
    print(f"{'=' * 70}")


if __name__ == "__main__":
    main()
