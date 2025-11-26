"""
Guidance Engine - AI-Powered Educational Plagiarism Fixes
Provides personalized tips on HOW to fix plagiarism, not WHAT to write
Uses Google Gemini for context-aware guidance
"""

import google.generativeai as genai
import os
from flask import current_app

# Configure Gemini
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-flash-latest')


def generate_personalized_guidance(flagged_section):
    """
    Generate PERSONALIZED educational guidance using Google Gemini
    Focus: How to fix, not what to write
    
    Args:
        flagged_section: dict with keys: text, similarity, type, source
        
    Returns:
        dict with guidance information
    """
    similarity = flagged_section.get('similarity', 0)
    match_type = flagged_section.get('type', 'Unknown')
    text = flagged_section.get('text', '')
    source = flagged_section.get('source', 'unknown source')
    
    # Build context-aware prompt for Gemini
    prompt = f"""You are an academic writing coach helping students avoid plagiarism.

FLAGGED TEXT: "{text}"
MATCH TYPE: {match_type}
SIMILARITY: {similarity}%
SOURCE: {source}

Your task: Provide EDUCATIONAL GUIDANCE on how to fix this plagiarism issue.

IMPORTANT RULES:
- DO NOT write a rewritten version
- DO NOT generate alternative text
- DO provide 3-5 specific, actionable tips
- DO explain WHY it's plagiarized
- DO suggest strategies to make it original
- DO highlight key matching phrases if applicable
- Keep advice practical and student-friendly

Format your response exactly like this:

ISSUE: [One sentence explaining why this is plagiarized]

TIPS:
1. [First specific tip]
2. [Second specific tip]
3. [Third specific tip]
4. [Fourth specific tip - optional]
5. [Fifth specific tip - optional]

KEY PHRASES: [List 2-3 key phrases that should be changed, separated by commas]

Focus on teaching them HOW to write authentically, not WHAT to write."""

    try:
        # Call Gemini for personalized guidance
        current_app.logger.info(f"Generating guidance for text: {text[:50]}...")
        response = model.generate_content(prompt)
        guidance_text = response.text
        
        # Parse the response into structured format
        guidance = {
            'issue': extract_issue(guidance_text),
            'tips': extract_tips(guidance_text),
            'key_phrases': extract_key_phrases(guidance_text),
            'severity': get_severity(similarity),
            'raw_guidance': guidance_text,  # Full AI response for debugging
            'ai_generated': True
        }
        
        current_app.logger.info(f"Successfully generated guidance with {len(guidance['tips'])} tips")
        return guidance
        
    except Exception as e:
        current_app.logger.error(f"Gemini guidance error: {str(e)}")
        # Fallback to rule-based if Gemini fails
        return generate_fallback_guidance(flagged_section)


def extract_issue(text):
    """Extract the issue explanation from Gemini response"""
    lines = text.split('\n')
    for line in lines:
        if 'ISSUE:' in line:
            return line.replace('ISSUE:', '').strip()
        # Fallback: first non-empty line that's not a header
        if line.strip() and not any(x in line for x in ['TIPS:', 'KEY PHRASES:', '1.', '2.', '3.']):
            return line.strip()
    return "Plagiarism detected in this section"


def extract_tips(text):
    """Extract numbered tips from Gemini response"""
    tips = []
    lines = text.split('\n')
    in_tips_section = False
    
    for line in lines:
        line = line.strip()
        
        # Check if we're in the TIPS section
        if 'TIPS:' in line:
            in_tips_section = True
            continue
            
        # Stop if we hit KEY PHRASES section
        if 'KEY PHRASES:' in line:
            break
            
        # Extract tips (numbered items)
        if in_tips_section and line:
            # Match numbered items like "1.", "2.", etc.
            if line and (line[0].isdigit() or line.startswith(('- ', '• '))):
                # Remove numbering/bullets
                tip = line.lstrip('0123456789.-• ').strip()
                if tip and len(tip) > 10:  # Minimum length for valid tip
                    tips.append(tip)
    
    # If we didn't find tips in the structured format, try a more lenient approach
    if not tips:
        for line in lines:
            line = line.strip()
            if line and (line[0].isdigit() or line.startswith(('- ', '• '))):
                tip = line.lstrip('0123456789.-• ').strip()
                if tip and len(tip) > 10:
                    tips.append(tip)
    
    return tips[:5]  # Max 5 tips


def extract_key_phrases(text):
    """Extract key phrases to avoid from Gemini response"""
    phrases = []
    lines = text.split('\n')
    
    for line in lines:
        if 'KEY PHRASES:' in line:
            # Get everything after "KEY PHRASES:"
            phrases_text = line.split('KEY PHRASES:')[1].strip()
            # Split by commas
            phrases = [p.strip().strip('"\'') for p in phrases_text.split(',')]
            phrases = [p for p in phrases if p]  # Remove empty strings
            break
    
    return phrases[:5]  # Max 5 key phrases


