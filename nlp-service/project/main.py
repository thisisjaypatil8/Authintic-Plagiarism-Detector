import numpy as np
import faiss
import spacy
from flask import request, jsonify, Blueprint
from .loader import model, index, source_sentences, source_metadata, tfidf_ready, bert_ready
from .tfidf_analyzer import is_tfidf_plagiarized, TFIDF_THRESHOLD
from .bert_classifier import is_bert_plagiarized

# ── spaCy sentencizer ─────────────────────────────────────────
try:
    _nlp = spacy.load("en_core_web_sm", disable=["ner", "parser", "tagger"])
    _nlp.add_pipe("sentencizer")
except OSError:
    # Fallback: basic split on ". " if model not downloaded yet
    _nlp = None
    print("[main] Warning: spaCy en_core_web_sm not found. Using basic sentence split.")


def sent_tokenize(text: str) -> list[str]:
    """Split text into sentences using spaCy or a simple fallback."""
    if _nlp is not None:
        doc = _nlp(text[:100_000])
        return [s.text.strip() for s in doc.sents if len(s.text.strip()) > 5]
    # Fallback: split on period + space
    return [s.strip() for s in text.replace("?\n", ". ").replace("!\n", ". ").split(". ") if len(s.strip()) > 5]


# ── Thresholds ─────────────────────────────────────────────────────────────────
DIRECT_THRESHOLD     = 0.95   # FAISS cosine ≥ 95% → Direct Match
PARAPHRASED_THRESHOLD = 0.75  # FAISS cosine 75–94% → Paraphrased
BERT_AMBIGUOUS_LOW   = 0.40   # If FAISS score is in this range, also run BERT
BERT_AMBIGUOUS_HIGH  = PARAPHRASED_THRESHOLD

bp = Blueprint('main', __name__)


# ═══════════════════════════════════════════════════════════════════════════════
# /api/check  — Hybrid 3-layer plagiarism analysis
# ═══════════════════════════════════════════════════════════════════════════════

@bp.route('/api/check', methods=['POST'])
def analyze_document():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400

    user_text      = data['text']
    user_sentences = sent_tokenize(user_text)
    total_sentences = len(user_sentences)

    if not user_sentences or total_sentences == 0:
        empty_stats = {
            "total_sentences": 0, "direct_count": 0, "paraphrased_count": 0,
            "ai_paraphrased_count": 0, "original_count": 0,
            "direct_percent": 0, "paraphrased_percent": 0,
            "ai_paraphrased_percent": 0, "original_percent": 100
        }
        return jsonify({'overall_score': 0, 'flagged_sections': [],
                        'full_text_structured': [], 'full_text': user_text, 'stats': empty_stats})

    # ── Counters ───────────────────────────────────────────────────────────────
    direct_count        = 0
    paraphrased_count   = 0
    ai_paraphrased_count = 0
    original_count      = 0

    report = {'overall_score': 0, 'flagged_sections': []}
    full_text_structured = []

    # ── Layer 2: Batch FAISS search ────────────────────────────────────────────
    faiss_available = (index is not None and len(source_sentences) > 0)
    if faiss_available:
        user_embeddings = model.encode(user_sentences, convert_to_numpy=True).astype('float32')
        faiss.normalize_L2(user_embeddings)
        D, I = index.search(user_embeddings, 1)   # top-1 neighbour per sentence
    else:
        D = np.zeros((total_sentences, 1))
        I = np.zeros((total_sentences, 1), dtype=int)

    for i, sentence in enumerate(user_sentences):
        faiss_score  = float(D[i][0])
        source_index = int(I[i][0])
        match_type   = "Original"
        plagiarized  = False
        detection_layer = None

        # ── Layer 1: TF-IDF fast check ─────────────────────────────────────────
        if tfidf_ready:
            tfidf_hit, tfidf_score, tfidf_file = is_tfidf_plagiarized(sentence)
        else:
            tfidf_hit, tfidf_score, tfidf_file = False, 0.0, ""

        # ── Classification cascade ─────────────────────────────────────────────
        if faiss_score >= DIRECT_THRESHOLD or tfidf_score >= 0.80:
            match_type      = "Direct Match"
            plagiarized     = True
            detection_layer = "Layer 1+2" if tfidf_hit else "Layer 2"
            direct_count   += 1

        elif faiss_score >= PARAPHRASED_THRESHOLD:
            match_type      = "Paraphrased"
            plagiarized     = True
            detection_layer = "Layer 2"
            paraphrased_count += 1

        elif tfidf_hit:
            # TF-IDF caught it but FAISS score was low → call it paraphrased
            match_type      = "Paraphrased"
            plagiarized     = True
            detection_layer = "Layer 1"
            paraphrased_count += 1

        elif BERT_AMBIGUOUS_LOW <= faiss_score < BERT_AMBIGUOUS_HIGH:
            # ── Layer 3: BERT for ambiguous boundary zone ──────────────────────
            if bert_ready and faiss_available and source_index < len(source_sentences):
                matched_src = source_sentences[source_index]
                bert_hit, bert_prob = is_bert_plagiarized(sentence, matched_src)
                if bert_hit:
                    match_type         = "AI-Paraphrased"
                    plagiarized        = True
                    detection_layer    = "Layer 3 (BERT)"
                    ai_paraphrased_count += 1

        if not plagiarized:
            original_count += 1

        # ── Build response ─────────────────────────────────────────────────────
        if plagiarized and faiss_available and source_index < len(source_sentences):
            matched_sentence = source_sentences[source_index]
            source_file, _   = source_metadata[source_index]
            source_info = f"{source_file} (similar to: \"{matched_sentence[:100]}...\")"

            report['flagged_sections'].append({
                'text':       sentence,
                'source':     source_info,
                'similarity': round(faiss_score * 100, 2),
                'type':       match_type,
                'layer':      detection_layer,
            })
            full_text_structured.append({
                'text':       sentence,
                'plagiarized': True,
                'type':       match_type,
                'source':     source_info,
                'similarity': round(faiss_score * 100, 2),
                'layer':      detection_layer,
            })
        else:
            full_text_structured.append({'text': sentence, 'plagiarized': False})

    # ── Stats ──────────────────────────────────────────────────────────────────
    plagiarized_total = direct_count + paraphrased_count + ai_paraphrased_count
    stats = {
        "total_sentences":      total_sentences,
        "direct_count":         direct_count,
        "paraphrased_count":    paraphrased_count,
        "ai_paraphrased_count": ai_paraphrased_count,
        "original_count":       original_count,
        "direct_percent":       round((direct_count        / total_sentences) * 100, 2),
        "paraphrased_percent":  round((paraphrased_count   / total_sentences) * 100, 2),
        "ai_paraphrased_percent": round((ai_paraphrased_count / total_sentences) * 100, 2),
        "original_percent":     round((original_count      / total_sentences) * 100, 2),
    }

    report['stats']               = stats
    report['overall_score']       = round((plagiarized_total / total_sentences) * 100, 2)
    report['full_text_structured'] = full_text_structured
    report['full_text']           = user_text

    return jsonify(report)


