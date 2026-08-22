import numpy as np
from typing import List, Dict, Any
from app.harness.schemas import StructuredRAGResponse

class LatencyTracker:
    """
    Statistical Latency Analytics Engine:
    Calculates P50, P70, and P100 latency percentiles across benchmark query suites.
    """
    def __init__(self):
        self.history: List[StructuredRAGResponse] = []

    def record_run(self, response: StructuredRAGResponse):
        self.history.append(response)

    def calculate_percentiles(self, responses: List[StructuredRAGResponse] = None) -> Dict[str, Any]:
        data = responses if responses is not None else self.history
        if not data:
            return {
                "total_queries": 0,
                "p50_ms": 0.0,
                "p70_ms": 0.0,
                "p100_ms": 0.0,
                "sla_pass_rate": 100.0,
                "stage_percentiles": {}
            }

        total_latencies = [r.latency.total_e2e_ms for r in data]
        stt_latencies = [r.latency.stt_ms for r in data]
        guard_latencies = [r.latency.guardrail_ms for r in data]
        retrieval_latencies = [r.latency.retrieval_ms for r in data]
        harness_latencies = [r.latency.harness_llm_ms for r in data]

        p50 = float(np.percentile(total_latencies, 50))
        p70 = float(np.percentile(total_latencies, 70))
        p100 = float(np.max(total_latencies))

        sla_count = sum(1 for l in total_latencies if l <= 200.0)
        sla_rate = (sla_count / len(total_latencies)) * 100.0

        return {
            "total_queries": len(data),
            "p50_ms": round(p50, 2),
            "p70_ms": round(p70, 2),
            "p100_ms": round(p100, 2),
            "mean_ms": round(float(np.mean(total_latencies)), 2),
            "min_ms": round(float(np.min(total_latencies)), 2),
            "sla_pass_rate_percent": round(sla_rate, 1),
            "stage_percentiles": {
                "stt": {
                    "p50": round(float(np.percentile(stt_latencies, 50)), 2),
                    "p70": round(float(np.percentile(stt_latencies, 70)), 2),
                    "p100": round(float(np.max(stt_latencies)), 2)
                },
                "guardrails": {
                    "p50": round(float(np.percentile(guard_latencies, 50)), 2),
                    "p70": round(float(np.percentile(guard_latencies, 70)), 2),
                    "p100": round(float(np.max(guard_latencies)), 2)
                },
                "retrieval": {
                    "p50": round(float(np.percentile(retrieval_latencies, 50)), 2),
                    "p70": round(float(np.percentile(retrieval_latencies, 70)), 2),
                    "p100": round(float(np.max(retrieval_latencies)), 2)
                },
                "harness_llm": {
                    "p50": round(float(np.percentile(harness_latencies, 50)), 2),
                    "p70": round(float(np.percentile(harness_latencies, 70)), 2),
                    "p100": round(float(np.max(harness_latencies)), 2)
                }
            }
        }

latency_tracker = LatencyTracker()
