import os
import glob
from sentence_transformers import SentenceTransformer
import torch
import pickle

print("Loading sentence transformer model...")
model = SentenceTransformer('all-MiniLM-L6-v2')

def load_source_documents(path):
    source_docs = []
    source_doc_names = []
    print(f"Reading source files from: {path}")
    for filepath in glob.glob(os.path.join(path, '*.txt')):
        with open(filepath, 'r', encoding='utf-8') as f:
            source_docs.append(f.read())
            source_doc_names.append(os.path.basename(filepath))
    return source_docs, source_doc_names

source_texts, source_names = load_source_documents('source_texts')

if source_texts:
    print(f"Found {len(source_texts)} source documents. Encoding now... (This may take several minutes)")
    source_embeddings = model.encode(source_texts, convert_to_tensor=True, show_progress_bar=True)

    print("Saving pre-processed data to files...")
    # Save the embeddings tensor
    torch.save(source_embeddings, 'source_embeddings.pt')

    # Save the text and name lists
    with open('source_data.pkl', 'wb') as f:
        pickle.dump((source_texts, source_names), f)

    print("Preprocessing complete. You can now start the main app.py server.")
else:
    print("No source documents found. Preprocessing skipped.")