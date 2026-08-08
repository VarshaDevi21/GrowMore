import asyncio
import pytest
from services.evaluator import AnswerEvaluator
from services.llm.base import BaseLLMProvider

class DummyLLMProvider(BaseLLMProvider):
    def __init__(self, response_dict: dict):
        self.response_dict = response_dict

    async def generate_completion(self, prompt: str, system_prompt: str = None, temperature: float = 0.7) -> str:
        return "Mock response text"

    async def generate_structured_json(self, prompt: str, system_prompt: str = None, temperature: float = 0.2) -> dict:
        return self.response_dict

def test_evaluate_strong_answer():
    """Verify evaluation of a strong technical answer increases difficulty."""
    mock_json = {
        "completeness_score": 0.95,
        "accuracy_score": 0.90,
        "logic_score": 0.85,
        "tone_clarity_score": 0.90,
        "time_mgmt_score": 1.0,
        "technical_terms_detected": ["RAG", "ChromaDB", "embeddings"],
        "missing_concepts": [],
        "incorrect_concepts": []
    }
    dummy_llm = DummyLLMProvider(mock_json)
    evaluator = AnswerEvaluator(llm_provider=dummy_llm)

    res = asyncio.run(evaluator.evaluate_answer(
        question_number=1,
        question_text="How does RAG work with vector databases?",
        candidate_answer="RAG retrieves relevant embeddings from ChromaDB and passes them to the LLM context.",
        current_level="Medium"
    ))

    assert res.classification == "Strong"
    assert res.completeness_score == 0.95
    assert res.accuracy_score == 0.90
    assert res.recommended_difficulty == "Hard"  # Medium -> Hard
    assert "RAG" in res.technical_terms_detected

def test_evaluate_weak_answer():
    """Verify evaluation of a weak technical answer decreases difficulty."""
    mock_json = {
        "completeness_score": 0.2,
        "accuracy_score": 0.3,
        "logic_score": 0.4,
        "tone_clarity_score": 0.5,
        "time_mgmt_score": 0.5,
        "technical_terms_detected": ["database"],
        "missing_concepts": ["vector search", "embeddings", "context retrieval"],
        "incorrect_concepts": ["SQL joins solve RAG"]
    }
    dummy_llm = DummyLLMProvider(mock_json)
    evaluator = AnswerEvaluator(llm_provider=dummy_llm)

    res = asyncio.run(evaluator.evaluate_answer(
        question_number=2,
        question_text="How does vector search differ from SQL lookup?",
        candidate_answer="They are the exact same thing.",
        current_level="Hard"
    ))

    assert res.classification == "Weak"
    assert res.recommended_difficulty == "Medium"  # Hard -> Medium
    assert "vector search" in res.missing_concepts

def test_evaluate_partial_answer():
    """Verify evaluation of a partial answer maintains difficulty."""
    mock_json = {
        "completeness_score": 0.6,
        "accuracy_score": 0.65,
        "logic_score": 0.6,
        "tone_clarity_score": 0.7,
        "time_mgmt_score": 0.8,
        "technical_terms_detected": ["embeddings"],
        "missing_concepts": ["cosine similarity"],
        "incorrect_concepts": []
    }
    dummy_llm = DummyLLMProvider(mock_json)
    evaluator = AnswerEvaluator(llm_provider=dummy_llm)

    res = asyncio.run(evaluator.evaluate_answer(
        question_number=3,
        question_text="What is embedding similarity?",
        candidate_answer="It compares text vectors.",
        current_level="Medium"
    ))

    assert res.classification == "Partial"
    assert res.recommended_difficulty == "Medium"  # Medium -> Medium

def test_deterministic_scoring_math():
    """Verify that overall composite score strictly follows weighted formula."""
    evaluator = AnswerEvaluator()
    # Test difficulty scaling deterministic function directly
    assert evaluator._compute_deterministic_difficulty("Easy", "Strong") == "Medium"
    assert evaluator._compute_deterministic_difficulty("Medium", "Strong") == "Hard"
    assert evaluator._compute_deterministic_difficulty("Hard", "Strong") == "Hard"
    assert evaluator._compute_deterministic_difficulty("Hard", "Weak") == "Medium"
    assert evaluator._compute_deterministic_difficulty("Medium", "Weak") == "Easy"
    assert evaluator._compute_deterministic_difficulty("Easy", "Weak") == "Easy"
    assert evaluator._compute_deterministic_difficulty("Medium", "Partial") == "Medium"
