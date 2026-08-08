import pytest
import anyio
from services.interview_engine import InterviewEngine
from services.state_manager import StateManager
from state.interview_state import AnswerEvaluation
from models.schemas import InterviewRequest, FeedbackPayload
from services.candidate_loader import candidate_loader

class MockQuestionGenerator:
    def __init__(self):
        self.called = False
    async def generate_question(self, state, candidate, last_eval=None) -> str:
        self.called = True
        return f"Question {state.question_count + 1}?"

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
            summary="Lockout feedback",
            strengths=[],
            gaps=[],
            next=[]
        )

@pytest.mark.anyio
async def test_violation_controller_lifecycle():
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
    
    session_id = "violation-test-sess"
    
    # 1. Start interview
    candidate = candidate_loader.get_candidate("CAND-001")
    req_init = InterviewRequest(sessionId=session_id, candidate=candidate)
    res_init = await engine.process_turn(req_init)
    
    assert res_init.done is False
    assert "Question 1?" in res_init.reply
    
    state = sm.get_session(session_id)
    assert state is not None
    assert state.question_count == 1
    assert state.violations_count == 0
    assert state.status == "ACTIVE"
    
    # Reset mock flags
    fake_q_gen.called = False
    fake_eval.called = False
    
    # 2. Send violation (violation 1)
    req_viol1 = InterviewRequest(sessionId=session_id, violation=True)
    res_viol1 = await engine.process_turn(req_viol1)
    
    # 3. Verify question_count is unchanged (remains 1)
    assert state.question_count == 1
    # 4. Verify violations_count = 1
    assert state.violations_count == 1
    # Verify no eval or gen called
    assert fake_eval.called is False
    assert fake_q_gen.called is False
    # Verify first violation keeps interview ACTIVE
    assert state.status == "ACTIVE"
    assert res_viol1.done is False
    assert "Violation 1/3" in res_viol1.reply
    
    # 5. Send second violation
    req_viol2 = InterviewRequest(sessionId=session_id, violation=True)
    res_viol2 = await engine.process_turn(req_viol2)
    
    # 6. Verify violations_count = 2
    assert state.violations_count == 2
    assert state.question_count == 1
    assert state.status == "ACTIVE"
    assert res_viol2.done is False
    assert "Violation 2/3" in res_viol2.reply
    assert fake_eval.called is False
    assert fake_q_gen.called is False
    
    # 7. Send third violation
    req_viol3 = InterviewRequest(sessionId=session_id, violation=True)
    res_viol3 = await engine.process_turn(req_viol3)
    
    # 8. Verify interview is failed (FAILED_VIOLATION status and done: True)
    assert state.status == "FAILED_VIOLATION"
    assert state.violations_count == 3
    assert res_viol3.done is True
    assert "INTERVIEW FAILED" in res_viol3.reply or "maximum violations exceeded" in res_viol3.reply.lower()
    
    # 9. Verify no question is generated after failure (check generator was not called)
    assert fake_q_gen.called is False
    assert fake_eval.called is False
    
    # Reset flags to check subsequent turn
    fake_q_gen.called = False
    fake_eval.called = False
    
    # 10. Verify an answer cannot continue a failed interview
    req_msg = InterviewRequest(sessionId=session_id, message="Attempting to answer after fail")
    res_msg = await engine.process_turn(req_msg)
    
    assert res_msg.done is True
    assert state.status == "FAILED_VIOLATION"
    assert fake_eval.called is False
    assert fake_q_gen.called is False
