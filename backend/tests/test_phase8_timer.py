import pytest
import time
import anyio
from services.state_manager import StateManager
from services.interview_engine import InterviewEngine
from state.interview_state import AnswerEvaluation
from models.schemas import InterviewRequest, FeedbackPayload
from services.candidate_loader import candidate_loader

class MockQuestionGenerator:
    def __init__(self):
        self.called = False
    async def generate_question(self, state, candidate, last_eval=None) -> str:
        self.called = True
        return "New Question?"

class MockAnswerEvaluator:
    def __init__(self):
        self.called = False
    async def evaluate_answer(self, question_number, question_text, candidate_answer, current_level, curriculum_context=""):
        self.called = True
        return AnswerEvaluation(
            question_number=question_number,
            question_text=question_text,
            candidate_answer=candidate_answer,
            completeness_score=1.0,
            accuracy_score=1.0,
            logic_score=1.0,
            tone_clarity_score=1.0,
            time_mgmt_score=1.0,
            classification="Strong",
            technical_terms_detected=[],
            missing_concepts=[],
            incorrect_concepts=[],
            recommended_difficulty="Medium"
        )

class MockFeedbackGenerator:
    async def generate_feedback(self, state) -> FeedbackPayload:
        return FeedbackPayload(
            summary="Timeout feedback",
            strengths=[],
            gaps=[],
            next=[]
        )

def test_timer_durations():
    sm = StateManager()
    session_id = "timer-test-sess"
    
    # 1. New interview
    state = sm.create_session(
        session_id=session_id,
        candidate_id="CAND-001",
        candidate_name="Sarah Johnson",
        candidate_role="Senior Data Engineer"
    )
    assert sm.check_timer_expired(session_id) is False
    assert state.status == "ACTIVE"
    
    # 2. 5-minute elapsed
    state.start_time = time.time() - (5 * 60)
    assert sm.check_timer_expired(session_id) is False
    assert state.status == "ACTIVE"
    
    # 3. 19-minute elapsed
    state.start_time = time.time() - (19 * 60)
    assert sm.check_timer_expired(session_id) is False
    assert state.status == "ACTIVE"
    
    # 4. Exactly 20-minute boundary (at max duration)
    state.start_time = time.time() - (20 * 60)
    assert sm.check_timer_expired(session_id) is True
    assert state.status == "EXPIRED_TIME"
    
    # Reset status for next test
    state.status = "ACTIVE"
    
    # 5. More than 20 minutes
    state.start_time = time.time() - (21 * 60)
    assert sm.check_timer_expired(session_id) is True
    assert state.status == "EXPIRED_TIME"

@pytest.mark.anyio
async def test_expired_session_constraints():
    sm = StateManager()
    fake_q_gen = MockQuestionGenerator()
    fake_eval = MockAnswerEvaluator()
    fake_fb = MockFeedbackGenerator()
    
    engine = InterviewEngine(
        sm=sm,
        eval_service=fake_eval,
        q_gen_service=fake_q_gen,
        fb_service=fake_fb
    )
    
    session_id = "timer-constraint-sess"
    
    # Start the interview to generate Q1
    candidate = candidate_loader.get_candidate("CAND-001")
    req_init = InterviewRequest(sessionId=session_id, candidate=candidate)
    await engine.process_turn(req_init)
    
    # Get active session and simulate expiration
    state = sm.get_session(session_id)
    assert state is not None
    assert state.status == "ACTIVE"
    
    # Reset mock flags
    fake_q_gen.called = False
    fake_eval.called = False
    
    # Set time to 21 minutes in the past
    state.start_time = time.time() - (21 * 60)
    
    # Send turn request when expired
    req_turn = InterviewRequest(sessionId=session_id, message="My answer after timeout")
    res_turn = await engine.process_turn(req_turn)
    
    # Assertions for expired session constraints
    assert res_turn.done is True
    assert "Time limit exceeded" in res_turn.reply or "Interview completed" in res_turn.reply
    assert state.status == "EXPIRED_TIME"
    
    # 6. Expired session cannot generate a question
    assert fake_q_gen.called is False
    
    # 7. Expired session cannot evaluate an answer
    assert fake_eval.called is False
    
    # Attempting to submit another answer on expired session
    req_turn2 = InterviewRequest(sessionId=session_id, message="Another answer")
    res_turn2 = await engine.process_turn(req_turn2)
    
    assert res_turn2.done is True
    assert state.status == "EXPIRED_TIME"
    assert fake_q_gen.called is False
    assert fake_eval.called is False
