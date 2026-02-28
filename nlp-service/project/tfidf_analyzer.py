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
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity as sklearn_cosine

# ── Configuration ─────────────────────────────────────────────────────────────
SOURCE_DIR       = "source_texts"
TFIDF_THRESHOLD  = 0.45   # cosine ≥ this → "Direct Match" by TF-IDF
MAX_FEATURES     = 100_000
NGRAM_RANGE      = (1, 2)  # unigrams + bigrams

# ── Module-level globals (populated by build_tfidf_index) ─────────────────────
_vectorizer:   TfidfVectorizer | None = None
_source_matrix = None       # sparse (n_docs × n_features)
_source_files: list[str] = []


def build_tfidf_index() -> bool:
    """
    Reads all .txt files from source_texts/, fits and transforms them
    into a TF-IDF matrix stored in module globals.

    Returns True on success, False if no files are found.
    """
    global _vectorizer, _source_matrix, _source_files

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
