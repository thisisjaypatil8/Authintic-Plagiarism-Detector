"""
pan25_extractor.py  (v3 — Strict Row Limit + Early Exit)
========================================================
Step 1 of the Gold Standard pipeline.

KEY FIXES (v3):
  - --limit N now controls TOTAL OUTPUT ROWS, not XML file count.
    e.g. --limit 20000 → exactly 20,000 total pairs:
      pan25_train.csv  = 16,000 rows (80%)
      pan25_val.csv    =  2,000 rows (10%)
      pan25_test.csv   =  2,000 rows (10%)
  - Early exit: stops reading XML files the moment a split's quota
    is filled. Does NOT parse all 183K files.
  - Document-level split: XMLs are divided into 3 groups first.
    No source document leaks across splits.
  - Hard negatives: negative pairs use a source passage from a
    DIFFERENT document in the same split.
  - Strict 50/50 balance in every CSV.

Output: pan25_train.csv, pan25_val.csv, pan25_test.csv
Schema: suspicious_text, source_text, label

Usage : python pan25_extractor.py [--limit N] [--seed S]
        --limit N : total output rows across ALL splits (default 20000)
        --seed  S : random seed for deterministic splits (default 42)
"""

import os
import glob
import csv
import random
import argparse
import xml.etree.ElementTree as ET
from tqdm import tqdm

# ── PATHS (set PAN25_ROOT env var for Colab) ──────────────────────────────────
PAN25_ROOT = os.environ.get(
    "PAN25_ROOT",
    r"C:\Users\Jay_Patil\Downloads\pan25-generated-plagiarism-detection",
)
TRUTH_DIR = os.path.join(PAN25_ROOT, "01_train_truth")
SUSP_DIR  = os.path.join(PAN25_ROOT, "01_train", "susp")
SRC_DIR   = os.path.join(PAN25_ROOT, "01_train", "src")

TRAIN_CSV = "pan25_train.csv"
VAL_CSV   = "pan25_val.csv"
TEST_CSV  = "pan25_test.csv"

MIN_TEXT_LEN = 40   # skip passages shorter than this


# ── HELPERS ───────────────────────────────────────────────────────────────────

def read_slice(filepath: str, offset: int, length: int) -> str:
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        return content[offset : offset + length].strip()
    except FileNotFoundError:
        return ""


# ── DOCUMENT-LEVEL SPLITTING ──────────────────────────────────────────────────

def split_documents(xml_files: list, seed: int, train_r=0.80, val_r=0.10):
    """Split XML files into Train/Val/Test at DOCUMENT level."""
    rng = random.Random(seed)
    rng.shuffle(xml_files)

    n = len(xml_files)
    n_train = int(n * train_r)
    n_val   = int(n * val_r)

    train_xmls = xml_files[:n_train]
    val_xmls   = xml_files[n_train : n_train + n_val]
    test_xmls  = xml_files[n_train + n_val:]

    print(f"  Document-level split: "
          f"Train={len(train_xmls)}, Val={len(val_xmls)}, Test={len(test_xmls)}")
    return train_xmls, val_xmls, test_xmls


# ── PAIR EXTRACTION WITH EARLY EXIT ──────────────────────────────────────────

def extract_pairs_with_quota(xml_files: list, max_positives: int,
                              seed: int, split_name: str) -> list:
    """
    Extract pairs from XMLs until max_positives is reached, then STOP.
    For each positive, one hard negative is created (cross-document).
    Total output = max_positives * 2 (50/50 balanced).
    """
    rng = random.Random(seed)

    positives = []      # (susp_text, src_text, 1)
    src_pool  = []      # pool of source passages for hard negatives

    for xml_path in tqdm(xml_files, desc=f"  {split_name}", leave=False):
        # ── Early exit ────────────────────────────────────────────────
        if len(positives) >= max_positives:
            break

        try:
            tree = ET.parse(xml_path)
            root = tree.getroot()
        except ET.ParseError:
            continue

        susp_ref  = root.get("reference", "")
        susp_path = os.path.join(SUSP_DIR, susp_ref)

        for feat in root.findall("feature"):
            if len(positives) >= max_positives:
                break

            if feat.get("name", "") != "plagiarism":
                continue

            src_ref     = feat.get("source_reference", "")
            susp_offset = int(feat.get("this_offset", 0))
            susp_length = int(feat.get("this_length", 0))
            src_offset  = int(feat.get("source_offset", 0))
            src_length  = int(feat.get("source_length", 0))

            src_path  = os.path.join(SRC_DIR, src_ref)
            susp_text = read_slice(susp_path, susp_offset, susp_length)
            src_text  = read_slice(src_path,  src_offset,  src_length)

            if len(susp_text) < MIN_TEXT_LEN or len(src_text) < MIN_TEXT_LEN:
                continue

            positives.append({
                "suspicious_text": susp_text[:1000],
                "source_text":     src_text[:1000],
                "label":           1,
                "src_ref":         src_ref,
            })
            src_pool.append({
                "text":    src_text[:1000],
                "src_ref": src_ref,
            })

    if not positives:
        return []

    # ── Hard negatives (cross-document pairing) ───────────────────────
    negatives = []
    max_attempts = 15

    for pos in positives:
        for _ in range(max_attempts):
            neg_src = rng.choice(src_pool)
            if neg_src["src_ref"] != pos["src_ref"]:
                negatives.append({
                    "suspicious_text": pos["suspicious_text"],
                    "source_text":     neg_src["text"],
                    "label":           0,
                })
                break

    # ── Balance 50/50 ─────────────────────────────────────────────────
    n_use = min(len(positives), len(negatives))
    clean_pos = [
        {"suspicious_text": p["suspicious_text"],
         "source_text": p["source_text"], "label": 1}
        for p in positives[:n_use]
    ]
    balanced = clean_pos + negatives[:n_use]
    rng.shuffle(balanced)

    return balanced


