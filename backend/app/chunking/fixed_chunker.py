from typing import List, Dict, Any

def chunk_fixed_size(text: str, chunk_size: int = 250) -> List[Dict[str, Any]]:
    """
    Fixed-size naive chunking strategy.
    Splits text into chunks of exact character length `chunk_size`.
    """
    chunks = []
    text_length = len(text)
    
    for i in range(0, text_length, chunk_size):
        chunk_text = text[i:i + chunk_size]
        chunks.append({
            "id": f"fixed_{len(chunks)}",
            "text": chunk_text,
            "strategy": "Fixed-Size",
            "start_char": i,
            "end_char": min(i + chunk_size, text_length),
            "size": len(chunk_text),
            "metadata": {"chunk_type": "naive_fixed"}
        })
        
    return chunks
