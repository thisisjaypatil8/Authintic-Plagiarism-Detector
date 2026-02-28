"""
train_bert.py
=============
Step 3 of the Gold Standard pipeline.

Fine-tunes bert-base-uncased as a binary plagiarism detector on the
pairs extracted by pan25_extractor.py.

Input : pan25_pairs.csv  (created by pan25_extractor.py)
Output: bert_model/      (directory with saved fine-tuned model + tokenizer)

Hardware: Configured for 8 GB RAM, no GPU required.

Usage : python train_bert.py [--rows N] [--epochs E] [--batch B]
        --rows   N : rows to use from CSV  (default: 20000 → 10k train / 2k val)
        --epochs E : training epochs       (default: 3)
        --batch  B : per-device batch size (default: 8)

ETA   : ~2-4 hours on 12-core CPU.  Run overnight.
"""

import os
import argparse
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_recall_fscore_support, accuracy_score

import torch
from torch.utils.data import Dataset, DataLoader
from torch.optim import AdamW
from transformers import (
    BertTokenizer,
    BertForSequenceClassification,
    get_linear_schedule_with_warmup,
)
from tqdm import tqdm

# ── Settings ──────────────────────────────────────────────────────────────────
MODEL_NAME  = "bert-base-uncased"
OUTPUT_DIR  = "bert_model"
CSV_PATH    = "pan25_pairs.csv"
MAX_LENGTH  = 256      # truncate to fit 8 GB RAM
SEED        = 42

# ── Dataset class ─────────────────────────────────────────────────────────────

class PlagiarismDataset(Dataset):
    def __init__(self, texts_a, texts_b, labels, tokenizer, max_len):
        self.encodings = tokenizer(
            list(texts_a),
            list(texts_b),
            truncation=True,
            padding="max_length",
            max_length=max_len,
            return_tensors="pt",
        )
        self.labels = torch.tensor(list(labels), dtype=torch.long)

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        return {
            "input_ids":      self.encodings["input_ids"][idx],
            "attention_mask": self.encodings["attention_mask"][idx],
            "token_type_ids": self.encodings.get("token_type_ids", torch.zeros(1))[idx]
                              if "token_type_ids" in self.encodings else torch.zeros(MAX_LENGTH, dtype=torch.long),
            "labels":         self.labels[idx],
        }


# ── Evaluation helper ─────────────────────────────────────────────────────────

def evaluate_model(model, loader, device):
    model.eval()
    all_preds, all_labels = [], []
    with torch.no_grad():
        for batch in tqdm(loader, desc="  Evaluating", leave=False):
            ids   = batch["input_ids"].to(device)
            mask  = batch["attention_mask"].to(device)
            types = batch["token_type_ids"].to(device)
            lbls  = batch["labels"].to(device)
            out   = model(ids, attention_mask=mask, token_type_ids=types)
            preds = torch.argmax(out.logits, dim=1)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(lbls.cpu().numpy())
    p, r, f1, _ = precision_recall_fscore_support(all_labels, all_preds, average="binary")
    acc = accuracy_score(all_labels, all_preds)
    return {"precision": p, "recall": r, "f1": f1, "accuracy": acc}


# ── Main ──────────────────────────────────────────────────────────────────────

