from typing import List, Dict, Any

def chunk_overlapping_window(text: str, chunk_size: int = 300, overlap: int = 75) -> List[Dict[str, Any]]:
    """
    Sliding window chunking strategy with overlap handling.
    Prevents loss of context across chunk boundaries.
    """
    chunks = []
    text_length = len(text)
    step = chunk_size - overlap
    if step <= 0:
        step = chunk_size // 2
        
    start = 0
    while start < text_length:
        end = min(start + chunk_size, text_length)
        chunk_text = text[start:end]
        
        chunks.append({
            "id": f"overlap_{len(chunks)}",
            "text": chunk_text,
            "strategy": "Overlapping Window",
            "start_char": start,
            "end_char": end,
            "size": len(chunk_text),
            "metadata": {"chunk_type": "sliding_window", "overlap": overlap}
        })
        
        if end >= text_length:
            break
        start += step
        
    return chunks
