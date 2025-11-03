# nlp-service/preprocess_sources.py

import os
import glob
import numpy as np
from sentence_transformers import SentenceTransformer
import torch
import pickle
from tqdm import tqdm # For a nice progress bar

# Try to import faiss; if unavailable, provide a minimal numpy-based fallback
try:
    import faiss
except Exception:
    print("Warning: 'faiss' not installed; falling back to a slower numpy-based index. "
          "Install 'faiss-cpu' via pip or 'conda install -c conda-forge faiss-cpu' for better performance.")
    class _LocalIndex:
        def __init__(self, dim):
            self._dim = dim
            self.vectors = np.empty((0, dim), dtype='float32')

        def add(self, x):
            x = np.asarray(x, dtype='float32')
            if x.ndim == 1:
                x = x.reshape(1, -1)
            self.vectors = np.vstack((self.vectors, x))

        @property
        def ntotal(self):
            return int(self.vectors.shape[0])

    class _FaissFallbackModule:
        IndexFlatL2 = _LocalIndex

        @staticmethod
        def write_index(index, filepath):
            # Save as numpy file for fallback; use .npy extension
            np.save(filepath + '.npy', index.vectors)

    faiss = _FaissFallbackModule()
from tqdm import tqdm # For a nice progress bar

# --- CONFIGURATION ---
BATCH_SIZE = 256 # Reduced batch size for lower memory usage. Adjust if needed.
SOURCE_FOLDER = 'source_texts'
DATA_FILE = 'source_data.pkl'
FAISS_INDEX_FILE = 'source_index.faiss'

# --- SCRIPT START ---
print("Loading sentence transformer model...")
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_file_paths(path):
    print(f"Scanning for source files in: {path}")
    return glob.glob(os.path.join(path, '*.txt'))

def process_batch_for_names_and_embeddings(file_paths):
    """Reads a batch of files, extracts text, gets names, and generates embeddings."""
    batch_texts = []
    batch_names = []
    for filepath in file_paths:
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                # We only need the text for encoding, not to store it all in memory.
                batch_texts.append(f.read()) 
                batch_names.append(os.path.basename(filepath))
        except Exception as e:
            print(f"Warning: Could not read file {filepath}. Skipping. Error: {e}")
            
    if not batch_texts:
        return None, None
        
    # Generate embeddings for the current batch
    batch_embeddings = model.encode(batch_texts, show_progress_bar=False)
    return batch_names, batch_embeddings

if __name__ == '__main__':
    # We will only store the names in memory, not the full text of every document.
    all_source_names = []
    faiss_index = None
    embedding_dim = 384 # Dimension for 'all-MiniLM-L6-v2' model

    file_paths = get_file_paths(SOURCE_FOLDER)
    
    if not file_paths:
        print(f"Error: No .txt files found in the '{SOURCE_FOLDER}' directory. Exiting.")
        exit()

    print(f"Found {len(file_paths)} source documents. Starting batch processing...")

    # Initialize a FAISS index
    faiss_index = faiss.IndexFlatL2(embedding_dim)

    # Process files in batches
    for i in tqdm(range(0, len(file_paths), BATCH_SIZE), desc="Processing Batches"):
        batch_paths = file_paths[i:i + BATCH_SIZE]
        names, embeddings = process_batch_for_names_and_embeddings(batch_paths)
        
        if names:
            # Add the embeddings from this batch directly to the FAISS index
            faiss_index.add(np.array(embeddings))
            # Store only the names
            all_source_names.extend(names)

    if faiss_index.ntotal == 0:
        print("Error: No documents were successfully processed. Exiting.")
        exit()

    print("\nSaving pre-processed data to files...")
    # Save only the names list. We don't need to save the full texts.
    with open(DATA_FILE, 'wb') as f:
        pickle.dump(all_source_names, f)
    
    # Save the completed FAISS index
    faiss.write_index(faiss_index, FAISS_INDEX_FILE)
    print(f"FAISS index and names list saved successfully with {faiss_index.ntotal} vectors.")
    print("\nPreprocessing complete. You can now start the main app.py server.")
