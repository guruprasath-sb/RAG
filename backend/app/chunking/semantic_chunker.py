import re
from typing import List, Dict, Any

def chunk_semantic(text: str, max_sentence_group: int = 3, max_chars: int = 400) -> List[Dict[str, Any]]:
    """
    Semantic chunking strategy.
    Splits text by sentence boundaries and group sentences based on semantic coherence and paragraph flow.
    """
    # Regex split on sentence delimiters (. ! ? \n)
    sentences = [s.strip() for s in re.split(r'(?<=[.!?\n])\s+', text) if s.strip()]
    chunks = []
    current_chunk_sentences = []
    current_length = 0
    start_char = 0
    
    for sentence in sentences:
        if current_length + len(sentence) > max_chars or len(current_chunk_sentences) >= max_sentence_group:
            if current_chunk_sentences:
                chunk_text = " ".join(current_chunk_sentences)
                chunks.append({
                    "id": f"semantic_{len(chunks)}",
                    "text": chunk_text,
                    "strategy": "Semantic Splitting",
                    "start_char": start_char,
                    "end_char": start_char + len(chunk_text),
                    "size": len(chunk_text),
                    "metadata": {"sentence_count": len(current_chunk_sentences), "chunk_type": "semantic"}
                })
                start_char += len(chunk_text) + 1
            current_chunk_sentences = [sentence]
            current_length = len(sentence)
        else:
            current_chunk_sentences.append(sentence)
            current_length += len(sentence)
            
    if current_chunk_sentences:
        chunk_text = " ".join(current_chunk_sentences)
        chunks.append({
            "id": f"semantic_{len(chunks)}",
            "text": chunk_text,
            "strategy": "Semantic Splitting",
            "start_char": start_char,
            "end_char": start_char + len(chunk_text),
            "size": len(chunk_text),
            "metadata": {"sentence_count": len(current_chunk_sentences), "chunk_type": "semantic"}
        })
        
    return chunks
