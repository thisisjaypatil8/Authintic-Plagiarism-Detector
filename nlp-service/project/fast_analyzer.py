import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class FastAnalyzer:
    """Fast TF-IDF based plagiarism detection (Fast Mode)"""
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 2),
            stop_words='english'
        )
    
    def analyze(self, user_text, source_sentences, source_metadata):
        """
        Perform fast TF-IDF based plagiarism analysis
        
        Args:
            user_text: Text to analyze
            source_sentences: List of source document sentences
            source_metadata: List of (filename, sentence_index) tuples
            
        Returns:
            Analysis result dictionary
        """
        user_sentences = nltk.sent_tokenize(user_text)
        total_sentences = len(user_sentences)
        
        if not user_sentences or total_sentences == 0:
            return self._empty_report(user_text)
        
        # Thresholds for Fast Mode (stricter - only catches direct matches)
        DIRECT_THRESHOLD = 0.85  # 85%+ similarity for direct match
        
        # Initialize counters
        direct_count = 0
        original_count = 0
        
        report = {
            'overall_score': 0,
            'flagged_sections': [],
            'full_text_structured': []
        }
        
        # Create TF-IDF matrix for all sentences
        all_sentences = user_sentences + source_sentences
        
        try:
            tfidf_matrix = self.vectorizer.fit_transform(all_sentences)
        except ValueError:
            # Handle edge case where text is too short/empty
            return self._empty_report(user_text)
        
        # Split into user and source matrices
        user_tfidf = tfidf_matrix[:total_sentences]
        source_tfidf = tfidf_matrix[total_sentences:]
        
        # Calculate similarities
        similarities = cosine_similarity(user_tfidf, source_tfidf)
        
        for i, current_sentence in enumerate(user_sentences):
            # Find most similar source sentence
            max_similarity = similarities[i].max()
            max_index = similarities[i].argmax()
            
            # Check threshold
            if max_similarity > DIRECT_THRESHOLD:
                match_type = "Direct Match"
                plagiarized = True
                direct_count += 1
                
                # Get source information
                matched_sentence = source_sentences[max_index]
                source_file, _ = source_metadata[max_index]
                source_info = f"{source_file} (similar to: \"{matched_sentence[:100]}...\")"
                
                # Add to flagged sections
                report['flagged_sections'].append({
                    'text': current_sentence,
                    'source': source_info,
                    'similarity': float(round(max_similarity * 100, 2)),
                    'type': match_type
                })
                
                # Add to structured report
                report['full_text_structured'].append({
                    "text": current_sentence,
                    "plagiarized": True,
                    "type": match_type,
                    "source": source_info,
                    "similarity": float(round(max_similarity * 100, 2))
                })
            else:
                # Original sentence
                plagiarized = False
                original_count += 1
                
                report['full_text_structured'].append({
                    "text": current_sentence,
                    "plagiarized": False
                })
        
        # Calculate statistics
        plagiarized_count = direct_count
        paraphrased_count = 0  # Fast mode doesn't detect paraphrasing
        
        stats = {
            "total_sentences": total_sentences,
            "direct_count": direct_count,
            "paraphrased_count": paraphrased_count,
            "original_count": original_count,
            "direct_percent": (direct_count / total_sentences) * 100,
            "paraphrased_percent": 0,
            "original_percent": (original_count / total_sentences) * 100
        }
        
        report['stats'] = stats
        report['overall_score'] = round((plagiarized_count / total_sentences) * 100, 2)
        report['full_text'] = user_text
        
        return report
    
    def _empty_report(self, user_text):
        """Return empty report structure"""
        empty_stats = {
            "total_sentences": 0,
            "direct_count": 0,
            "paraphrased_count": 0,
            "original_count": 0,
            "direct_percent": 0,
            "paraphrased_percent": 0,
            "original_percent": 100
        }
        return {
            'overall_score': 0,
            'flagged_sections': [],
            'full_text_structured': [],
            'full_text': user_text,
            'stats': empty_stats
        }