def write_csv(rows: list, filepath: str):
    fieldnames = ["suspicious_text", "source_text", "label"]
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


# ── MAIN ──────────────────────────────────────────────────────────────────────

def main(total_limit: int, seed: int):
    # Calculate per-split POSITIVE quotas (each split is 50/50, so half are pos)
    # total_limit = total rows across all 3 CSVs
    # 80/10/10 split of total rows
    train_rows = int(total_limit * 0.80)
    val_rows   = int(total_limit * 0.10)
    test_rows  = total_limit - train_rows - val_rows  # remainder

    # Each CSV is 50/50, so positives needed = rows / 2
    train_pos_quota = train_rows // 2
    val_pos_quota   = val_rows // 2
    test_pos_quota  = test_rows // 2

    print(f"{'='*60}")
    print(f"Target: {total_limit:,} total rows ({train_rows:,} / {val_rows:,} / {test_rows:,})")
    print(f"Positive quotas: Train={train_pos_quota:,}, Val={val_pos_quota:,}, Test={test_pos_quota:,}")
    print(f"{'='*60}")

    # ── Load all XMLs ─────────────────────────────────────────────────
    all_xmls = sorted(glob.glob(os.path.join(TRUTH_DIR, "*.xml")))
    print(f"\nFound {len(all_xmls):,} XML truth files")

    if not all_xmls:
        print(f"ERROR: No XML files found in {TRUTH_DIR}")
        print("  Set PAN25_ROOT env variable to your dataset location.")
        return

    # ── Step 1: Document-level split ──────────────────────────────────
    train_xmls, val_xmls, test_xmls = split_documents(all_xmls, seed)

    # ── Step 2: Extract with per-split quotas (early exit) ────────────
    print("\n── Extracting TRAIN pairs ──")
    train_pairs = extract_pairs_with_quota(
        train_xmls, train_pos_quota, seed, "Train")

    print("── Extracting VAL pairs ──")
    val_pairs = extract_pairs_with_quota(
        val_xmls, val_pos_quota, seed + 1, "Val")

    print("── Extracting TEST pairs ──")
    test_pairs = extract_pairs_with_quota(
        test_xmls, test_pos_quota, seed + 2, "Test")

    # ── Step 3: Write CSVs ────────────────────────────────────────────
    write_csv(train_pairs, TRAIN_CSV)
    write_csv(val_pairs,   VAL_CSV)
    write_csv(test_pairs,  TEST_CSV)

    print(f"\n{'='*60}")
    print(f"{'Split':8s} {'Rows':>8s}   {'Pos':>6s}   {'Neg':>6s}   {'Balance':>8s}")
    print(f"{'─'*60}")
    for name, pairs in [("Train", train_pairs),
                         ("Val",   val_pairs),
                         ("Test",  test_pairs)]:
        n_pos = sum(1 for p in pairs if p["label"] == 1)
        n_neg = sum(1 for p in pairs if p["label"] == 0)
        ratio = f"{n_pos/(n_pos+n_neg)*100:.1f}%" if pairs else "N/A"
        print(f"  {name:6s} {len(pairs):>8,}   {n_pos:>6,}   {n_neg:>6,}   {ratio:>8s}")
    total = len(train_pairs) + len(val_pairs) + len(test_pairs)
    print(f"{'─'*60}")
    print(f"  {'TOTAL':6s} {total:>8,}")
    print(f"{'='*60}")

    print(f"\nFiles: {TRAIN_CSV}, {VAL_CSV}, {TEST_CSV}")
    print("Next step: python train_bert.py")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=20000,
                        help="Total output rows across ALL splits (default 20000)")
    parser.add_argument("--seed",  type=int, default=42,
                        help="Random seed for deterministic splits")
    args = parser.parse_args()
    main(args.limit, args.seed)
