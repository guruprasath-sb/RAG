import time
import numpy as np
from typing import List, Dict, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.vector_store.msmarco_loader import load_msmarco_passages
from app.chunking.chunker_manager import process_chunks

class VectorIndex:
    """
    Sub-15ms In-Memory Vector Store for MSMARCO-XI Dataset.
    Supports dynamic re-indexing using different chunking strategies.
    """
    def __init__(self):
        self.passages = load_msmarco_passages()
        self.chunk_strategy = "semantic"
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
        self.chunks: List[Dict[str, Any]] = []
        self.matrix = None
        self.build_index(self.chunk_strategy)

    def build_index(self, strategy_name: str = "semantic") -> Dict[str, Any]:
        t0 = time.time()
        self.chunk_strategy = strategy_name
        self.chunks = []
        
        # Process each MSMARCO passage using requested chunking strategy
        for item in self.passages:
            chunk_res = process_chunks(item["passage"], strategy_name=strategy_name)
            for c in chunk_res["chunks"]:
                c["doc_id"] = item["id"]
                c["doc_title"] = item["title"]
                c["language"] = item.get("language", "en")
                self.chunks.append(c)
                
        texts = [c["text"] for c in self.chunks]
        if texts:
            self.matrix = self.vectorizer.fit_transform(texts)
            
        index_time_ms = (time.time() - t0) * 1000
        return {
            "strategy": strategy_name,
            "total_chunks": len(self.chunks),
            "indexing_time_ms": round(index_time_ms, 3)
        }

    def search(self, query: str, top_k: int = 3) -> Tuple[List[Dict[str, Any]], float]:
        t0 = time.time()
        if not self.chunks or self.matrix is None:
            return [], 0.0
            
        query_vec = self.vectorizer.transform([query])
        scores = cosine_similarity(query_vec, self.matrix).flatten()
        
        # Top-k indices
        top_indices = np.argsort(scores)[::-1][:top_k]
        results = []
        
        for idx in top_indices:
            score = float(scores[idx])
            chunk = self.chunks[idx].copy()
            chunk["score"] = round(score, 4)
            results.append(chunk)
            
        retrieval_ms = (time.time() - t0) * 1000
        return results, round(retrieval_ms, 3)

# Global singleton index
vector_index = VectorIndex()
