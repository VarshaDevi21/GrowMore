import asyncio
import pytest
from services.question_generator import QuestionGenerator
from services.state_manager import StateManager
from services.candidate_loader import candidate_loader
from state.interview_state import AnswerEvaluation
from services.llm.base import BaseLLMProvider

class MockQuestionLLMProvider(BaseLLMProvider):
    def __init__(self, response_text: str):
        self.response_text = response_text

    async def generate_completion(self, prompt: str, system_prompt: str = None, temperature: float = 0.7) -> str:
        return self.response_text

    async def generate_structured_json(self, prompt: str, system_prompt: str = None, temperature: float = 0.2) -> dict:
        return {}

def test_generate_initial_question():
    """Test generating Question 1 for candidate initialization."""
    sm = StateManager()
    state = sm.create_session("sess-q1", "CAND-001", "Sarah Johnson", "Senior Data Engineer", level="Medium")
    cand = candidate_loader.get_candidate("CAND-001")
    
    mock_llm = MockQuestionLLMProvider("How do vector embeddings represent semantic meaning in ChromaDB?")
    q_gen = QuestionGenerator(llm_provider=mock_llm)
    
    q_text = asyncio.run(q_gen.generate_question(state, cand))
    
    assert isinstance(q_text, str)
    assert q_text.endswith("?")
    assert len(q_text) >= 15

def test_deep_dive_probing_question():
    """Test generating a deep-dive follow-up based on candidate's previous answer term."""
    sm = StateManager()
    state = sm.create_session("sess-q2", "CAND-001", "Sarah Johnson", "Senior Data Engineer", level="Hard")
    cand = candidate_loader.get_candidate("CAND-001")
    
    eval_obj = AnswerEvaluation(
        question_number=1,
        question_text="What is RAG?",
        candidate_answer="RAG stands for Retrieval-Augmented Generation.",
        completeness_score=0.9,
        accuracy_score=0.9,
        logic_score=0.9,
        tone_clarity_score=0.9,
        time_mgmt_score=1.0,
        classification="Strong",
        technical_terms_detected=["retrieval"],
        missing_concepts=[],
        incorrect_concepts=[],
        recommended_difficulty="Hard"
    )
    
    mock_llm = MockQuestionLLMProvider("You mentioned retrieval. How does the system determine document relevance?")
    q_gen = QuestionGenerator(llm_provider=mock_llm)
    
    q_text = asyncio.run(q_gen.generate_question(state, cand, last_eval=eval_obj))
    assert "retrieval" in q_text.lower()
    assert q_text.endswith("?")

def test_repetition_prevention_and_fallback():
    """Test that invalid or repeated questions trigger backend fallback validation."""
    sm = StateManager()
    state = sm.create_session("sess-q3", "CAND-001", "Sarah Johnson", "Senior Data Engineer")
    cand = candidate_loader.get_candidate("CAND-001")
    
    # Invalid LLM response: missing question mark and too short
    mock_invalid_llm = MockQuestionLLMProvider("Not a question")
    q_gen = QuestionGenerator(llm_provider=mock_invalid_llm)
    
    q_text = asyncio.run(q_gen.generate_question(state, cand))
    
    # Should trigger fallback generator and produce a valid question ending with '?'
    assert q_text.endswith("?")
    assert len(q_text) >= 15
