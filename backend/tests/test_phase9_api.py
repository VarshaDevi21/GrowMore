import pytest
from fastapi.testclient import TestClient
from main import app
from services.interview_engine import interview_engine
from services.state_manager import state_manager
from services.candidate_loader import candidate_loader
from services.llm.base import BaseLLMProvider
from models.schemas import FeedbackPayload

class APIMockLLMProvider(BaseLLMProvider):
    async def generate_completion(self, prompt: str, system_prompt=None, temperature=0.7) -> str:
        if "overall evaluation summary" in prompt.lower():
            return "The candidate performed very well. Strengths include FastAPI development. Areas for growth include vector embeddings."
        return "Next test question?"

    async def generate_structured_json(self, prompt: str, system_prompt=None, temperature=0.2) -> dict:
        return {
            "completeness_score": 0.8,
            "accuracy_score": 0.8,
            "logic_score": 0.8,
            "tone_clarity_score": 0.8,
            "time_mgmt_score": 1.0,
            "classification": "Strong",
            "technical_terms_detected": ["Python"],
            "missing_concepts": [],
            "incorrect_concepts": [],
            "recommended_difficulty": "Medium"
        }

@pytest.fixture(autouse=True)
def patch_llm(monkeypatch):
    mock_llm = APIMockLLMProvider()
    monkeypatch.setattr(interview_engine.evaluator, "llm_provider", mock_llm)
    monkeypatch.setattr(interview_engine.q_generator, "llm_provider", mock_llm)
    monkeypatch.setattr(interview_engine.feedback_gen, "llm_provider", mock_llm)
    
    # Clear sessions before and after test
    state_manager.clear_all_sessions()
    yield
    state_manager.clear_all_sessions()

def test_api_health():
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_api_start_interview():
    client = TestClient(app)
    candidate = candidate_loader.get_candidate("CAND-001")
    assert candidate is not None
    
    # 1. Verify starting an interview works & candidate data is handled correctly
    payload = {
        "sessionId": "api-sess-1",
        "candidate": candidate.model_dump()
    }
    response = client.post("/api/interview", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    assert "reply" in data
    assert "Welcome" in data["reply"]
    assert data["done"] is False
    assert "feedback" not in data or data["feedback"] is None
    
    # 2. Verify session is created and sessionId is preserved in state_manager
    session = state_manager.get_session("api-sess-1")
    assert session is not None
    assert session.candidate_id == "CAND-001"
    assert session.question_count == 1

def test_api_conversation_turns_and_completion():
    client = TestClient(app)
    candidate = candidate_loader.get_candidate("CAND-001")
    
    # Start interview
    payload_start = {
        "sessionId": "api-sess-2",
        "candidate": candidate.model_dump()
    }
    client.post("/api/interview", json=payload_start)
    
    # Answer turns 1 to 9
    for i in range(1, 10):
        payload_turn = {
            "sessionId": "api-sess-2",
            "message": f"Answer to turn {i}"
        }
        res = client.post("/api/interview", json=payload_turn)
        assert res.status_code == 200
        data = res.json()
        assert data["done"] is False
        assert "reply" in data
        assert "feedback" not in data or data["feedback"] is None

    # Answer turn 10 (completes the interview)
    payload_turn10 = {
        "sessionId": "api-sess-2",
        "message": "Answer to turn 10 which is strong."
    }
    res_10 = client.post("/api/interview", json=payload_turn10)
    assert res_10.status_code == 200
    data_10 = res_10.json()
    
    # Verify completed responses return correct done=True and FeedbackPayload
    assert data_10["done"] is True
    assert data_10["feedback"] is not None
    
    feedback = data_10["feedback"]
    assert "summary" in feedback
    assert "strengths" in feedback
    assert "gaps" in feedback
    assert "next" in feedback
    
    assert "FastAPI development" in feedback["summary"]
    
    # Attempt another answer post-completion
    payload_post = {
        "sessionId": "api-sess-2",
        "message": "Answer to turn 11"
    }
    res_post = client.post("/api/interview", json=payload_post)
    assert res_post.status_code == 200
    data_post = res_post.json()
    
    # Verify post-completion remains completed and returns same feedback
    assert data_post["done"] is True
    assert data_post["feedback"] == feedback

def test_api_violations_handling():
    client = TestClient(app)
    candidate = candidate_loader.get_candidate("CAND-001")
    
    # Start interview
    payload_start = {
        "sessionId": "api-sess-3",
        "candidate": candidate.model_dump()
    }
    client.post("/api/interview", json=payload_start)
    
    # Violation 1 -> warning
    res_v1 = client.post("/api/interview", json={"sessionId": "api-sess-3", "violation": True})
    assert res_v1.status_code == 200
    assert "Violation 1/3" in res_v1.json()["reply"]
    assert res_v1.json()["done"] is False
    
    # Violation 2 -> warning
    res_v2 = client.post("/api/interview", json={"sessionId": "api-sess-3", "violation": True})
    assert res_v2.status_code == 200
    assert "Violation 2/3" in res_v2.json()["reply"]
    assert res_v2.json()["done"] is False
    
    # Violation 3 -> failure and lockout
    res_v3 = client.post("/api/interview", json={"sessionId": "api-sess-3", "violation": True})
    assert res_v3.status_code == 200
    assert res_v3.json()["done"] is True
    assert "locked" in res_v3.json()["reply"].lower() or "maximum violations exceeded" in res_v3.json()["reply"].lower()

def test_api_request_validation_errors():
    client = TestClient(app)
    
    # Missing sessionId (should return 422 Unprocessable Entity)
    payload_invalid = {
        "candidate": {}
    }
    response = client.post("/api/interview", json=payload_invalid)
    assert response.status_code == 422

def test_api_internal_error_graceful_handling(monkeypatch):
    client = TestClient(app)
    
    # Mock process_turn to raise an unexpected Exception
    async def mock_fail(*args, **kwargs):
        raise ValueError("Simulated database failure or secret API key error: nvapi-secret-key-12345")
        
    monkeypatch.setattr(interview_engine, "process_turn", mock_fail)
    
    payload = {
        "sessionId": "api-sess-err",
        "message": "Hello"
    }
    response = client.post("/api/interview", json=payload)
    
    # Should return HTTP 500
    assert response.status_code == 500
    
    # Detail should be clean and not leak the internal traceback or secret key
    data = response.json()
    assert "detail" in data
    assert "internal error occurred" in data["detail"]
    assert "nvapi-secret-key-12345" not in response.text
