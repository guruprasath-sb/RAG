import time
from typing import List, Dict, Any
from app.chunking.fixed_chunker import chunk_fixed_size
from app.chunking.overlap_chunker import chunk_overlapping_window
from app.chunking.semantic_chunker import chunk_semantic
from app.chunking.metadata_chunker import chunk_metadata_aware
from app.chunking.hierarchical_chunker import chunk_hierarchical

STRATEGIES = {
    "fixed": chunk_fixed_size,
    "overlap": chunk_overlapping_window,
    "semantic": chunk_semantic,
    "metadata": chunk_metadata_aware,
    "hierarchical": chunk_hierarchical
}

def get_chunker(strategy_name: str):
    return STRATEGIES.get(strategy_name.lower(), chunk_semantic)

def process_chunks(text: str, strategy_name: str = "semantic") -> Dict[str, Any]:
    start = time.time()
    chunker = get_chunker(strategy_name)
    chunks = chunker(text)
    latency_ms = (time.time() - start) * 1000
    
    return {
        "strategy": strategy_name,
        "chunk_count": len(chunks),
        "latency_ms": round(latency_ms, 3),
        "chunks": chunks
    }

def compare_all_strategies(text: str) -> Dict[str, Any]:
    comparison = {}
    for name, chunker_fn in STRATEGIES.items():
        t0 = time.time()
        chunks = chunker_fn(text)
        duration_ms = (time.time() - t0) * 1000
        
        avg_size = sum(c["size"] for c in chunks) / max(len(chunks), 1)
        comparison[name] = {
            "strategy_name": chunks[0]["strategy"] if chunks else name,
            "chunk_count": len(chunks),
            "avg_chunk_size": round(avg_size, 1),
            "execution_time_ms": round(duration_ms, 3),
            "sample_chunk": chunks[0]["text"] if chunks else ""
        }
    return comparison
