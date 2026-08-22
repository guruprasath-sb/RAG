from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ToolCallLog(BaseModel):
    tool_name: str
    arguments: Dict[str, Any]
    output: Any
    latency_ms: float

class GuardrailStatus(BaseModel):
    passed: bool
    reason: str
    groundedness_score: float
    hallucination_detected: bool
    latency_ms: float

class LatencyBreakdown(BaseModel):
    stt_ms: float
    guardrail_ms: float
    retrieval_ms: float
    harness_llm_ms: float
    total_e2e_ms: float
    sla_met: bool = Field(description="True if total latency is <= 200ms Target")

class StructuredRAGResponse(BaseModel):
    query: str
    stt_provider: str
    answer: str
    refused: bool = False
    refusal_reason: Optional[str] = None
    chunks_retrieved: List[Dict[str, Any]]
    chunk_strategy: str
    tool_calls: List[ToolCallLog]
    retries_count: int
    guardrails: GuardrailStatus
    latency: LatencyBreakdown