def main(n_rows: int, n_epochs: int, batch_size: int):
    torch.manual_seed(SEED)
    np.random.seed(SEED)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}  |  Batch size: {batch_size}  |  Epochs: {n_epochs}")

    # ── Load data ─────────────────────────────────────────────────────────────
    print(f"\nLoading {CSV_PATH} ...")
    df = pd.read_csv(CSV_PATH, nrows=n_rows).dropna()
    df = df.sample(frac=1, random_state=SEED).reset_index(drop=True)

    # Label distribution
    n_pos = (df["label"] == 1).sum()
    n_neg = (df["label"] == 0).sum()
    print(f"Loaded {len(df)} rows  |  Positive: {n_pos}  |  Negative: {n_neg}")

    # Train / val / test split  (80 / 10 / 10)
    train_df, temp_df = train_test_split(df, test_size=0.20, random_state=SEED, stratify=df["label"])
    val_df,   test_df = train_test_split(temp_df, test_size=0.50, random_state=SEED, stratify=temp_df["label"])
    print(f"Split → Train: {len(train_df)} | Val: {len(val_df)} | Test: {len(test_df)}")

    # Save the test set to disk so evaluate.py can use it
    test_df.to_csv("pan25_test.csv", index=False)
    print("Saved pan25_test.csv for use by evaluate.py")

    # ── Tokenizer + model ─────────────────────────────────────────────────────
    print(f"\nLoading tokenizer / model: {MODEL_NAME} ...")
    tokenizer = BertTokenizer.from_pretrained(MODEL_NAME)
    model     = BertForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=2)
    model.to(device)

    # ── Datasets + loaders ───────────────────────────────────────────────────
    train_ds = PlagiarismDataset(train_df["suspicious_text"], train_df["source_text"],
                                  train_df["label"], tokenizer, MAX_LENGTH)
    val_ds   = PlagiarismDataset(val_df["suspicious_text"],   val_df["source_text"],
                                  val_df["label"],   tokenizer, MAX_LENGTH)

    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True,  num_workers=0)
    val_loader   = DataLoader(val_ds,   batch_size=batch_size, shuffle=False, num_workers=0)

    # ── Optimiser + scheduler ─────────────────────────────────────────────────
    total_steps   = len(train_loader) * n_epochs
    warmup_steps  = total_steps // 10
    optimiser     = AdamW(model.parameters(), lr=2e-5, weight_decay=0.01)
    scheduler     = get_linear_schedule_with_warmup(optimiser, warmup_steps, total_steps)

    # ── Training loop ─────────────────────────────────────────────────────────
    best_f1 = 0.0
    for epoch in range(1, n_epochs + 1):
        print(f"\n══ Epoch {epoch}/{n_epochs} ══")
        model.train()
        running_loss = 0.0

        for batch in tqdm(train_loader, desc=f"  Training epoch {epoch}"):
            ids   = batch["input_ids"].to(device)
            mask  = batch["attention_mask"].to(device)
            types = batch["token_type_ids"].to(device)
            lbls  = batch["labels"].to(device)

            optimiser.zero_grad()
            out  = model(ids, attention_mask=mask, token_type_ids=types, labels=lbls)
            loss = out.loss
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimiser.step()
            scheduler.step()
            running_loss += loss.item()

        avg_loss = running_loss / len(train_loader)
        print(f"  Train loss: {avg_loss:.4f}")

        # Validation
        val_metrics = evaluate_model(model, val_loader, device)
        print(f"  Val → Precision: {val_metrics['precision']:.4f}  "
              f"Recall: {val_metrics['recall']:.4f}  "
              f"F1: {val_metrics['f1']:.4f}  "
              f"Accuracy: {val_metrics['accuracy']:.4f}")

        if val_metrics["f1"] > best_f1:
            best_f1 = val_metrics["f1"]
            model.save_pretrained(OUTPUT_DIR)
            tokenizer.save_pretrained(OUTPUT_DIR)
            print(f"  ✅ Best model saved to {OUTPUT_DIR}/  (F1={best_f1:.4f})")

    print(f"\nTraining complete. Best validation F1: {best_f1:.4f}")
    print("Next step: python evaluate.py")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--rows",   type=int, default=20000, help="Rows from CSV (default 20000)")
    parser.add_argument("--epochs", type=int, default=3,     help="Training epochs (default 3)")
    parser.add_argument("--batch",  type=int, default=8,     help="Batch size (default 8, safe for 8GB RAM)")
    args = parser.parse_args()
    main(args.rows, args.epochs, args.batch)
