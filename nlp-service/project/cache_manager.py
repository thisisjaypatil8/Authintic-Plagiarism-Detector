import os
import hashlib
import joblib
from pathlib import Path
from datetime import datetime, timedelta

class CacheManager:
    """Manages caching of plagiarism analysis results"""
    
    def __init__(self, cache_dir="cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
    
    def _get_cache_path(self, doc_hash, mode):
        """Generate cache file path for a document"""
        return self.cache_dir / f"{doc_hash}_{mode}.pkl"
    
    def _get_metadata_path(self, doc_hash, mode):
        """Generate metadata file path for cache entry"""
        return self.cache_dir / f"{doc_hash}_{mode}_meta.pkl"
    
    def get_cached_result(self, doc_hash, mode):
        """
        Retrieve cached analysis result if it exists and is not expired
        
        Args:
            doc_hash: Hash of the document content
            mode: Analysis mode ('fast' or 'deep')
            
        Returns:
            Cached result dict or None if not found/expired
        """
        cache_path = self._get_cache_path(doc_hash, mode)
        meta_path = self._get_metadata_path(doc_hash, mode)
        
        if not cache_path.exists() or not meta_path.exists():
            return None
        
        try:
            # Load metadata to check expiration
            metadata = joblib.load(meta_path)
            expiry_time = metadata.get('expiry_time')
            
            if expiry_time and datetime.now() > expiry_time:
                # Cache expired, remove files
                cache_path.unlink()
                meta_path.unlink()
                return None
            
            # Load and return cached result
            result = joblib.load(cache_path)
            return result
            
        except Exception as e:
            print(f"Error loading cache: {e}")
            return None
    
    def cache_result(self, doc_hash, mode, result, ttl=3600):
        """
        Store analysis result in cache
        
        Args:
            doc_hash: Hash of the document content
            mode: Analysis mode ('fast' or 'deep')
            result: Analysis result to cache
            ttl: Time to live in seconds (default: 1 hour)
        """
        cache_path = self._get_cache_path(doc_hash, mode)
        meta_path = self._get_metadata_path(doc_hash, mode)
        
        try:
            # Save result
            joblib.dump(result, cache_path)
            
            # Save metadata
            metadata = {
                'created_at': datetime.now(),
                'expiry_time': datetime.now() + timedelta(seconds=ttl),
                'mode': mode
            }
            joblib.dump(metadata, meta_path)
            
        except Exception as e:
            print(f"Error caching result: {e}")
    
    def clear_old_cache(self, days=30):
        """
        Remove cache entries older than specified days
        
        Args:
            days: Number of days to keep cache (default: 30)
        """
        cutoff_time = datetime.now() - timedelta(days=days)
        removed_count = 0
        
        for meta_file in self.cache_dir.glob("*_meta.pkl"):
            try:
                metadata = joblib.load(meta_file)
                created_at = metadata.get('created_at')
                
                if created_at and created_at < cutoff_time:
                    # Remove both cache and metadata files
                    cache_file = meta_file.parent / meta_file.name.replace('_meta.pkl', '.pkl')
                    meta_file.unlink()
                    if cache_file.exists():
                        cache_file.unlink()
                    removed_count += 1
                    
            except Exception as e:
                print(f"Error cleaning cache file {meta_file}: {e}")
        
        print(f"Removed {removed_count} old cache entries")
        return removed_count
    
    @staticmethod
    def hash_document(text):
        """
        Generate hash for document content
        
        Args:
            text: Document text content
            
        Returns:
            SHA256 hash of the text
        """
        return hashlib.sha256(text.encode('utf-8')).hexdigest()
