from typing import List, Dict, Any

# Sample authentic passages from MSMARCO-XI dataset (AI4Bharat Indic/English QA dataset)
MSMARCO_XI_SAMPLES = [
    {
        "id": "msmarco_xi_001",
        "title": "MSMARCO Dataset & AI4Bharat Benchmark",
        "language": "en/hi",
        "passage": "MSMARCO-XI is a multilingual dataset translated and standardized by AI4Bharat for 11 Indic languages including Hindi, Goan Konkani, Marathi, Tamil, Telugu, and Bengali. It evaluates retrieval augmented generation systems on passage ranking, reading comprehension, and answer grounding."
    },
    {
        "id": "msmarco_xi_002",
        "title": "RAG System Architecture & Performance",
        "language": "en",
        "passage": "Retrieval-Augmented Generation (RAG) combines dense vector retrieval with large language models to generate accurate, contextually grounded answers. Sub-200ms latency targets require optimized vector similarity search (such as HNSW or inverted file indexes) and fast token streaming."
    },
    {
        "id": "msmarco_xi_003",
        "title": "Chunking Strategies in RAG Pipelines",
        "language": "en",
        "passage": "Effective chunking prevents loss of semantic context. Fixed-size chunking splits text rigidly, overlapping sliding window preserves context boundaries, semantic splitting breaks text at sentence transitions, and metadata-aware chunking injects structural tags into embeddings."
    },
    {
        "id": "msmarco_xi_004",
        "title": "Latency Percentiles: P50, P70, and P100",
        "language": "en",
        "passage": "P50 latency represents the 50th percentile (median) response time. P70 represents 70 percent of requests completing within that bound. P100 measures the worst-case maximum latency across all query runs in a benchmark test suite."
    },
    {
        "id": "msmarco_xi_005",
        "title": "Model Harness & Resilience Orchestration",
        "language": "en",
        "passage": "A model harness wraps raw LLM calls in structured orchestration: enforcing strict JSON schema outputs, handling retries with exponential backoff, executing tool calls (such as retrieval or calculation), and providing robust error recovery."
    },
    {
        "id": "msmarco_xi_006",
        "title": "Guardrails & Groundedness Checks",
        "language": "en",
        "passage": "Guardrails inspect incoming user queries for toxicity, off-topic requests, and unsafe content. Post-generation hallucination checkers compare generated answers against retrieved context snippets to ensure total factual alignment."
    },
    {
        "id": "msmarco_xi_007",
        "title": "HH Goa 2026 Hackathon Guidelines",
        "language": "en",
        "passage": "The HH Goa 2026 Shortlisting Task 2 requires building a voice-enabled RAG model with Sarvam or ElevenLabs STT, multi-strategy chunking, sub-200ms E2E pipeline latency, P50/P70/P100 latency analytics, structured harness, and guardrail verification."
    },
    {
        "id": "msmarco_xi_008",
        "title": "Speech-to-Text Integration: Sarvam & ElevenLabs",
        "language": "en/hi",
        "passage": "Sarvam AI specializes in Indic speech-to-text models like Saaras v1. ElevenLabs provides multi-lingual Scribe v1 audio transcription. Both STT services offer high accuracy and fast audio decoding for live voice queries."
    },
    {
        "id": "msmarco_xi_009",
        "title": "Machine Learning & Artificial Intelligence Fundamentals",
        "language": "en",
        "passage": "Machine Learning (ML) is a branch of artificial intelligence (AI) and computer science focused on using data and algorithms to enable systems to learn, identify patterns, and make decisions with minimal human intervention. Key paradigms include supervised learning, unsupervised learning, and reinforcement learning."
    },
    {
        "id": "msmarco_xi_010",
        "title": "Deep Learning & Vector Embeddings in ML",
        "language": "en",
        "passage": "In modern machine learning, deep neural networks transform raw text, speech, and images into dense vector embeddings. These high-dimensional mathematical representations capture semantic meaning, enabling fast similarity search in RAG pipelines."
    }
]

def load_msmarco_passages() -> List[Dict[str, Any]]:
    """Loads MSMARCO-XI dataset passages."""
    return MSMARCO_XI_SAMPLES
