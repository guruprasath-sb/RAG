from typing import List, Dict, Any

def chunk_metadata_aware(text: str, doc_metadata: Dict[str, Any] = None, chunk_size: int = 300) -> List[Dict[str, Any]]:
    """
    Metadata-aware chunking strategy.
    Prepends document context tags (title, section, passage ID, language) to the text before chunking.
    Ensures embeddings capture both document-level context and local text content.
    """
    doc_meta = doc_metadata or {
        "dataset": "MSMARCO-XI",
        "language": "hi/en",
        "domain": "General Knowledge QA",
        "source": "AI4Bharat"
    }
    
    context_prefix = f"[Dataset: {doc_meta.get('dataset')} | Lang: {doc_meta.get('language')} | Domain: {doc_meta.get('domain')}] "
    
    # Split text with context preservation
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks = []
    
    for idx, p in enumerate(paragraphs):
        full_text = context_prefix + p
        chunks.append({
            "id": f"meta_{idx}",
            "text": full_text,
            "raw_text": p,
            "strategy": "Metadata-Aware",
            "start_char": 0,
            "end_char": len(p),
            "size": len(full_text),
            "metadata": {
                **doc_meta,
                "passage_index": idx,
                "context_prefix": context_prefix,
                "chunk_type": "metadata_augmented"
            }
        })
        
    return chunks
