"""Answer interface consumed by rag-local-eval-loop."""

from dataclasses import dataclass
import time


@dataclass
class Answer:
    text: str
    grounded: bool
    generation_ms: float
    model: str


def generate_answer(query: str, results: list) -> Answer:
    """Produce a compact answer grounded in the highest-ranked passage."""
    started_at = time.perf_counter()
    if not results:
        return Answer("No relevant context found.", False, _elapsed_ms(started_at), "extractive-harness")

    top_result = results[0]
    context = top_result.text.strip()
    if not context:
        return Answer("No relevant context found.", False, _elapsed_ms(started_at), "extractive-harness")

    return Answer(context[:500], True, _elapsed_ms(started_at), "extractive-harness")


def _elapsed_ms(started_at: float) -> float:
    return round((time.perf_counter() - started_at) * 1000, 3)