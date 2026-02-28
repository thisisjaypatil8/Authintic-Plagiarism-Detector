import faiss
import pickle
from sentence_transformers import SentenceTransformer
from .tfidf_analyzer import build_tfidf_index
from .bert_classifier import load_bert_model

def load_data():
    """Loads FAISS index + sentence data from disk."""
    print("Loading pre-processed sentence embeddings and FAISS index...")
    try:
        index = faiss.read_index('source_index.faiss')
        with open('source_data.pkl', 'rb') as f:
            source_sentences, source_metadata = pickle.load(f)
        print(f"FAISS index loaded: {index.ntotal} vectors.")
    except Exception as e:
        print(f"Error loading preprocessed data: {e}")
        print("Please run preprocess_sources_pan25.py first, then restart.")
        return None, [], []

    return index, source_sentences, source_metadata


# ── Load all models once at import time ───────────────────────────────────────

# Layer 2 — Sentence-Transformer + FAISS
model = SentenceTransformer('all-MiniLM-L6-v2')
index, source_sentences, source_metadata = load_data()

# Layer 1 — TF-IDF (gracefully skips if source_texts/ is empty)
tfidf_ready = build_tfidf_index()

# Layer 3 — Fine-tuned BERT (gracefully skips if bert_model/ doesn't exist yet)
bert_ready = load_bert_model()