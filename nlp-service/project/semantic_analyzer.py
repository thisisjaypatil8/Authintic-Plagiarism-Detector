import nltk
import faiss
import numpy as np

class SemanticAnalyzer:
    """Semantic analysis using sentence transformers (Deep Mode)"""
    
    def __init__(self):
        pass
    
    def analyze(self, user_text, model, index, source_sentences, source_metadata):
        """
        Perform deep semantic plagiarism analysis using FAISS
        
        Args:
            user_text: Text to analyze
            model: SentenceTransformer model
            index: FAISS index
            source_sentences: List of source document sentences
            source_metadata: List of (filename, sentence_index) tuples
            
        Returns:
            Analysis result dictionary
        """
        user_sentences = nltk.sent_tokenize(user_text)
        total_sentences = len(user_sentences)
        
        if not user_sentences or not index or total_sentences == 0:
            return self._empty_report(user_text)
        
        # Thresholds for Deep Mode (Hybrid Analysis)
        DIRECT_THRESHOLD = 0.95   # 95%+ for "Direct Match"
        PARAPHRASED_THRESHOLD = 0.75  # 75%-94% for "Paraphrased"
        
        # Initialize counters
        direct_count = 0
        paraphrased_count = 0
        original_count = 0
        
        report = {
            'overall_score': 0,
            'flagged_sections': []
        }
        full_text_structured = []
        
        # FAISS-powered semantic search
        user_embeddings = model.encode(user_sentences, convert_to_numpy=True).astype('float32')
        faiss.normalize_L2(user_embeddings)
        
        k = 1  # Find top 1 most similar source sentence
        D, I = index.search(user_embeddings, k)
        
        for i in range(total_sentences):
            similarity_score = D[i][0]
            source_index = I[i][0]
            current_sentence = user_sentences[i]
            
            # Check against thresholds
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
            
            # Build structured text array
            if plagiarized:
                matched_sentence = source_sentences[source_index]
                source_file, _ = source_metadata[source_index]
                source_info = f"{source_file} (similar to: \"{matched_sentence[:100]}...\")"
                
                # Add to flagged sections
                report['flagged_sections'].append({
                    'text': current_sentence,
                    'source': source_info,
                    'similarity': float(round(similarity_score * 100, 2)),
                    'type': match_type
                })
                
                # Add to visual report structure
                full_text_structured.append({
                    "text": current_sentence,
                    "plagiarized": True,
                    "type": match_type,
                    "source": source_info,
                    "similarity": float(round(similarity_score * 100, 2))
                })
            else:
                # Original sentences
                full_text_structured.append({
                    "text": current_sentence,
                    "plagiarized": False
                })
        
        # Calculate statistics
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
        
        report['stats'] = stats
        report['overall_score'] = round((plagiarized_count / total_sentences) * 100, 2)
        report['full_text_structured'] = full_text_structured
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