def get_severity(similarity):
    """Determine severity level based on similarity score"""
    if similarity >= 90:
        return 'high'
    elif similarity >= 70:
        return 'medium'
    else:
        return 'low'


def generate_fallback_guidance(flagged_section):
    """
    Fallback rule-based guidance if Gemini fails
    Ensures system always provides guidance
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


def generate_overall_summary(flagged_sections, overall_score):
    """
    Generate an OVERALL summary for the entire document
    Instead of individual guidance for each section
    
    Args:
        flagged_sections: list of all flagged sections
        overall_score: overall plagiarism percentage
        
    Returns:
        dict with overall guidance
    """
    total_flagged = len(flagged_sections)
    
    # Count by type
    direct_count = sum(1 for s in flagged_sections if s.get('type') == 'Direct Match')
    paraphrased_count = sum(1 for s in flagged_sections if s.get('type') == 'Paraphrased')
    
    # Get sample flagged texts for context (max 3 examples)
    sample_texts = []
    for i, section in enumerate(flagged_sections[:3]):
        text = section.get('text', '')[:150]  # Truncate long texts
        sample_texts.append(f"Example {i+1} ({section.get('type')}): \"{text}...\"")
    
    samples_str = "\n".join(sample_texts) if sample_texts else "No samples available"
    
    # Build context for Gemini
    prompt = f"""You are an academic writing coach providing an OVERALL assessment of a student's document.

DOCUMENT ANALYSIS:
- Overall Similarity Score: {overall_score}%
- Total Flagged Sections: {total_flagged}
- Direct Matches: {direct_count}
- Paraphrased Content: {paraphrased_count}

SAMPLE FLAGGED SECTIONS:
{samples_str}

Your task: Analyze THIS SPECIFIC document and provide PERSONALIZED improvement guidance.

IMPORTANT RULES:
- DO NOT rewrite any text
- DO analyze the ACTUAL content shown above
- DO provide a 2-3 sentence summary that references THEIR specific issues
- DO provide 5-7 tips tailored to THIS document's problems
- DO mention specific patterns you notice in their writing
- Keep advice practical and prioritized (most important first)

Format your response exactly like this:

SUMMARY: [2-3 sentences analyzing THEIR specific plagiarism patterns based on the examples]

IMPROVEMENT TIPS:
1. [Most important tip based on THEIR content]
2. [Second tip addressing THEIR specific issues]
3. [Third tip]
4. [Fourth tip]
5. [Fifth tip]
6. [Sixth tip - optional]
7. [Seventh tip - optional]

PRIORITY AREAS: [2-3 specific areas based on THEIR content, separated by commas]

Make this feel like you've READ their document - reference their writing style, subject matter, or specific issues you noticed."""

    try:
        current_app.logger.info(f"Generating overall summary for {total_flagged} flagged sections")
        response = model.generate_content(prompt)
        guidance_text = response.text
        
        # Parse response
        summary_guidance = {
            'summary': extract_summary(guidance_text),
            'tips': extract_tips(guidance_text),
            'priority_areas': extract_priority_areas(guidance_text),
            'total_issues': total_flagged,
            'direct_matches': direct_count,
            'paraphrased': paraphrased_count,
            'overall_score': overall_score,
            'ai_generated': True
        }
        
        return summary_guidance
        
    except Exception as e:
        current_app.logger.error(f"Overall summary error: {str(e)}")
        # Fallback
        return generate_fallback_summary(flagged_sections, overall_score)


def extract_summary(text):
    """Extract the summary from Gemini response"""
    lines = text.split('\n')
    for i, line in enumerate(lines):
        if 'SUMMARY:' in line:
            summary = line.replace('SUMMARY:', '').strip()
            # Check if summary continues on next lines
            j = i + 1
            while j < len(lines) and lines[j].strip() and 'IMPROVEMENT' not in lines[j] and not lines[j].strip().startswith(('1.', '2.')):
                summary += ' ' + lines[j].strip()
                j += 1
            return summary
    return "Multiple plagiarism issues detected in this document."


def extract_priority_areas(text):
    """Extract priority areas from Gemini response"""
    areas = []
    lines = text.split('\n')
    
    for line in lines:
        if 'PRIORITY AREAS:' in line:
            areas_text = line.split('PRIORITY AREAS:')[1].strip()
            areas = [a.strip() for a in areas_text.split(',')]
            areas = [a for a in areas if a]
            break
    
    return areas[:3]  # Max 3 priority areas


def generate_fallback_summary(flagged_sections, overall_score):
    """Fallback summary if Gemini fails"""
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
