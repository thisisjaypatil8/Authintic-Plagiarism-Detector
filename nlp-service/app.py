import os
import pickle
import torch
import nltk
import json
import requests
import faiss
import numpy as np
import hashlib
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
model = SentenceTransformer('all-MiniLM-L6-v2')

# --- 1. LOAD PRE-PROCESSED DOCUMENT DATA ---
try:
    print("Loading pre-processed document embeddings and FAISS index...")
    index = faiss.read_index('source_index.faiss')
    
    # Load the source FILENAMES
    with open('source_data.pkl', 'rb') as f:
        # This now correctly loads the list of names from your preprocess script
        source_names = pickle.load(f) 
    print("Data loaded successfully.")
    
except Exception as e:
    print(f"Error loading preprocessed data: {e}")
    print("Please STOP the server, run preprocess_sources.py, then restart.")
    index, source_names = None, []

# NLTK Tokenizer (still needed for rewrite)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

# --- 2. CORE ANALYSIS ROUTE (Compares Full Document) ---
@app.route('/api/check', methods=['POST'])
def analyze_document():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400

    user_text = data['text']
    
    if not user_text or not index:
        return jsonify({'overall_score': 0, 'flagged_sections': []})

    # --- 1. ENCODE THE ENTIRE USER DOCUMENT ---
    # We compare the user's full text to the full source texts
    try:
        user_embedding = model.encode(user_text, convert_to_numpy=True).astype('float32')
    except Exception as e:
        print(f"Error encoding user text: {e}")
        return jsonify({'error': 'Failed to process text.'}), 500
        
    user_embedding = user_embedding.reshape(1, -1) # Make it a (1, D) array

    # --- 2. SEARCH THE FAISS (L2) INDEX ---
    # Your script uses IndexFlatL2, which finds the *closest* vector (lowest distance)
    # k=1 means find the single best match
    k = 1
    D, I = index.search(user_embedding, k)
    
    l2_distance = D[0][0]
    best_match_index = I[0][0]
    
    # --- 3. PREPARE THE REPORT ---
    report = {'overall_score': 0, 'flagged_sections': []}
    
    # With L2 distance, 0.0 is a perfect match.
    # A low distance (e.g., < 0.7) means it's very similar.
    L2_DISTANCE_THRESHOLD = 0.7 

    if l2_distance < L2_DISTANCE_THRESHOLD:
        # We found a significant match!
        
        # --- THIS IS THE FIX ---
        # Convert L2 distance to a 0-100% similarity score
        # We wrap in float() to fix the JSON serializable error
        similarity_percent = float(round((1.0 - (l2_distance / 2.0)) * 100, 2))
        # --- END OF FIX ---
        
        # Get the filename of the match
        source_name = source_names[best_match_index] 
        
        report['overall_score'] = similarity_percent
        
        # Since this is a full-document check, we create one report entry
        report['flagged_sections'].append({
            'text': f"The entire document is {similarity_percent}% similar to a source file.",
            'source': source_name,
            'similarity': similarity_percent,
            'type': 'Full Document Match'
        })
    
    return jsonify(report)


# --- 3. GEMINI-POWERED REWRITE ENDPOINT ---
# (This route was correct, leaving as-is)
@app.route('/api/rewrite', methods=['POST'])
def rewrite_sentence():
    data = request.get_json()
    if not data or 'sentence' not in data:
        return jsonify({'error': 'No sentence provided for rewrite'}), 400
    if 'api_key' not in data or not data['api_key']:
        return jsonify({'error': 'API key is missing from request'}), 400

    sentence_to_rewrite = data['sentence']
    api_key = data['api_key'] 

    prompt = f"Rewrite the following sentence in a completely original way, maintaining the core meaning but using different vocabulary and structure: \"{sentence_to_rewrite}\""
    
    gemini_api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={api_key}"

    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    try:
        response = requests.post(gemini_api_url, json=payload)
        response.raise_for_status()
        result = response.json()
        rewritten_text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 'Could not generate a suggestion.')
        return jsonify({'rewritten_text': rewritten_text.strip()})
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return jsonify({'error': 'Failed to communicate with the rewrite service.'}), 500


# --- 4. START THE SERVER ---
if __name__ == '__main__':
    app.run(debug=True, port=5001)