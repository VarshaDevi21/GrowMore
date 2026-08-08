import pytest
import anyio
from services.interview_engine import InterviewEngine
from services.state_manager import StateManager
from services.curriculum_retriever import curriculum_retriever
from services.candidate_loader import candidate_loader
from services.feedback_generator import FeedbackGenerator
from services.llm.base import BaseLLMProvider
from state.interview_state import AnswerEvaluation
from models.schemas import InterviewRequest, FeedbackPayload

class FakeLLMProvider(BaseLLMProvider):
    async def generate_completion(self, prompt: str, system_prompt=None, temperature=0.7) -> str:
        # Mock summary evaluation text
        return "The candidate demonstrated solid programming skills. Strengths include database integration. Areas for growth include vector embeddings."

    async def generate_structured_json(self, prompt: str, system_prompt=None, temperature=0.2) -> dict:
        return {}

class ControlledMockEvaluator:
    def __init__(self):
        self.call_count = 0

    async def evaluate_answer(self, question_number, question_text, candidate_answer, current_level, curriculum_context=""):
        self.call_count += 1
        
        # On turn 3, return a specific missing concept (gap) that maps to Day 7
        # On turn 5, return a specific missing concept (gap) that does not exist in curriculum (triggering fallback)
        missing = []
        if question_number == 3:
            missing = ["embeddings"]
        elif question_number == 5:
            missing = ["nonexistent_concept_xyz"]

        return AnswerEvaluation(
            question_number=question_number,
            question_text=question_text,
            candidate_answer=candidate_answer,
            completeness_score=0.8,
            accuracy_score=0.8,
            logic_score=0.8,
            tone_clarity_score=0.8,
            time_mgmt_score=1.0,
            classification="Strong",
            technical_terms_detected=["Python", "FastAPI"],
            missing_concepts=missing,
            incorrect_concepts=[],
            recommended_difficulty="Medium"
        )

class MockQuestionGenerator:
    async def generate_question(self, state, candidate, last_eval=None) -> str:
        return f"Question {state.question_count + 1}?"

@pytest.mark.anyio
async def test_final_feedback_flow_and_validation():
    sm = StateManager()
    fake_llm = FakeLLMProvider()
    fake_eval = ControlledMockEvaluator()
    fake_q_gen = MockQuestionGenerator()
    
    # Use real FeedbackGenerator with fake LLM
    real_fb_gen = FeedbackGenerator(llm_provider=fake_llm)
    
    engine = InterviewEngine(
        sm=sm,
        eval_service=fake_eval,
        q_gen_service=fake_q_gen,
        fb_service=real_fb_gen
    )
    
    session_id = "test-final-feedback-sess"
    candidate = candidate_loader.get_candidate("CAND-001")
    assert candidate is not None
    
    # 1. Initialize interview (sets Q1)
    req_init = InterviewRequest(sessionId=session_id, candidate=candidate)
    res_init = await engine.process_turn(req_init)
    
    assert res_init.done is False
    state = sm.get_session(session_id)
    assert state is not None
    assert state.question_count == 1
    
    # 2. Answer Q1 to Q9 (produces Q2 to Q10)
    for q in range(1, 10):
        req = InterviewRequest(sessionId=session_id, message=f"Answer to Q{q}")
        res = await engine.process_turn(req)
        assert res.done is False
        assert state.question_count == q + 1
        
    assert state.question_count == 10
    assert len(state.answer_evaluations) == 9
    
    # 3. Answer Q10 to complete the interview
    req_10 = InterviewRequest(sessionId=session_id, message="Answer to Q10")
    res_10 = await engine.process_turn(req_10)
    
    # 4. Verify Q10 evaluation exists
    assert len(state.answer_evaluations) == 10
    assert state.answer_evaluations[-1].question_number == 10
    assert fake_eval.call_count == 10
    
    # 5. Verify status and done flag
    assert res_10.done is True
    assert state.status == "COMPLETED"
    assert state.question_count == 10
    
    # 6. Verify final feedback exists
    assert res_10.feedback is not None
    feedback = res_10.feedback
    
    # 7. Verify summary
    assert isinstance(feedback.summary, str)
    assert len(feedback.summary) > 20
    assert "candidate demonstrated" in feedback.summary.lower()
    
    # 8. Verify strengths
    assert isinstance(feedback.strengths, list)
    assert len(feedback.strengths) > 0
    
    # 9. Verify gaps
    assert isinstance(feedback.gaps, list)
    assert "embeddings" in feedback.gaps
    assert "nonexistent_concept_xyz" in feedback.gaps
    
    # 10. Verify next recommendations format and mapping
    assert isinstance(feedback.next, list)
    assert len(feedback.next) > 0
    
    # Check that each recommendation matches: "Day [actual day] — [actual curriculum topic]"
    # and maps to a real curriculum day
    for rec in feedback.next:
        assert " — " in rec  # Check for em-dash
        parts = rec.split(" — ")
        assert len(parts) >= 2
        
        day_part = parts[0]  # "Day X"
        topic_part = parts[1]  # "Topic Name"
        
        assert day_part.startswith("Day ")
        day_num_str = day_part.replace("Day ", "").strip()
        assert day_num_str.isdigit()
        day_num = int(day_num_str)
        
        # Verify it maps to actual curriculum data
        curr_day = curriculum_retriever.get_day(day_num)
        assert curr_day is not None
        assert curr_day.title == topic_part
        
        # Verify no invented day numbers or topics
        assert curr_day.day == day_num
        
    # Check that "embeddings" mapped to Day 7 and "nonexistent_concept_xyz" fell back to Day 11
    # Day 7 is "Embeddings Explained"
    # Day 11 is "RAG End-to-End & LLM API Basics"
    day_numbers = []
    for rec in feedback.next:
        parts = rec.split(" — ")
        day_num = int(parts[0].replace("Day ", "").strip())
        day_numbers.append(day_num)
        
    assert 6 in day_numbers or 7 in day_numbers
    assert 11 in day_numbers
    
    # 11. Attempt another answer after completion
    req_11 = InterviewRequest(sessionId=session_id, message="Answer to Q11")
    res_11 = await engine.process_turn(req_11)
    
    # 12. Verify interview remains completed
    assert res_11.done is True
    assert state.status == "COMPLETED"
    assert state.question_count == 10
    assert len(state.answer_evaluations) == 10
    assert fake_eval.call_count == 10  # Evaluator call count did not increase
    
    # Verify cached feedback is returned
    assert res_11.feedback == feedback
