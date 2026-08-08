import pytest
import anyio
from services.question_generator import QuestionGenerator
from services.state_manager import StateManager
from state.interview_state import AnswerEvaluation
from models.schemas import CandidatePayload, CandidateMember, CandidateSignals
from services.llm.base import BaseLLMProvider

class SpyLLMProvider(BaseLLMProvider):
    def __init__(self):
        self.last_prompt = ""
        self.last_system_prompt = ""
        self.mock_response = "Mocked next question?"

    async def generate_completion(self, prompt: str, system_prompt: str = None, temperature: float = 0.7) -> str:
        self.last_prompt = prompt
        self.last_system_prompt = system_prompt
        return self.mock_response

    async def generate_structured_json(self, prompt: str, system_prompt: str = None, temperature: float = 0.2) -> dict:
        return {}

@pytest.mark.anyio
async def test_adaptive_questioning_logic():
    sm = StateManager()
    spy_llm = SpyLLMProvider()
    q_gen = QuestionGenerator(llm_provider=spy_llm)
    
    # Create candidate context payload
    candidate = CandidatePayload(
        member=CandidateMember(
            id="CAND-001",
            name="Sarah Johnson",
            jobRole="Senior Data Engineer",
            yearsExperience=9,
            education="MS CS",
            status="COMPLETED"
        ),
        missions=[],
        signals=CandidateSignals(commitDays=10, missionsCompleted=10, missionsFirstTry=10)
    )
    
    # Create starting session state
    state = sm.create_session(
        session_id="adaptive-test",
        candidate_id="CAND-001",
        candidate_name="Sarah Johnson",
        candidate_role="Senior Data Engineer",
        level="Medium"
    )
    state.current_question = "What is RAG?"
    state.current_curriculum_day = 11
    state.current_curriculum_topic = "RAG End-to-End & LLM API Basics"
    
    # --- Test Scenario 1: Strong answer -> harder question ---
    eval_strong = AnswerEvaluation(
        question_number=1,
        question_text="What is RAG?",
        candidate_answer="RAG stands for Retrieval-Augmented Generation.",
        completeness_score=0.9,
        accuracy_score=0.9,
        logic_score=0.9,
        tone_clarity_score=0.9,
        time_mgmt_score=1.0,
        classification="Strong",
        technical_terms_detected=["RAG", "retrieval"],
        missing_concepts=[],
        incorrect_concepts=[],
        recommended_difficulty="Hard"
    )
    # Record evaluation (which updates state.level to Hard)
    sm.record_evaluation("adaptive-test", eval_strong)
    
    # Generate question
    spy_llm.mock_response = "How does vector indexing optimize document retrieval?"
    q_text = await q_gen.generate_question(state, candidate, last_eval=eval_strong)
    
    # 8. Candidate context is supplied to the generator
    assert "CANDIDATE: Sarah Johnson (Senior Data Engineer)" in spy_llm.last_prompt
    
    # 1. Strong answer -> harder difficulty prompt context
    assert "INTERVIEW LEVEL: Hard" in spy_llm.last_prompt
    
    # 3. Technical term -> possible follow-up / deep-dive strategy
    assert "PROBING STRATEGY: DEEP_DIVE" in spy_llm.last_prompt
    assert "ask specifically about candidate's mentioned term 'RAG'" in spy_llm.last_prompt
    
    # 5. Previous answer influences next question (contains last answer classification & terms)
    assert "Last answer classification: Strong" in spy_llm.last_prompt
    assert "Mentioned terms: RAG, retrieval" in spy_llm.last_prompt
    
    # 6. Previous questions are available as context
    assert "What is RAG?" in spy_llm.last_prompt
    
    assert q_text == "How does vector indexing optimize document retrieval?"
    
    # Update active question in state to simulate advance
    state.current_question = q_text
    
    # --- Test Scenario 2: Weak answer -> easier/fundamental question ---
    eval_weak = AnswerEvaluation(
        question_number=2,
        question_text="How does vector indexing optimize document retrieval?",
        candidate_answer="I don't know.",
        completeness_score=0.1,
        accuracy_score=0.1,
        logic_score=0.1,
        tone_clarity_score=0.5,
        time_mgmt_score=0.5,
        classification="Weak",
        technical_terms_detected=[],
        missing_concepts=["indexing", "vector search"],
        incorrect_concepts=[],
        recommended_difficulty="Easy"
    )
    sm.record_evaluation("adaptive-test", eval_weak)
    
    spy_llm.mock_response = "What is a vector database?"
    q_text_weak = await q_gen.generate_question(state, candidate, last_eval=eval_weak)
    
    # 2. Weak answer -> easier difficulty prompt context
    assert "INTERVIEW LEVEL: Easy" in spy_llm.last_prompt
    assert "PROBING STRATEGY: NEW_TOPIC" in spy_llm.last_prompt
    assert "ask a simpler, more fundamental question" in spy_llm.last_prompt
    assert q_text_weak == "What is a vector database?"
    
    # Update active question
    state.current_question = q_text_weak
    
    # --- Test Scenario 3: Partial answer with missing concepts -> targeted probe ---
    eval_partial = AnswerEvaluation(
        question_number=3,
        question_text="What is a vector database?",
        candidate_answer="It stores vectors.",
        completeness_score=0.5,
        accuracy_score=0.6,
        logic_score=0.5,
        tone_clarity_score=0.7,
        time_mgmt_score=0.7,
        classification="Partial",
        technical_terms_detected=["vectors"],
        missing_concepts=["cosine similarity", "index lookup"],
        incorrect_concepts=[],
        recommended_difficulty="Easy"
    )
    sm.record_evaluation("adaptive-test", eval_partial)
    
    spy_llm.mock_response = "How does cosine similarity measure vector distance?"
    q_text_partial = await q_gen.generate_question(state, candidate, last_eval=eval_partial)
    
    # 4. Missing concept -> targeted probe instruction in requirements
    assert "cosine similarity" in spy_llm.last_prompt
    assert "index lookup" in spy_llm.last_prompt
    assert "prioritize probing those missing concepts" in spy_llm.last_prompt
    assert q_text_partial == "How does cosine similarity measure vector distance?"
    
    # Update active question
    state.current_question = q_text_partial
    
    # --- Test Scenario 4: Same question is not repeated ---
    # Mock LLM trying to repeat Q1 ("What is RAG?")
    spy_llm.mock_response = "What is RAG?"
    q_text_fallback = await q_gen.generate_question(state, candidate, last_eval=eval_partial)
    
    # It must trigger fallback sanitization because "What is RAG?" is in previous_questions
    assert q_text_fallback != "What is RAG?"
    assert q_text_fallback.endswith("?")
