"""Embedding interface consumed by rag-local-eval-loop."""

import numpy as np
from sklearn.feature_extraction.text import HashingVectorizer


_vectorizer = HashingVectorizer(
    n_features=2048,
    alternate_sign=False,
    norm="l2",
    ngram_range=(1, 2),
    stop_words="english",
)


def embed(texts: list[str]) -> np.ndarray:
    """Return deterministic, normalized vectors for a batch of texts."""
    return _vectorizer.transform(texts).toarray().astype(np.float32)


def embed_one(text: str) -> np.ndarray:
    return embed([text])[0]


def get_model() -> HashingVectorizer:
    return _vectorizer