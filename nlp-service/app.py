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

# --- 1. LOAD PRE-PROCESSED SENTENCE DATA ---
try:
    print("Loading pre-processed sentence embeddings and FAISS index...")
    index = faiss.read_index('source_index.faiss')

    with open('source_data.pkl', 'rb') as f:
        source_sentences, source_metadata = pickle.load(f)
    print("Data loaded successfully.")

except Exception as e:
    print(f"Error loading preprocessed data: {e}")
    print("Please STOP the server, run preprocess_sources.py, then restart.")
    index, source_sentences, source_metadata = None, [], []

# NLTK Tokenizer
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

# --- 2. CORE ANALYSIS ROUTE (NOW USES FAISS) ---
@app.route('/api/check', methods=['POST'])
def analyze_document():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400

    user_text = data['text']
    user_sentences = nltk.sent_tokenize(user_text)

    if not user_sentences or not index:
        return jsonify({'overall_score': 0, 'flagged_sections': [], 'full_text': user_text})

    report = {'overall_score': 0, 'flagged_sections': []}
    plagiarized_indices = set()

    # --- FAISS-POWERED SEMANTIC SEARCH ---
    user_embeddings = model.encode(user_sentences, convert_to_numpy=True).astype('float32')
    faiss.normalize_L2(user_embeddings)

    k = 1 # Find the single best match for each sentence
    D, I = index.search(user_embeddings, k)

    SIMILARITY_THRESHOLD = 0.75 # Tune this threshold (0.75 is a good start)

    for i in range(len(user_sentences)):
        similarity_score = D[i][0]
        source_index = I[i][0]

        if similarity_score > SIMILARITY_THRESHOLD:
            plagiarized_indices.add(i)

            matched_sentence = source_sentences[source_index]
            source_file, _ = source_metadata[source_index]

            report['flagged_sections'].append({
                'text': user_sentences[i],
                'source': f"{source_file} (similar to: \"{matched_sentence[0:100]}...\")",
                'similarity': float(round(similarity_score * 100, 2)),
                'type': 'Paraphrased' 
            })

    if len(user_sentences) > 0:
        report['overall_score'] = round((len(plagiarized_indices) / len(user_sentences)) * 100, 2)

    # IMPORTANT: Send the original text back, we need it for the PDF report
    report['full_text'] = user_text 

    return jsonify(report)


# --- 3. GEMINI-POWERED REWRITE ENDPOINT ---
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
    payload = {"contents": [{"parts": [{"text": prompt}]}]}

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