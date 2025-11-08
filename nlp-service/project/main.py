import requests
import numpy as np
import faiss
import nltk
from flask import request, jsonify, Blueprint
from .loader import model, index, source_sentences, source_metadata

# Create a 'Blueprint'
bp = Blueprint('main', __name__)

@bp.route('/api/check', methods=['POST'])
def analyze_document():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400

    user_text = data['text']
    user_sentences = nltk.sent_tokenize(user_text)
    total_sentences = len(user_sentences)

    if not user_sentences or not index or total_sentences == 0:
        # Return a complete empty report
        empty_stats = {
            "total_sentences": 0, "direct_count": 0, "paraphrased_count": 0, "original_count": 0,
            "direct_percent": 0, "paraphrased_percent": 0, "original_percent": 100
        }
        return jsonify({
            'overall_score': 0, 
            'flagged_sections': [], 
            'full_text_structured': [], 
            'full_text': user_text,
            'stats': empty_stats
        })

    # --- THRESHOLDS FOR HYBRID ANALYSIS ---
    DIRECT_THRESHOLD = 0.95   # (95%+) For "Direct Match"
    PARAPHRASED_THRESHOLD = 0.75 # (75% - 94%) For "Paraphrased"

    # --- NEW: Initialize Counters ---
    direct_count = 0
    paraphrased_count = 0
    original_count = 0
    
    report = {'overall_score': 0, 'flagged_sections': []}
    full_text_structured = [] 
    
    # --- FAISS-POWERED SEMANTIC SEARCH ---
    user_embeddings = model.encode(user_sentences, convert_to_numpy=True).astype('float32')
    faiss.normalize_L2(user_embeddings)

    k = 1 
    D, I = index.search(user_embeddings, k)

    for i in range(total_sentences):
        similarity_score = D[i][0]
        source_index = I[i][0]
        current_sentence = user_sentences[i]
        
        # Check against our thresholds
        if similarity_score > DIRECT_THRESHOLD:
            match_type = "Direct Match"
            plagiarized = True
            direct_count += 1
        elif similarity_score > PARAPHRASED_THRESHOLD:
            match_type = "Paraphrased"
            plagiarized = True
            paraphrased_count += 1
        else:
            match_type = "Original"
            plagiarized = False
            original_count += 1
        
        # Build the structured text array
        if plagiarized:
            matched_sentence = source_sentences[source_index]
            source_file, _ = source_metadata[source_index]
            source_info = f"{source_file} (similar to: \"{matched_sentence[0:100]}...\")"
            
            # Add to simple flagged sections list (for PDF report table)
            report['flagged_sections'].append({
                'text': current_sentence,
                'source': source_info,
                'similarity': float(round(similarity_score * 100, 2)),
                'type': match_type
            })
            
            # Add to the new visual report structure
            full_text_structured.append({
                "text": current_sentence,
                "plagiarized": True,
                "type": match_type,
                "source": source_info,
                "similarity": float(round(similarity_score * 100, 2))
            })
        else:
            # Add original sentences to the visual report structure
            full_text_structured.append({
                "text": current_sentence,
                "plagiarized": False
            })

    # --- NEW: Calculate Stats ---
    plagiarized_count = direct_count + paraphrased_count
    
    stats = {
        "total_sentences": total_sentences,
        "direct_count": direct_count,
        "paraphrased_count": paraphrased_count,
        "original_count": original_count,
        "direct_percent": (direct_count / total_sentences) * 100,
        "paraphrased_percent": (paraphrased_count / total_sentences) * 100,
        "original_percent": (original_count / total_sentences) * 100
    }

    # Add the new stats object to the report
    report['stats'] = stats
    
    report['overall_score'] = round((plagiarized_count / total_sentences) * 100, 2)
    report['full_text_structured'] = full_text_structured
    report['full_text'] = user_text 
    
    return jsonify(report)


@bp.route('/api/rewrite', methods=['POST'])
def rewrite_sentence():
    # (This function is unchanged and correct)
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
        
        if 'error' in result:
            print(f"Gemini API returned an error: {result['error']['message']}")
            return jsonify({'error': result['error']['message']}), 500
            
        rewritten_text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 'Could not generate a suggestion.')
        return jsonify({'rewritten_text': rewritten_text.strip()})
        
    except requests.exceptions.HTTPError as http_err:
        try:
            error_details = http_err.response.json().get('error', {}).get('message', str(http_err))
        except:
            error_details = str(http_err)
        print(f"HTTP error calling Gemini API: {error_details}")
        return jsonify({'error': error_details}), 500
        
    except Exception as e:
        print(f"Generic error in rewrite: {e}")
        return jsonify({'error': f'Failed to communicate with the rewrite service: {e}'}), 500