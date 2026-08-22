from typing import List, Dict, Any

def chunk_hierarchical(text: str, parent_size: int = 500, child_size: int = 150) -> List[Dict[str, Any]]:
    """
    Hierarchical (Parent-Child) chunking strategy.
    Indexes small child chunks for precise vector match, but returns broader parent chunk for model context.
    """
    chunks = []
    parent_id = 0
    text_length = len(text)
    
    for i in range(0, text_length, parent_size):
        parent_text = text[i:i + parent_size]
        parent_chunk_id = f"parent_{parent_id}"
        
        # Create children within parent
        child_id = 0
        for j in range(0, len(parent_text), child_size):
            child_text = parent_text[j:j + child_size]
            chunks.append({
                "id": f"{parent_chunk_id}_child_{child_id}",
                "text": child_text,
                "parent_text": parent_text,
                "strategy": "Hierarchical (Parent-Child)",
                "start_char": i + j,
                "end_char": i + j + len(child_text),
                "size": len(child_text),
                "metadata": {
                    "parent_id": parent_chunk_id,
                    "parent_size": len(parent_text),
                    "chunk_type": "hierarchical_child"
                }
            })
            child_id += 1
            
        parent_id += 1
        
    return chunks
