import faiss
import pickle
from sentence_transformers import SentenceTransformer

def load_data():
    """Loads all models and data from disk."""
    print("Loading pre-processed sentence embeddings and FAISS index...")
    try:
        index = faiss.read_index('source_index.faiss')
        with open('source_data.pkl', 'rb') as f:
            source_sentences, source_metadata = pickle.load(f)
        print("Data loaded successfully.")
    except Exception as e:
        print(f"Error loading preprocessed data: {e}")
        print("Please STOP the server, run preprocess_sources.py, then restart.")
        return None, [], []
        
    return index, source_sentences, source_metadata

# Load data once when the module is imported
model = SentenceTransformer('all-MiniLM-L6-v2')
index, source_sentences, source_metadata = load_data()