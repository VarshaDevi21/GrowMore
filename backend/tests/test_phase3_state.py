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

def test_comprehensive_state_management(manager):
    """Test all 9 state management requirements sequentially."""
    # 1. Session creation
    state = manager.create_session(
        session_id="comp-sess",
        candidate_id="CAND-001",
        candidate_name="Sarah Johnson",
        candidate_role="Senior Data Engineer",
        level="Medium"
    )
    assert state.session_id == "comp-sess"
    assert state.candidate_id == "CAND-001"
    assert state.candidate_name == "Sarah Johnson"
    assert state.candidate_role == "Senior Data Engineer"
    
    # 2. Session retrieval
    retrieved = manager.get_session("comp-sess")
    assert retrieved is not None
    assert retrieved.session_id == "comp-sess"
    
    # 3. Question count & 4. Current question
    assert state.question_count == 0
    state = manager.advance_question("comp-sess", "Q1 text")
    assert state.question_count == 1
    assert state.current_question == "Q1 text"
    
    # 5. Curriculum tracking & 6. Technical-term tracking & 7. Evaluation storage & 8. Difficulty update
    eval_obj = AnswerEvaluation(
        question_number=1,
        question_text="Q1 text",
        candidate_answer="My answer with embeddings and vector database.",
        completeness_score=0.8,
        accuracy_score=0.9,
        logic_score=0.8,
        tone_clarity_score=0.8,
        time_mgmt_score=1.0,
        classification="Strong",
        technical_terms_detected=["embeddings", "vector database"],
        missing_concepts=["cosine similarity"],
        incorrect_concepts=[],
        recommended_difficulty="Hard"
    )
    state = manager.record_evaluation(
        session_id="comp-sess",
        evaluation=eval_obj,
        covered_day=7,
        covered_topic="Embeddings Explained"
    )
    
    # 5. Curriculum tracking
    assert 7 in state.covered_days
    assert "Embeddings Explained" in state.covered_topics
    
    # 6. Technical-term tracking
    assert "embeddings" in state.mentioned_terms
    assert "vector database" in state.mentioned_terms
    assert "cosine similarity" in state.skill_gaps
    
    # 7. Evaluation storage
    assert len(state.answer_evaluations) == 1
    assert state.answer_evaluations[0].question_number == 1
    
    # 8. Difficulty update
    assert state.level == "Hard"
    
    # 9. Session status
    assert state.status == "ACTIVE"
    
    # Check that question count increases up to 10 and status becomes COMPLETED after Q10 evaluation
    for q in range(2, 11):
        state = manager.advance_question("comp-sess", f"Q{q} text")
        assert state.question_count == q
        
        eval_q = AnswerEvaluation(
            question_number=q,
            question_text=f"Q{q} text",
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
            recommended_difficulty="Hard"
        )
        state = manager.record_evaluation("comp-sess", eval_q)
        
    assert state.question_count == 10
    assert state.status == "COMPLETED"
    
    # Attempting to advance beyond 10 keeps it at 10 and COMPLETED
    state = manager.advance_question("comp-sess", "Q11 text")
    assert state.question_count == 10
    assert state.status == "COMPLETED"