# ═══════════════════════════════════════════════════════════════════════════════
# /api/rewrite  (unchanged)
# ═══════════════════════════════════════════════════════════════════════════════

import requests as _requests

@bp.route('/api/rewrite', methods=['POST'])
def rewrite_sentence():
    data = request.get_json()
    if not data or 'sentence' not in data:
        return jsonify({'error': 'No sentence provided for rewrite'}), 400
    if 'api_key' not in data or not data['api_key']:
        return jsonify({'error': 'API key is missing from request'}), 400

    sentence_to_rewrite = data['sentence']
    api_key             = data['api_key']
    prompt = (f"Rewrite the following sentence in a completely original way, "
              f"maintaining the core meaning but using different vocabulary and "
              f"structure: \"{sentence_to_rewrite}\"")
    gemini_url = (f"https://generativelanguage.googleapis.com/v1beta/models/"
                  f"gemini-2.5-flash-preview-05-20:generateContent?key={api_key}")
    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    try:
        resp = _requests.post(gemini_url, json=payload)
        resp.raise_for_status()
        result        = resp.json()
        if 'error' in result:
            return jsonify({'error': result['error']['message']}), 500
        rewritten = (result.get('candidates', [{}])[0]
                           .get('content', {})
                           .get('parts', [{}])[0]
                           .get('text', 'Could not generate a suggestion.'))
        return jsonify({'rewritten_text': rewritten.strip()})
    except _requests.exceptions.HTTPError as http_err:
        try:
            msg = http_err.response.json().get('error', {}).get('message', str(http_err))
        except Exception:
            msg = str(http_err)
        return jsonify({'error': msg}), 500
    except Exception as e:
        return jsonify({'error': f'Failed to communicate with rewrite service: {e}'}), 500


# ═══════════════════════════════════════════════════════════════════════════════
# /api/guidance  (unchanged)
# ═══════════════════════════════════════════════════════════════════════════════

@bp.route('/api/guidance', methods=['POST'])
def generate_guidance():
    from .guidance_engine import generate_personalized_guidance
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    for field in ['text', 'similarity', 'type']:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    flagged = {'text': data['text'], 'similarity': data['similarity'],
               'type': data['type'], 'source': data.get('source', 'unknown source')}
    try:
        return jsonify(generate_personalized_guidance(flagged))
    except Exception as e:
        print(f"Error generating guidance: {e}")
        return jsonify({'error': 'Failed to generate guidance'}), 500


@bp.route('/api/guidance/summary', methods=['POST'])
def generate_summary_guidance():
    from .guidance_engine import generate_overall_summary
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    try:
        return jsonify(generate_overall_summary(data.get('flagged_sections', []),
                                                data.get('overall_score', 0)))
    except Exception as e:
        print(f"Error generating summary: {e}")
        return jsonify({'error': 'Failed to generate summary'}), 500