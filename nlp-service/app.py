import os
import glob
import pickle
import torch
import nltk
import json
import requests
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
model = SentenceTransformer('all-MiniLM-L6-v2')

# --- LOAD PRE-PROCESSED DATA ---
try:
    print("Loading pre-processed source embeddings...")
    source_embeddings = torch.load('source_embeddings.pt')
    with open('source_data.pkl', 'rb') as f:
        source_texts, source_names = pickle.load(f)
    print("Data loaded successfully.")
except FileNotFoundError:
    print("Error: Pre-processed data not found. Please run preprocess_sources.py first.")
    source_texts, source_names, source_embeddings = [], [], None

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

# --- GEMINI API SETUP ---
# In a real deployed app, use an environment variable for the API key.
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key="
# The API key will be left empty as per instructions, to be handled by the environment.
API_KEY = "" 

@app.route('/analyze', methods=['POST'])
def analyze_document():
    # This function remains the same as before
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400

    user_text = data['text']
    user_sentences = nltk.sent_tokenize(user_text)

    report = {'overall_score': 0, 'flagged_sections': []}
    plagiarized_indices = set()

    for i, user_sentence in enumerate(user_sentences):
        vectorizer = TfidfVectorizer().fit_transform([user_sentence] + source_texts)
        syntactic_sims = cosine_similarity(vectorizer[0:1], vectorizer[1:])
        
        user_embedding = model.encode(user_sentence, convert_to_tensor=True)
        semantic_sims = util.cos_sim(user_embedding, source_embeddings)
        max_sim_score, max_sim_idx = torch.max(semantic_sims[0], dim=0)

        if syntactic_sims.max() > 0.90:
            source_idx = syntactic_sims.argmax()
            plagiarized_indices.add(i)
            report['flagged_sections'].append({
                'text': user_sentence, 'source': source_names[source_idx],
                'similarity': round(syntactic_sims.max() * 100, 2), 'type': 'Direct Match'
            })
            continue

        if max_sim_score.item() > 0.75:
            plagiarized_indices.add(i)
            report['flagged_sections'].append({
                'text': user_sentence, 'source': source_names[max_sim_idx.item()],
                'similarity': round(max_sim_score.item() * 100, 2), 'type': 'Paraphrased'
            })

    if len(user_sentences) > 0:
        report['overall_score'] = round((len(plagiarized_indices) / len(user_sentences)) * 100, 2)

    return jsonify(report)

# --- GEMINI-POWERED REWRITE ENDPOINT ---
@app.route('/rewrite', methods=['POST'])
def rewrite_sentence():
    data = request.get_json()
    # Check for both sentence and api_key from the backend request
    if not data or 'sentence' not in data:
        return jsonify({'error': 'No sentence provided for rewrite'}), 400
    if 'api_key' not in data or not data['api_key']:
        return jsonify({'error': 'API key is missing from request'}), 400

    sentence_to_rewrite = data['sentence']
    api_key = data['api_key'] # Use the key passed from the backend

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
    except requests.exceptions.RequestException as e:
        print(f"Error calling Gemini API: {e}")
        return jsonify({'error': 'Failed to communicate with the rewrite service.'}), 500
    except (KeyError, IndexError) as e:
        print(f"Error parsing Gemini API response: {e}")
        return jsonify({'error': 'Could not parse the suggestion.'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)