import re
import time
from typing import Dict, Any, List, Tuple

UNSAFE_KEYWORDS = ["hack", "exploit", "malware", "virus", "kill", "bomb", "hate", "bypass security"]
OFF_TOPIC_KEYWORDS = ["recipe", "pizza", "celebrity gossip", "horoscope", "astrology", "football match score", "movie trailer"]

class GuardrailEngine:
    """
    Guardrail Verification Engine:
    - Input Safety & Toxicity Scanner
    - Domain Relevance & Off-Topic Detector
    - Fact Groundedness & Hallucination Checker
    - Refusal Decision Logic ("Knowing when NOT to answer")
    """

    def validate_input(self, query: str) -> Tuple[bool, str, Dict[str, Any]]:
        t0 = time.time()
        query_lower = query.lower().strip()

        # 1. Safety Check
        for kw in UNSAFE_KEYWORDS:
            if kw in query_lower:
                duration_ms = (time.time() - t0) * 1000
                return False, "Refusal: Query contains unsafe or policy-violating keywords.", {
                    "passed": False,
                    "reason": "Unsafe Content",
                    "latency_ms": round(duration_ms, 3)
                }

        # 2. Off-Topic Check
        for kw in OFF_TOPIC_KEYWORDS:
            if kw in query_lower:
                duration_ms = (time.time() - t0) * 1000
                return False, "Refusal: Query is off-topic. I can only answer questions related to the MSMARCO-XI dataset, RAG architectures, latency metrics, and AI models.", {
                    "passed": False,
                    "reason": "Off-Topic Query",
                    "latency_ms": round(duration_ms, 3)
                }

        duration_ms = (time.time() - t0) * 1000
        return True, "", {
            "passed": True,
            "reason": "Allowed",
            "latency_ms": round(duration_ms, 3)
        }

    def verify_groundedness(self, answer: str, context_chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculates groundedness score to detect hallucinations.
        Verifies answer words against retrieved context text.
        """
        t0 = time.time()
        if not context_chunks or not answer:
            return {"grounded": False, "score": 0.0, "hallucination_detected": True, "latency_ms": 0.5}

        combined_context = " ".join([c.get("text", "") for c in context_chunks]).lower()
        answer_words = re.findall(r'\w+', answer.lower())
        if not answer_words:
            return {"grounded": True, "score": 1.0, "hallucination_detected": False, "latency_ms": 0.5}

        # Count how many non-common words from answer exist in context
        stop_words = {"the", "a", "an", "is", "are", "and", "or", "in", "on", "of", "to", "for", "with", "that", "this", "it"}
        content_words = [w for w in answer_words if w not in stop_words and len(w) > 2]
        
        if not content_words:
            matched_ratio = 1.0
        else:
            matches = sum(1 for w in content_words if w in combined_context)
            matched_ratio = matches / len(content_words)

        is_grounded = matched_ratio >= 0.4
        duration_ms = (time.time() - t0) * 1000

        return {
            "grounded": is_grounded,
            "score": round(matched_ratio, 3),
            "hallucination_detected": not is_grounded,
            "latency_ms": round(duration_ms, 3)
        }

guardrails = GuardrailEngine()
