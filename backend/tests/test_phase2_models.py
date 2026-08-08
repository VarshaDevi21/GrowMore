import pytest
from pydantic import ValidationError
from models.schemas import CurriculumDay, CandidateMember, InterviewRequest
from services.curriculum_retriever import curriculum_retriever
from services.candidate_loader import candidate_loader
from state.interview_state import InterviewState, AnswerEvaluation

def test_curriculum_loading():
    """Verify that curriculum loads completely and parses all 31 days."""
    curriculum = curriculum_retriever.curriculum
    assert curriculum.cohort == "AI Cohort · 31 days · 8 modules"
    assert len(curriculum.modules) == 8
    assert len(curriculum.days) == 31
    
    # Test specific day lookup
    day_7 = curriculum_retriever.get_day(7)
    assert day_7 is not None
    assert day_7.title == "Embeddings Explained"
    assert day_7.type == "AI_CORE"
    assert "Sentence Transformers" in day_7.tools

def test_candidate_loading():
    """Verify that candidate dataset loads properly with all 20 candidates."""
    candidates = candidate_loader.data.candidates
    assert len(candidates) == 20
    
    # Lookup CAND-001 (Sarah Johnson)
    cand_1 = candidate_loader.get_candidate("CAND-001")
    assert cand_1 is not None
    assert cand_1.member.name == "Sarah Johnson"
    assert cand_1.member.jobRole == "Senior Data Engineer"
    
    # Verify completed, skipped, failed days
    completed = candidate_loader.get_completed_days(cand_1)
    skipped = candidate_loader.get_skipped_days(cand_1)
    assert 7 in completed
    assert 29 in skipped

def test_interview_state_validation():
    """Verify that InterviewState model instantiates and validates correctly."""
    state = InterviewState(
        session_id="test-session-123",
        candidate_id="CAND-001",
        candidate_name="Sarah Johnson",
        candidate_role="Senior Data Engineer"
    )
    assert state.question_count == 0
    assert state.duration_minutes == 20.0
    assert state.status == "ACTIVE"
    assert state.level == "Medium"

def test_invalid_schema_rejection():
    """Verify that invalid data payload raises Pydantic ValidationError."""
    # Invalid CurriculumDay: day must be an integer, not a dictionary/invalid string
    with pytest.raises(ValidationError):
        CurriculumDay(
            day="invalid-day-number",
            title=12345,  # type mismatch
            type="BUILD"
        )
    
    # Invalid CandidateMember: missing required fields
    with pytest.raises(ValidationError):
        CandidateMember(
            id="CAND-999"
            # Missing name, jobRole, yearsExperience, education, status
        )

def test_interview_request_parsing():
    """Verify InterviewRequest parsing with valid payload."""
    req = InterviewRequest(sessionId="session-xyz", message="Hello world")
    assert req.sessionId == "session-xyz"
    assert req.message == "Hello world"
    assert req.candidate is None
