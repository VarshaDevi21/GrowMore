import pytest
import anyio
from services.interview_engine import InterviewEngine
from services.state_manager import StateManager
from state.interview_state import AnswerEvaluation
from models.schemas import InterviewRequest, CandidatePayload, FeedbackPayload, CandidateMember, CandidateSignals
from services.candidate_loader import candidate_loader

class FakeQuestionGenerator:
    def __init__(self):
        self.generated_questions = []

    async def generate_question(self, state, candidate, last_eval=None) -> str:
        q_num = state.question_count + 1
        q_text = f"Question {q_num}?"
        self.generated_questions.append(q_text)
        return q_text

class FakeAnswerEvaluator:
    def __init__(self):
        self.evaluated_answers = []

    async def evaluate_answer(
        self,
        question_number: int,
        question_text: str,
        candidate_answer: str,
        current_level: str,
        curriculum_context: str = ""
    ) -> AnswerEvaluation:
        self.evaluated_answers.append((question_number, candidate_answer))
        return AnswerEvaluation(
            question_number=question_number,
            question_text=question_text,
            candidate_answer=candidate_answer,
            completeness_score=0.9,
            accuracy_score=0.9,
            logic_score=0.9,
            tone_clarity_score=0.9,
            time_mgmt_score=1.0,
            classification="Strong",
            technical_terms_detected=[],
            missing_concepts=[],
            incorrect_concepts=[],
            recommended_difficulty="Medium"
        )

class FakeFeedbackGenerator:
    async def generate_feedback(self, state) -> FeedbackPayload:
        return FeedbackPayload(
            summary="Fake Summary",
            strengths=["Fake Strength"],
            gaps=["Fake Gap"],
            next=["Day 7 — Embeddings Explained — Study hard."]
        )

@pytest.mark.anyio
async def test_exact_interview_lifecycle():
    # Instantiate custom StateManager and dependencies to isolate the test session
    sm = StateManager()
    fake_q_gen = FakeQuestionGenerator()
    fake_eval = FakeAnswerEvaluator()
    fake_fb = FakeFeedbackGenerator()
    
    engine = InterviewEngine(
        sm=sm,
        eval_service=fake_eval,
        q_gen_service=fake_q_gen,
        fb_service=fake_fb
    )
    
    session_id = "test-lifecycle-sess"
    
    # 1. Start creates Q1
    # Initialize the interview with the candidate object
    candidate = candidate_loader.get_candidate("CAND-001")
    assert candidate is not None
    
    req_init = InterviewRequest(
        sessionId=session_id,
        candidate=candidate
    )
    res_init = await engine.process_turn(req_init)
    
    # Verify first question generated and response structure
    assert res_init.done is False
    assert "Question 1?" in res_init.reply
    assert len(fake_q_gen.generated_questions) == 1
    assert fake_q_gen.generated_questions[0] == "Question 1?"
    
    state = sm.get_session(session_id)
    assert state is not None
    assert state.question_count == 1
    assert state.current_question == "Question 1?"
    assert state.status == "ACTIVE"
    assert len(state.answer_evaluations) == 0
    
    # 2. Q1 answer produces Q2
    req_turn1 = InterviewRequest(
        sessionId=session_id,
        message="Answer to Q1"
    )
    res_turn1 = await engine.process_turn(req_turn1)
    
    assert res_turn1.done is False
    assert "Question 2?" in res_turn1.reply
    assert len(fake_q_gen.generated_questions) == 2
    assert fake_q_gen.generated_questions[1] == "Question 2?"
    assert len(fake_eval.evaluated_answers) == 1
    assert fake_eval.evaluated_answers[0] == (1, "Answer to Q1")
    
    assert state.question_count == 2
    assert state.current_question == "Question 2?"
    assert len(state.answer_evaluations) == 1
    assert state.answer_evaluations[0].candidate_answer == "Answer to Q1"
    
    # Run through Q2 to Q9 answers
    # This will generate Q3 to Q10
    for i in range(2, 10):
        req_turn = InterviewRequest(
            sessionId=session_id,
            message=f"Answer to Q{i}"
        )
        res_turn = await engine.process_turn(req_turn)
        assert res_turn.done is False
        assert f"Question {i+1}?" in res_turn.reply
        assert state.question_count == i + 1
        assert len(state.answer_evaluations) == i
        assert len(fake_q_gen.generated_questions) == i + 1
        assert len(fake_eval.evaluated_answers) == i
        
    # At this point, Question 9 has been answered, Q10 was generated.
    # Current question count should be 9 + 1 = 10.
    assert state.question_count == 10
    assert state.current_question == "Question 10?"
    
    # 3. Q9 answer produces Q10 (Verified in loop above: turn 9 produced Q10, count is 10)
    
    # 4. Q10 answer completes the interview
    req_turn10 = InterviewRequest(
        sessionId=session_id,
        message="Answer to Q10"
    )
    res_turn10 = await engine.process_turn(req_turn10)
    
    # 5. Exactly 10 questions are generated (no Q11)
    assert len(fake_q_gen.generated_questions) == 10
    
    # 6. Exactly 10 answers are evaluated
    assert len(fake_eval.evaluated_answers) == 10
    assert fake_eval.evaluated_answers[-1] == (10, "Answer to Q10")
    
    # Verify completion payload
    assert res_turn10.done is True
    assert "Interview completed." in res_turn10.reply
    assert res_turn10.feedback is not None
    assert res_turn10.feedback.summary == "Fake Summary"
    
    assert state.status == "COMPLETED"
    assert len(state.answer_evaluations) == 10
    
    # 7. Q11 is never generated (already verified that len(generated_questions) == 10)
    
    # 8. Attempting another answer after completion does nothing
    req_turn11 = InterviewRequest(
        sessionId=session_id,
        message="Answer to Q11"
    )
    res_turn11 = await engine.process_turn(req_turn11)
    
    assert res_turn11.done is True
    assert "Interview completed." in res_turn11.reply
    assert res_turn11.feedback is not None
    assert res_turn11.feedback.summary == "Fake Summary"
    
    # 9. question_count remains 10
    assert state.question_count == 10
    assert len(state.answer_evaluations) == 10
    assert len(fake_q_gen.generated_questions) == 10
    assert len(fake_eval.evaluated_answers) == 10
