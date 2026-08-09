import pytest
from services.curriculum_retriever import CurriculumRetriever
from services.candidate_loader import candidate_loader

@pytest.fixture
def retriever():
    return CurriculumRetriever()

def test_candidate_encountered_curriculum(retriever):
    """Test that retriever filters curriculum days strictly based on candidate missions."""
    cand = candidate_loader.get_candidate("CAND-001")  # Sarah Johnson
    assert cand is not None
    
    encountered = retriever.get_candidate_encountered_days(cand)
    encountered_day_nums = [d.day for d in encountered]
    
    # Mission days for CAND-001: [7, 8, 10, 12, 16, 22, 23, 28, 29, 31]
    assert 7 in encountered_day_nums
    assert 8 in encountered_day_nums
    assert 28 in encountered_day_nums
    assert 1 not in encountered_day_nums  # Day 1 is not in Sarah's mission list

def test_select_next_probing_day(retriever):
    """Test selection of next probing day prioritizing skipped/failed missions and uncovered days."""
    cand = candidate_loader.get_candidate("CAND-001")  # Sarah skipped Day 29 (Monitoring, Logging)
    assert cand is not None

    covered_days = [7, 8, 10]
    next_day = retriever.select_next_probing_day(cand, covered_days)
    
    assert next_day is not None
    # Day 29 was skipped by Sarah, so it should be prioritized
    assert next_day.day == 29
    assert next_day.title == "Monitoring, Logging & Observability"

def test_map_gap_to_recommendation(retriever):
    """Test mapping a skill gap to exact curriculum recommendation string."""
    gap_topic = "Vector Databases"
    rec = retriever.map_gap_to_recommendation(gap_topic)
    
    assert rec.startswith("Day 8 — Vector Databases Overview")
    assert "Review objectives:" in rec

def test_invalid_and_fictional_days(retriever):
    """Test that fictional days return None and cannot be selected."""
    assert retriever.get_day(32) is None
    assert retriever.get_day(35) is None
    assert retriever.get_day(0) is None

#hello