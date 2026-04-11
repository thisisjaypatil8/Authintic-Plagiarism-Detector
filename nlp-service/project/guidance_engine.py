"""
Guidance Engine - AI-Powered Educational Plagiarism Fixes
Provides personalized tips on HOW to fix plagiarism, not WHAT to write
Uses Google Gemini (google-genai SDK) for context-aware guidance
"""

from google import genai
from google.genai import types
import os
import re
import time
import json
from flask import current_app

# ── Lazy Gemini client ──────────────────────────────────────────────────
# Initialised once per process; returns None if the key is missing so the
# fallback guidance still works instead of crashing at import time.
_client = None

def _get_client():
    global _client
    if _client is None:
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            return None
        _client = genai.Client(api_key=api_key)
    return _client

# ── Model fallback chain ───────────────────────────────────────────────
# Each model has its OWN independent free-tier quota.  If one is exhausted
# we try the next one before giving up entirely.
MODEL_CHAIN = [
    'gemini-3-pro-preview',
    'gemini-3-flash-preview',
    'gemini-3.1-flash-lite-preview',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.5-flash-lite',
    
]


def _parse_retry_delay(error_msg: str) -> float:
    """
    Extract the server-recommended retry delay from a 429 error message.
    Capped at 20s to keep web requests responsive.  Falls back to 10s.
    """
    match = re.search(r'retry\s*(?:in|Delay["\s:]*)\s*(\d+(?:\.\d+)?)\s*s', error_msg, re.IGNORECASE)
    if match:
        return min(float(match.group(1)), 20.0)   # cap at 20s
    return 10.0


# Hard ceiling: the entire fallback chain must finish within this many seconds
_MAX_TOTAL_SECONDS = 45.0


def _call_with_fallback(prompt: str, logger):
    """
    Try to generate content across the model fallback chain.
    For each model: attempt 1 retry on per-minute rate-limit errors,
    respecting the server-suggested delay (capped at 10s).  If a
    model's *daily* quota is exhausted, skip retries immediately.

    The entire chain is capped at 30 seconds — after that we give up
    and return None so the caller can use the rule-based fallback.

    Returns the parsed JSON dict on success, or None on total failure.
    """
    client = _get_client()
    if client is None:
        logger.warning("Gemini API key not configured — skipping AI guidance")
        return None

    start_time = time.time()

    for model_id in MODEL_CHAIN:
        # Bail out if we've already spent too long
        if time.time() - start_time > _MAX_TOTAL_SECONDS:
            logger.warning("Overall timeout reached. Giving up on AI guidance.")
            break

        max_retries = 2   # at most 3 attempts per model
        for attempt in range(max_retries + 1):
            # Also check timeout inside the retry loop
            if time.time() - start_time > _MAX_TOTAL_SECONDS:
                logger.warning("Overall timeout reached during retries.")
                break

            try:
                logger.info(f"[{model_id}] Attempt {attempt + 1}")

                response = client.models.generate_content(
                    model=model_id,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                    )
                )

                ai_data = json.loads(response.text)
                logger.info(f"[{model_id}] Success")
                return ai_data

            except Exception as e:
                error_msg = str(e)
                is_rate_limit = "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg

                if is_rate_limit and attempt < max_retries:
                    delay = _parse_retry_delay(error_msg)
                    logger.info(f"[{model_id}] Rate limited. Waiting {delay:.0f}s then retrying...")
                    time.sleep(delay)
                    continue

                # Non-rate-limit error or retries exhausted for this model
                logger.warning(f"[{model_id}] Failed: {error_msg[:150]}")
                break   # move to next model in chain

    logger.error("All models exhausted. Falling back to rule-based guidance.")
    return None


# ═══════════════════════════════════════════════════════════════════════════════
# Public API
# ═══════════════════════════════════════════════════════════════════════════════

def generate_personalized_guidance(flagged_section):
    """
    Generate PERSONALIZED educational guidance using Google Gemini.
    Focus: How to fix, not what to write.
    """
    similarity = flagged_section.get('similarity', 0)
    match_type = flagged_section.get('type', 'Unknown')
    text = flagged_section.get('text', '')
    source = flagged_section.get('source', 'unknown source')

    prompt = f"""You are an academic writing coach helping students avoid plagiarism.

FLAGGED TEXT: "{text}"
MATCH TYPE: {match_type}
SIMILARITY: {similarity}%
SOURCE: {source}

Your task: Provide EDUCATIONAL GUIDANCE on how to fix this plagiarism issue.
IMPORTANT: Return ONLY a raw JSON object. Do not use markdown blocks like ```json.

Schema:
{{
    "issue": "One sentence explaining why this is plagiarized",
    "tips": ["First specific tip", "Second specific tip", "Third specific tip"],
    "key_phrases": ["phrase to change 1", "phrase to change 2"]
}}"""

    ai_data = _call_with_fallback(prompt, current_app.logger)

    if ai_data is None:
        return generate_fallback_guidance(flagged_section)

    return {
        'issue': ai_data.get('issue', 'Plagiarism detected in this section.'),
        'tips': ai_data.get('tips', [])[:5],
        'key_phrases': ai_data.get('key_phrases', [])[:5],
        'severity': get_severity(similarity),
        'raw_guidance': json.dumps(ai_data),
        'ai_generated': True
    }


