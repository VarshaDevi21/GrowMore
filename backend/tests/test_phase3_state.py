import pytest
import time
from services.state_manager import StateManager
from state.interview_state import AnswerEvaluation

@pytest.fixture
def manager():
    sm = StateManager()
    sm.clear_all_sessions()
    yield sm
    sm.clear_all_sessions()

def test_session_creation_and_retrieval(manager):
    """Test session creation and field initialization."""
    state = manager.create_session(
        session_id="sess-001",
        candidate_id="CAND-001",
        candidate_name="Sarah Johnson",
        candidate_role="Senior Data Engineer",
        level="Hard"
    )
    assert state.session_id == "sess-001"
    assert state.candidate_name == "Sarah Johnson"
    assert state.level == "Hard"
    assert state.question_count == 0
    assert state.status == "ACTIVE"
    
    retrieved = manager.get_session("sess-001")
    assert retrieved == state

def test_question_count_hard_limit(manager):
    """Test that question count advances from 1 to 10 and sets status COMPLETED after Q10 evaluation."""
    manager.create_session("sess-002", "CAND-002", "Alex Turner", "Backend Software Engineer")
    
    for i in range(1, 11):
        state = manager.advance_question("sess-002", f"Question {i} text")
        assert state.question_count == i
        assert state.status == "ACTIVE"
        
        # Simulate candidate answering each question
        eval_obj = AnswerEvaluation(
            question_number=i,
            question_text=f"Question {i} text",
            candidate_answer=f"Answer {i}",
            completeness_score=0.8,
            accuracy_score=0.8,
            logic_score=0.8,
            tone_clarity_score=0.8,
            time_mgmt_score=1.0,
            classification="Strong",
            technical_terms_detected=["Python"],
            missing_concepts=[],
            incorrect_concepts=[],
            recommended_difficulty="Medium"
        )
        state = manager.record_evaluation("sess-002", eval_obj)
        if i < 10:
            assert state.status == "ACTIVE"
        else:
            assert state.status == "COMPLETED"

    # Attempting to advance beyond Question 10 should remain COMPLETED and capped at 10
    state_after = manager.advance_question("sess-002", "Question 11 text")
    assert state_after.question_count == 10
    assert state_after.status == "COMPLETED"

def test_timer_expiration(manager):
    """Test that elapsed time > 20 minutes triggers EXPIRED_TIME status."""
    state = manager.create_session("sess-003", "CAND-003", "Emily Chen", "AI Engineer")
    
    # Simulate start time 21 minutes in the past
    state.start_time = time.time() - (21 * 60)
    
    expired = manager.check_timer_expired("sess-003")
    assert expired is True
    assert state.status == "EXPIRED_TIME"

def test_violation_counter(manager):
    """Test 3 violation threshold rules (1: warning, 2: warning, 3: fail)."""
    manager.create_session("sess-004", "CAND-004", "David Miller", "Business Analyst")
    
    # Violation 1
    state, msg1 = manager.record_violation("sess-004")
    assert state.violations_count == 1
    assert state.status == "ACTIVE"
    assert "Violation 1/3" in msg1

    # Violation 2
    state, msg2 = manager.record_violation("sess-004")
    assert state.violations_count == 2
    assert state.status == "ACTIVE"
    assert "Violation 2/3" in msg2

    # Violation 3 -> FAILED_VIOLATION
    state, msg3 = manager.record_violation("sess-004")
    assert state.violations_count == 3
    assert state.status == "FAILED_VIOLATION"
    assert "INTERVIEW FAILED" in msg3

def test_record_evaluation(manager):
    """Test recording evaluation and updating state attributes."""
    manager.create_session("sess-005", "CAND-005", "Michael Brown", "DevOps Engineer")
    manager.advance_question("sess-005", "What is RAG?")
    
    eval_obj = AnswerEvaluation(
        question_number=1,
        question_text="What is RAG?",
        candidate_answer="RAG stands for Retrieval-Augmented Generation.",
        completeness_score=0.9,
        accuracy_score=0.95,
        logic_score=0.85,
        tone_clarity_score=0.9,
        time_mgmt_score=1.0,
        classification="Strong",
        technical_terms_detected=["RAG", "retrieval", "vector database"],
        missing_concepts=["embedding models"],
        incorrect_concepts=[],
        recommended_difficulty="Hard"
    )
    
    state = manager.record_evaluation(
        session_id="sess-005",
        evaluation=eval_obj,
        covered_day=11,
        covered_topic="RAG End-to-End & LLM API Basics"
    )
    
    assert len(state.answer_evaluations) == 1
    assert 11 in state.covered_days
    assert "RAG End-to-End & LLM API Basics" in state.covered_topics
    assert "RAG" in state.mentioned_terms
    assert "vector database" in state.mentioned_terms
    assert "embedding models" in state.skill_gaps
    assert state.level == "Hard"
