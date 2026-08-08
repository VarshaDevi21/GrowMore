import pytest
import anyio
from services.interview_engine import InterviewEngine
from services.state_manager import StateManager
from state.interview_state import AnswerEvaluation
from models.schemas import InterviewRequest, FeedbackPayload
from services.candidate_loader import candidate_loader

class MockQuestionGenerator:
    async def generate_question(self, state, candidate, last_eval=None) -> str:
        return f"Question {state.question_count + 1}?"

class ControlledMockEvaluator:
    def __init__(self):
        self.call_count = 0
        # Default mock evaluation output
        self.mock_eval = AnswerEvaluation(
            question_number=1,
            question_text="Dummy Question",
            candidate_answer="Dummy Answer",
            completeness_score=0.9,
            accuracy_score=0.9,
            logic_score=0.9,
            tone_clarity_score=0.9,
            time_mgmt_score=1.0,
            classification="Strong",
            technical_terms_detected=["word1"],
            missing_concepts=["word2"],
            incorrect_concepts=["word3"],
            recommended_difficulty="Hard"
        )

    async def evaluate_answer(self, question_number, question_text, candidate_answer, current_level, curriculum_context=""):
        self.call_count += 1
        # Dynamically set candidate answer and question info
        self.mock_eval.question_number = question_number
        self.mock_eval.question_text = question_text
        self.mock_eval.candidate_answer = candidate_answer
        return self.mock_eval

class MockFeedbackGenerator:
    async def generate_feedback(self, state) -> FeedbackPayload:
        return FeedbackPayload(summary="Done", strengths=[], gaps=[], next=[])

@pytest.mark.anyio
async def test_evaluator_integration_scenarios():
    sm = StateManager()
    fake_q_gen = MockQuestionGenerator()
    fake_eval = ControlledMockEvaluator()
    fake_fb = MockFeedbackGenerator()
    
    engine = InterviewEngine(
        sm=sm,
        eval_service=fake_eval,
        q_gen_service=fake_q_gen,
        fb_service=fake_fb
    )
    
    session_id = "eval-integration-sess"
    candidate = candidate_loader.get_candidate("CAND-001")
    
    # 9. Initial interview request is not evaluated
    req_init = InterviewRequest(sessionId=session_id, candidate=candidate)
    res_init = await engine.process_turn(req_init)
    
    assert res_init.done is False
    assert fake_eval.call_count == 0  # Initial request has no evaluation
    
    state = sm.get_session(session_id)
    assert state is not None
    assert len(state.answer_evaluations) == 0
    assert state.level == "Medium"
    
    # 1. Strong answer
    fake_eval.mock_eval = AnswerEvaluation(
        question_number=1,
        question_text="Question 1?",
        candidate_answer="Embedding vectors are stored in database.",
        completeness_score=0.9,
        accuracy_score=0.9,
        logic_score=0.8,
        tone_clarity_score=0.9,
        time_mgmt_score=1.0,
        classification="Strong",
        technical_terms_detected=["embedding vectors", "database"],
        missing_concepts=["cosine similarity"],
        incorrect_concepts=["wrong math"],
        recommended_difficulty="Hard"
    )
    
    req_turn1 = InterviewRequest(sessionId=session_id, message="Embedding vectors are stored in database.")
    await engine.process_turn(req_turn1)
    
    # 8. Evaluation stored exactly once
    assert fake_eval.call_count == 1
    assert len(state.answer_evaluations) == 1
    
    # 7. Difficulty recommendation & 8. state checks
    assert state.level == "Hard"
    # 4. Answer containing technical terms
    assert "embedding vectors" in state.mentioned_terms
    assert "database" in state.mentioned_terms
    # 5. Missing concepts
    assert "cosine similarity" in state.skill_gaps
    # 6. Incorrect concepts
    assert "wrong math" in state.weaknesses
    
    # 2. Partial answer
    fake_eval.mock_eval = AnswerEvaluation(
        question_number=2,
        question_text="Question 2?",
        candidate_answer="Vague response.",
        completeness_score=0.6,
        accuracy_score=0.6,
        logic_score=0.6,
        tone_clarity_score=0.7,
        time_mgmt_score=0.8,
        classification="Partial",
        technical_terms_detected=["vague"],
        missing_concepts=[],
        incorrect_concepts=[],
        recommended_difficulty="Hard"
    )
    
    req_turn2 = InterviewRequest(sessionId=session_id, message="Vague response.")
    await engine.process_turn(req_turn2)
    
    assert fake_eval.call_count == 2
    assert len(state.answer_evaluations) == 2
    assert state.level == "Hard"  # Maintained Hard difficulty
    assert "vague" in state.mentioned_terms
    
    # 3. Weak answer
    fake_eval.mock_eval = AnswerEvaluation(
        question_number=3,
        question_text="Question 3?",
        candidate_answer="Incorrect info.",
        completeness_score=0.2,
        accuracy_score=0.3,
        logic_score=0.4,
        tone_clarity_score=0.5,
        time_mgmt_score=0.5,
        classification="Weak",
        technical_terms_detected=[],
        missing_concepts=["accuracy"],
        incorrect_concepts=["mistake"],
        recommended_difficulty="Medium"
    )
    
    req_turn3 = InterviewRequest(sessionId=session_id, message="Incorrect info.")
    await engine.process_turn(req_turn3)
    
    assert fake_eval.call_count == 3
    assert len(state.answer_evaluations) == 3
    assert state.level == "Medium"  # Decreased difficulty
    assert "accuracy" in state.skill_gaps
    assert "mistake" in state.weaknesses
    
    # 10. Violation-only request is not evaluated
    req_viol = InterviewRequest(sessionId=session_id, violation=True)
    res_viol = await engine.process_turn(req_viol)
    
    assert res_viol.done is False
    assert fake_eval.call_count == 3  # Count not incremented
    assert len(state.answer_evaluations) == 3
    
    # Fast-forward to completion
    # Fill state with 10 evaluations manually to simulate completion
    for q in range(4, 11):
        state.answer_evaluations.append(
            AnswerEvaluation(
                question_number=q,
                question_text=f"Question {q}?",
                candidate_answer=f"Answer {q}",
                completeness_score=0.8,
                accuracy_score=0.8,
                logic_score=0.8,
                tone_clarity_score=0.8,
                time_mgmt_score=1.0,
                classification="Strong",
                technical_terms_detected=[],
                missing_concepts=[],
                incorrect_concepts=[],
                recommended_difficulty="Medium"
            )
        )
    state.question_count = 10
    state.status = "COMPLETED"
    
    # Reset evaluator count
    fake_eval.call_count = 0
    
    # 11. Post-completion answer is not evaluated
    req_post = InterviewRequest(sessionId=session_id, message="Answer after completion")
    res_post = await engine.process_turn(req_post)
    
    assert res_post.done is True
    assert fake_eval.call_count == 0  # No evaluation
    assert len(state.answer_evaluations) == 10
