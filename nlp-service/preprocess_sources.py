import os
import glob
import pickle
import numpy as np
import faiss
import nltk
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

# --- SETUP ---
model = SentenceTransformer('all-MiniLM-L6-v2')
SOURCE_DIR = "source_texts"
DATA_FILE = 'source_data.pkl'
FAISS_INDEX_FILE = 'source_index.faiss'

# Download NLTK 'punkt' tokenizer if not present
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

# --- DATA CONTAINERS ---
all_source_sentences = []
source_metadata = [] # Stores (filename, sentence_index) for each sentence

# --- 1. LOAD AND SPLIT ALL DOCUMENTS ---
print(f"Loading and sentence-splitting all files from {SOURCE_DIR}...")
source_files = sorted(glob.glob(f"{SOURCE_DIR}/*.txt"))

if not source_files:
    print(f"ERROR: No .txt files found in '{SOURCE_DIR}'. Please add source files.")
    exit()

for filepath in source_files:
    filename = os.path.basename(filepath)
    print(f"Processing: {filename}")
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            text = f.read()
            sentences = nltk.sent_tokenize(text)

            for i, sentence in enumerate(sentences):
                if len(sentence.strip()) > 10: # Only process meaningful sentences
                    all_source_sentences.append(sentence.strip())
                    source_metadata.append( (filename, i) ) # Link sentence to file and its index
    except Exception as e:
        print(f"Could not read {filename}: {e}")

print(f"\nFound {len(all_source_sentences)} total sentences from {len(source_files)} documents.")

# --- 2. COMPUTE EMBEDDINGS ---
print("Computing embeddings for all sentences (this may take a while)...")
embs = model.encode(all_source_sentences, convert_to_numpy=True, show_progress_bar=True)
embs = embs.astype('float32') # FAISS requires float32

# --- 3. NORMALIZE & BUILD FAISS INDEX (FOR COSINE SIMILARITY) ---
print("Normalizing embeddings and building FAISS index...")
faiss.normalize_L2(embs) # Normalize vectors

d = embs.shape[1]
index = faiss.IndexFlatIP(d) # Inner Product on normalized vectors = Cosine Similarity
index.add(embs)

# --- 4. SAVE ALL ARTIFACTS ---
faiss.write_index(index, FAISS_INDEX_FILE)

# Save the sentence list and its metadata
with open(DATA_FILE, 'wb') as f:
    pickle.dump((all_source_sentences, source_metadata), f)

print("\nPreprocessing complete!")
print(f"Files created: {FAISS_INDEX_FILE}, {DATA_FILE}")