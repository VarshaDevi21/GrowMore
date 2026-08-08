import pytest
import anyio
from services.state_manager import StateManager
from services.curriculum_retriever import curriculum_retriever
from services.interview_engine import InterviewEngine
from services.candidate_loader import candidate_loader
from state.interview_state import AnswerEvaluation
from models.schemas import InterviewRequest, FeedbackPayload

class MockQuestionGenerator:
    async def generate_question(self, state, candidate, last_eval=None) -> str:
        return "Target question?"

class DeepDiveMockEvaluator:
    async def evaluate_answer(self, question_number, question_text, candidate_answer, current_level, curriculum_context=""):
        # Always return tech terms detected so the engine wants to do a deep-dive
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
            technical_terms_detected=["RAG"],
            missing_concepts=[],
            incorrect_concepts=[],
            recommended_difficulty="Medium"
        )

class MockFeedbackGenerator:
    async def generate_feedback(self, state) -> FeedbackPayload:
        return FeedbackPayload(summary="End", strengths=[], gaps=[], next=[])

def test_deterministic_coverage_tracking():
    sm = StateManager()
    session_id = "coverage-test-sess"
    
    state = sm.create_session(
        session_id=session_id,
        candidate_id="CAND-001",
        candidate_name="Sarah Johnson",
        candidate_role="Senior Data Engineer"
    )
    
    assert len(state.covered_days) == 0
    assert len(state.covered_topics) == 0
    
    eval_dummy = AnswerEvaluation(
        question_number=1,
        question_text="Q?",
        candidate_answer="A",
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
    
    # 1. First day tracked
    sm.record_evaluation(session_id, eval_dummy, covered_day=7, covered_topic="Embeddings Explained")
    assert state.covered_days == [7]
    assert state.covered_topics == ["Embeddings Explained"]
    
    # 2. Duplicate day does not increase count
    sm.record_evaluation(session_id, eval_dummy, covered_day=7, covered_topic="Embeddings Explained")
    assert state.covered_days == [7]
    assert state.covered_topics == ["Embeddings Explained"]
    
    # 3. Second unique day tracked
    sm.record_evaluation(session_id, eval_dummy, covered_day=8, covered_topic="Vector Databases Overview")
    assert state.covered_days == [7, 8]
    assert state.covered_topics == ["Embeddings Explained", "Vector Databases Overview"]
    
    # 4. Third unique day tracked
    sm.record_evaluation(session_id, eval_dummy, covered_day=10, covered_topic="Retrieval & Matching Engine")
    assert state.covered_days == [7, 8, 10]
    
    # 5. Fourth unique day tracked
    sm.record_evaluation(session_id, eval_dummy, covered_day=12, covered_topic="Prompt Engineering Fundamentals")
    assert state.covered_days == [7, 8, 10, 12]

def test_irrelevant_days_filtering():
    # 6. Irrelevant day is not selected
    cand = candidate_loader.get_candidate("CAND-001") # Sarah Johnson
    assert cand is not None
    
    # Sarah has encountered days in [7, 8, 10, 12, 16, 22, 23, 28, 29, 31]
    # Call select_next_probing_day repeatedly and verify it never returns Day 1 or Day 2
    covered = []
    for _ in range(20):
        day_obj = curriculum_retriever.select_next_probing_day(cand, covered)
        assert day_obj is not None
        assert day_obj.day in [7, 8, 10, 12, 16, 22, 23, 28, 29, 31]
        assert day_obj.day not in [1, 2, 3, 4, 5, 6]
        if day_obj.day not in covered:
            covered.append(day_obj.day)

@pytest.mark.anyio
async def test_engine_four_day_min_coverage_force():
    sm = StateManager()
    fake_q_gen = MockQuestionGenerator()
    fake_eval = DeepDiveMockEvaluator()
    fake_fb = MockFeedbackGenerator()
    
    engine = InterviewEngine(
        sm=sm,
        eval_service=fake_eval,
        q_gen_service=fake_q_gen,
        fb_service=fake_fb
    )
    
    session_id = "min-cov-force-sess"
    candidate = candidate_loader.get_candidate("CAND-001")
    
    # Init interview (sets Q1)
    req_init = InterviewRequest(sessionId=session_id, candidate=candidate)
    await engine.process_turn(req_init)
    
    state = sm.get_session(session_id)
    assert state is not None
    
    # 7. Actual question context maps to the recorded day
    # Verify that the day context mapped on start is a valid encountered day
    assert state.current_curriculum_day in [7, 8, 10, 12, 16, 22, 23, 28, 29, 31]
    
    # Answer questions Q1 to Q9.
    # Since evaluator always returns technical terms, the engine will try to DEEP_DIVE.
    # But as we get close to the end, the engine must force NEW_TOPIC to cover at least 4 unique days.
    for q in range(1, 10):
        req = InterviewRequest(sessionId=session_id, message=f"Answer to Q{q}")
        await engine.process_turn(req)
        
    # Answer Q10 to complete the interview
    req_10 = InterviewRequest(sessionId=session_id, message="Answer to Q10")
    await engine.process_turn(req_10)
    
    # 8. Final state accurately represents curriculum coverage
    assert state.status == "COMPLETED"
    
    # Verify that at least 4 unique days were covered
    unique_covered_days = set(state.covered_days)
    assert len(unique_covered_days) >= 4
    
    # Also verify that every day in covered_days is an actual candidate encountered day
    encountered_days = {m.day for m in candidate.missions}
    assert unique_covered_days.issubset(encountered_days)