def generate_overall_summary(flagged_sections, overall_score):
    """Generate an overall document summary with improvement tips."""
    total_flagged = len(flagged_sections)
    direct_count = sum(1 for s in flagged_sections if s.get('type') == 'Direct Match')
    paraphrased_count = sum(1 for s in flagged_sections if s.get('type') == 'Paraphrased')

    # Keep samples short to save tokens
    sample_texts = [
        f"Example {i+1} ({s.get('type')}): \"{s.get('text', '')[:100]}...\""
        for i, s in enumerate(flagged_sections[:3])
    ]
    samples_str = "\n".join(sample_texts) if sample_texts else "No samples available"

    prompt = f"""You are an academic writing coach providing an OVERALL assessment of a student's document.

DOCUMENT ANALYSIS:
- Overall Similarity Score: {overall_score}%
- Total Flagged Sections: {total_flagged}

SAMPLE FLAGGED SECTIONS:
{samples_str}

Your task: Analyze this document and provide improvement guidance.
IMPORTANT: Return ONLY a raw JSON object. Do not use markdown blocks like ```json.

Schema:
{{
    "summary": "2-3 sentences analyzing their specific plagiarism patterns",
    "tips": ["Most important tip", "Second tip", "Third tip"],
    "priority_areas": ["Area 1", "Area 2"]
}}"""

    ai_data = _call_with_fallback(prompt, current_app.logger)

    if ai_data is None:
        return generate_fallback_summary(flagged_sections, overall_score)

    return {
        'summary': ai_data.get('summary', 'Multiple plagiarism issues detected.'),
        'tips': ai_data.get('tips', []),
        'priority_areas': ai_data.get('priority_areas', [])[:3],
        'total_issues': total_flagged,
        'direct_matches': direct_count,
        'paraphrased': paraphrased_count,
        'overall_score': overall_score,
        'ai_generated': True
    }


# ═══════════════════════════════════════════════════════════════════════════════
# Helpers & Fallbacks
# ═══════════════════════════════════════════════════════════════════════════════

def get_severity(similarity):
    """Determine severity level based on similarity score."""
    if similarity >= 90:
        return 'high'
    elif similarity >= 70:
        return 'medium'
    else:
        return 'low'


def generate_fallback_guidance(flagged_section):
    """
    Fallback rule-based guidance if Gemini fails.
    Ensures system always provides guidance.
    """
    similarity = flagged_section.get('similarity', 0)
    match_type = flagged_section.get('type', 'Unknown')

    guidance = {
        'issue': '',
        'tips': [],
        'key_phrases': [],
        'severity': get_severity(similarity),
        'ai_generated': False  # Mark as rule-based
    }

    # Direct Match (>= 90% similarity)
    if similarity >= 90:
        guidance['issue'] = "This text is copied word-for-word from the source"
        guidance['tips'] = [
            "Rewrite completely using your own words and sentence structure",
            "OR use quotation marks and properly cite the source if it's a direct quote",
            "Add your own analysis, interpretation, or commentary after stating the information",
            "Try explaining the concept using a different example or real-world analogy",
            "Break complex ideas into simpler, original explanations"
        ]

    # Paraphrased Content (70-90% similarity)
    elif similarity >= 70:
        guidance['issue'] = "This text is too similar to the source material in structure and wording"
        guidance['tips'] = [
            "Change the sentence structure completely - don't just swap synonyms",
            "Break long sentences into shorter ones, or combine short sentences differently",
            "Add proper attribution: 'According to [source]...' or 'Research by [author] shows...'",
            "Combine ideas from multiple sources to create a unique perspective",
            "Add your own critical analysis or perspective to the information"
        ]

    # Lower similarity (< 70%)
    else:
        guidance['issue'] = "Minor similarity detected - this section may need review"
        guidance['tips'] = [
            "Review carefully to ensure it's fully in your own words",
            "Consider adding a citation if you're referencing specific facts or data",
            "This may be acceptable if it's common knowledge in your field",
            "If unsure, add a citation to be safe"
        ]

    return guidance


def generate_fallback_summary(flagged_sections, overall_score):
    """Fallback summary if Gemini fails."""
    total = len(flagged_sections)
    direct_count = sum(1 for s in flagged_sections if s.get('type') == 'Direct Match')
    paraphrased_count = sum(1 for s in flagged_sections if s.get('type') == 'Paraphrased')

    if overall_score >= 50:
        summary = f"This document has significant plagiarism issues with {overall_score}% similarity. Immediate revision is needed."
        priority = ["Rewrite direct matches", "Add proper citations", "Paraphrase effectively"]
    elif overall_score >= 25:
        summary = f"This document has moderate plagiarism concerns with {overall_score}% similarity. Several sections need revision."
        priority = ["Focus on paraphrasing", "Add citations", "Review sentence structure"]
    else:
        summary = f"This document has minor plagiarism issues with {overall_score}% similarity. A few sections need attention."
        priority = ["Review flagged sections", "Add citations where needed", "Ensure original phrasing"]

    tips = [
        "Read each flagged section and rewrite in your own words without looking at the source",
        "Change sentence structure completely - don't just swap synonyms",
        "Add proper citations for all referenced information",
        "Include your own analysis and perspective on the topics",
        "Use quotation marks for any direct quotes with citations",
        "Combine ideas from multiple sources for unique insights",
        "Have someone else read it - if it sounds like you, it's original"
    ]

    return {
        'summary': summary,
        'tips': tips,
        'priority_areas': priority,
        'total_issues': total,
        'direct_matches': direct_count,
        'paraphrased': paraphrased_count,
        'overall_score': overall_score,
        'ai_generated': False
    }
