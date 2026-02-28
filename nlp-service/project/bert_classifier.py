"""
bert_classifier.py
==================
Layer 3 of the Hybrid Detection Pipeline.

Loads the fine-tuned BERT model from bert_model/ (created by train_bert.py)
and exposes a predict() function that returns a plagiarism probability for
any (suspicious_sentence, source_sentence) pair.

Called from main.py for sentences that fall in the ambiguous range
(below the FAISS semantic threshold but above the TF-IDF noise floor).
"""

import os
import torch
from transformers import BertTokenizer, BertForSequenceClassification

# ── Configuration ─────────────────────────────────────────────────────────────
BERT_MODEL_DIR  = "bert_model"
MAX_LENGTH      = 256
BERT_THRESHOLD  = 0.60   # probability ≥ this → plagiarized

# ── Module-level globals ───────────────────────────────────────────────────────
_tokenizer:   BertTokenizer                  | None = None
_bert_model:  BertForSequenceClassification  | None = None
_device:      torch.device                         = torch.device("cpu")
_bert_ready:  bool = False


def load_bert_model() -> bool:
    """
    Loads the fine-tuned BERT model and tokenizer from bert_model/.
    Returns True on success, False if the directory doesn't exist yet.
    """
    global _tokenizer, _bert_model, _device, _bert_ready

    if not os.path.isdir(BERT_MODEL_DIR):
        print(f"[BERT] WARNING: '{BERT_MODEL_DIR}/' not found. "
              f"Run train_bert.py first. Layer 3 will be disabled.")
        return False

    print(f"[BERT] Loading fine-tuned classifier from {BERT_MODEL_DIR}/ ...")
    _device     = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    _tokenizer  = BertTokenizer.from_pretrained(BERT_MODEL_DIR)
    _bert_model = BertForSequenceClassification.from_pretrained(BERT_MODEL_DIR)
    _bert_model.to(_device)
    _bert_model.eval()
    _bert_ready = True
    print(f"[BERT] Classifier ready on {_device}.")
    return True


def bert_predict(susp_sentence: str, src_sentence: str) -> float:
    """
    Returns the probability (0.0 – 1.0) that the suspicious sentence
    is plagiarized from the source sentence.

    Returns -1.0 if the model is not loaded (Layer 3 disabled).
    """
    if not _bert_ready or _tokenizer is None or _bert_model is None:
        return -1.0

    try:
        enc = _tokenizer(
            susp_sentence,
            src_sentence,
            truncation=True,
            padding="max_length",
            max_length=MAX_LENGTH,
            return_tensors="pt",
        )
        enc = {k: v.to(_device) for k, v in enc.items()}

        with torch.no_grad():
            logits = _bert_model(**enc).logits

        prob = torch.softmax(logits, dim=1)[0, 1].item()   # P(class=1 = plagiarized)
        return float(prob)

    except Exception as e:
        print(f"[BERT] Prediction error: {e}")
        return -1.0


def is_bert_plagiarized(susp_sentence: str, src_sentence: str) -> tuple[bool, float]:
    """
    Convenience wrapper.  Returns (is_plagiarized, probability).
    Returns (False, -1.0) if the model is not available.
    """
    prob = bert_predict(susp_sentence, src_sentence)
    if prob < 0:
        return False, prob
    return prob >= BERT_THRESHOLD, prob
