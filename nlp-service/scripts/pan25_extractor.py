"""
pan25_extractor.py
==================
Step 1 of the Gold Standard pipeline.

Reads every XML truth file from the PAN25 dataset, extracts the exact
character-level passages that are annotated as plagiarized, and writes
them to a balanced CSV file suitable for BERT fine-tuning.

Output: nlp-service/pan25_pairs.csv
Schema : suspicious_text, source_text, label, obfuscation, llm

Usage  : python pan25_extractor.py [--limit N]
         --limit N  : process only the first N XML files (default: 15000)
"""

import os
import glob
import csv
import argparse
import xml.etree.ElementTree as ET
from tqdm import tqdm

# ── PATHS ─────────────────────────────────────────────────────────────────────
PAN25_ROOT = r"C:\Users\Jay_Patil\Downloads\pan25-generated-plagiarism-detection"
TRUTH_DIR  = os.path.join(PAN25_ROOT, "01_train_truth")
SUSP_DIR   = os.path.join(PAN25_ROOT, "01_train", "susp")
SRC_DIR    = os.path.join(PAN25_ROOT, "01_train", "src")
OUTPUT_CSV = "pan25_pairs.csv"

# ── HELPERS ────────────────────────────────────────────────────────────────────

def read_slice(filepath: str, offset: int, length: int) -> str:
    """Read a character slice from a UTF-8 text file."""
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        return content[offset : offset + length].strip()
    except FileNotFoundError:
        return ""


def is_valid_text(text: str, min_len: int = 40) -> bool:
    """Reject very short or empty passages."""
    return len(text.strip()) >= min_len


# ── MAIN ───────────────────────────────────────────────────────────────────────

def main(limit: int):
    xml_files = sorted(glob.glob(os.path.join(TRUTH_DIR, "*.xml")))[:limit]
    print(f"Processing {len(xml_files)} XML truth files (limit={limit})...")

    plagiarized_pairs = []   # label = 1
    original_pairs    = []   # label = 0  (negative — used for balance)

    for xml_path in tqdm(xml_files, desc="Extracting pairs"):
        try:
            tree = ET.parse(xml_path)
            root = tree.getroot()
        except ET.ParseError:
            continue

        # Derive file names from XML root attribute
        susp_ref = root.get("reference", "")          # e.g. "suspicious-document020468.txt"
        susp_path = os.path.join(SUSP_DIR, susp_ref)

        for feat in root.findall("feature"):
            name = feat.get("name", "")

            # ── Plagiarized pair ────────────────────────────────────────────
            if name == "plagiarism":
                src_ref    = feat.get("source_reference", "")
                obfuscation = feat.get("obfuscation", "unknown")
                llm_used   = feat.get("llm", "unknown")

                susp_offset = int(feat.get("this_offset", 0))
                susp_length = int(feat.get("this_length", 0))
                src_offset  = int(feat.get("source_offset", 0))
                src_length  = int(feat.get("source_length", 0))

                src_path = os.path.join(SRC_DIR, src_ref)
                susp_text = read_slice(susp_path, susp_offset, susp_length)
                src_text  = read_slice(src_path,  src_offset,  src_length)

                if is_valid_text(susp_text) and is_valid_text(src_text):
                    plagiarized_pairs.append({
                        "suspicious_text": susp_text[:1000],  # truncate for memory
                        "source_text":     src_text[:1000],
                        "label":           1,
                        "obfuscation":     obfuscation,
                        "llm":             llm_used,
                    })

            # ── Negative sample: "altered" sections are NOT plagiarism ──────
            elif name == "altered":
                alt_offset = int(feat.get("this_offset", 0))
                alt_length = int(feat.get("this_length", 0))
                susp_text  = read_slice(susp_path, alt_offset, alt_length)

                # Pair altered passage with a random same-file source passage
                # (they won't match → label 0)
                if is_valid_text(susp_text):
                    original_pairs.append({
                        "suspicious_text": susp_text[:1000],
                        "source_text":     susp_text[:1000],   # same doc, not a real match
                        "label":           0,
                        "obfuscation":     "none",
                        "llm":             "none",
                    })

    # ── Balance the dataset ────────────────────────────────────────────────────
    n_pos = len(plagiarized_pairs)
    n_neg = min(len(original_pairs), n_pos)   # equal positive/negative
    balanced = plagiarized_pairs[:n_pos] + original_pairs[:n_neg]

    print(f"\nExtracted {n_pos} plagiarized pairs.")
    print(f"Using    {n_neg} original pairs  (balanced).")
    print(f"Total    {len(balanced)} rows → {OUTPUT_CSV}")

    # ── Write CSV ──────────────────────────────────────────────────────────────
    fieldnames = ["suspicious_text", "source_text", "label", "obfuscation", "llm"]
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(balanced)

    print("Done! Run train_bert.py next.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=15000,
                        help="Max XML files to process (default 15000 → ~50k+ pairs)")
    args = parser.parse_args()
    main(args.limit)
