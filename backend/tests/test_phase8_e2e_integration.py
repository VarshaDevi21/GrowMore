import pytest
import anyio
import time
from services.interview_engine import InterviewEngine
from services.state_manager import StateManager
from services.evaluator import AnswerEvaluator
from services.question_generator import QuestionGenerator
from services.feedback_generator import FeedbackGenerator
from services.curriculum_retriever import curriculum_retriever
from services.candidate_loader import candidate_loader
from state.interview_state import AnswerEvaluation
from models.schemas import InterviewRequest, FeedbackPayload, CandidatePayload
from services.llm.base import BaseLLMProvider

class E2EMockLLMProvider(BaseLLMProvider):
    def __init__(self):
        self.question_count = 0
        self.last_prompt = ""
        self.last_system_prompt = ""
        self.prompts_received = []

    async def generate_completion(self, prompt: str, system_prompt=None, temperature=0.7) -> str:
        self.last_prompt = prompt
        self.last_system_prompt = system_prompt
        self.prompts_received.append(prompt)
        
        if "overall evaluation summary" in prompt.lower():
            return "The candidate demonstrated strong knowledge in FastAPI and vector databases. Recommended to study advanced topics."
            
        self.question_count += 1
        return f"Generated question {self.question_count} about FastAPI?"

    async def generate_structured_json(self, prompt: str, system_prompt=None, temperature=0.2) -> dict:
        self.last_prompt = prompt
        self.last_system_prompt = system_prompt
        
        ans = prompt.lower()
        if "strong" in ans:
            return {
                "completeness_score": 0.9,
                "accuracy_score": 0.9,
                "logic_score": 0.9,
                "tone_clarity_score": 0.9,
                "time_mgmt_score": 1.0,
                "technical_terms_detected": ["FastAPI", "Uvicorn"],
                "missing_concepts": [],
                "incorrect_concepts": [],
                "strengths": ["Strong FastAPI understanding"],
                "weaknesses": [],
                "recommended_next_probe": "OAuth2 with FastAPI",
                "llm_recommended_difficulty": "Hard"
            }
        elif "weak" in ans:
            return {
                "completeness_score": 0.2,
                "accuracy_score": 0.1,
                "logic_score": 0.2,
                "tone_clarity_score": 0.5,
                "time_mgmt_score": 0.5,
                "technical_terms_detected": [],
                "missing_concepts": ["FastAPI async routing"],
                "incorrect_concepts": ["FastAPI blocking calls"],
                "strengths": [],
                "weaknesses": ["Basic endpoints misunderstanding"],
                "recommended_next_probe": "FastAPI health check",
                "llm_recommended_difficulty": "Easy"
            }
        else:
            return {
                "completeness_score": 0.6,
                "accuracy_score": 0.6,
                "logic_score": 0.7,
                "tone_clarity_score": 0.8,
                "time_mgmt_score": 0.8,
                "technical_terms_detected": ["FastAPI"],
                "missing_concepts": ["FastAPI dependency injection"],
                "incorrect_concepts": [],
                "strengths": ["Basic FastAPI knowledge"],
                "weaknesses": [],
                "recommended_next_probe": "Dependency injection details",
                "llm_recommended_difficulty": "Medium"
            }

@pytest.fixture
def setup_engine():
    mock_llm = E2EMockLLMProvider()
    sm = StateManager()
    eval_service = AnswerEvaluator(llm_provider=mock_llm)
    q_gen_service = QuestionGenerator(llm_provider=mock_llm)
    real_fb_gen = FeedbackGenerator(llm_provider=mock_llm)
    
    engine = InterviewEngine(
        sm=sm,
        eval_service=eval_service,
        q_gen_service=q_gen_service,
        fb_service=real_fb_gen
    )
    return engine, sm, mock_llm

@pytest.mark.anyio
async def test_e2e_normal_interview_flow(setup_engine):
    engine, sm, mock_llm = setup_engine
    session_id = "e2e-normal-sess"
    candidate = candidate_loader.get_candidate("CAND-001")
    assert candidate is not None
    
    # 1. Start Turn: Initialize Session & generate Q1
    req_init = InterviewRequest(sessionId=session_id, candidate=candidate)
    res_init = await engine.process_turn(req_init)
    
    assert res_init.done is False
    assert "Generated question 1" in res_init.reply
    
    state = sm.get_session(session_id)
    assert state is not None
    assert state.question_count == 1
    assert state.status == "ACTIVE"
    assert len(state.answer_evaluations) == 0
    
    # 2. Walk through Q1 to Q9 (Answers simulated as medium)
    for q in range(1, 10):
        req = InterviewRequest(sessionId=session_id, message=f"Answer {q} which is medium.")
        res = await engine.process_turn(req)
        assert res.done is False
        assert state.question_count == q + 1
        assert len(state.answer_evaluations) == q

    assert state.question_count == 10
    assert len(state.answer_evaluations) == 9

    # 3. Answer Q10 (the final question)
    req_10 = InterviewRequest(sessionId=session_id, message="Answer 10 which is strong.")
    res_10 = await engine.process_turn(req_10)

    # 4. Verify completion status and done flag
    assert res_10.done is True
    assert state.status == "COMPLETED"
    assert state.question_count == 10
    assert len(state.answer_evaluations) == 10
    
    # Verify final feedback generated matches FeedbackPayload schema
    assert res_10.feedback is not None
    feedback = res_10.feedback
    assert isinstance(feedback.summary, str)
    assert len(feedback.summary) > 20
    assert len(feedback.strengths) > 0
    assert len(feedback.gaps) > 0
    assert len(feedback.next) > 0

    # Verify recommendations format "Day [actual day] — [actual curriculum topic]"
    for rec in feedback.next:
        assert " — " in rec
        parts = rec.split(" — ")
        assert len(parts) >= 2
        day_num = int(parts[0].replace("Day ", "").strip())
        curr_day = curriculum_retriever.get_day(day_num)
        assert curr_day is not None
        assert curr_day.title == parts[1]

    # 5. Post-completion check
    req_post = InterviewRequest(sessionId=session_id, message="Attempting another answer.")
    res_post = await engine.process_turn(req_post)

    assert res_post.done is True
    assert state.status == "COMPLETED"
    assert state.question_count == 10
    assert len(state.answer_evaluations) == 10
    assert res_post.feedback == feedback

@pytest.mark.anyio
async def test_e2e_adaptive_difficulty(setup_engine):
    engine, sm, mock_llm = setup_engine
    session_id = "e2e-adaptive-sess"
    candidate = candidate_loader.get_candidate("CAND-001")
    
    # Initialize
    req_init = InterviewRequest(sessionId=session_id, candidate=candidate)
    await engine.process_turn(req_init)
    state = sm.get_session(session_id)
    
    # 1. Starting difficulty is Medium
    assert state.level == "Medium"
    
    # 2. Strong answer -> should adjust difficulty to Hard
    req_strong = InterviewRequest(sessionId=session_id, message="Very strong answer with FastAPI.")
    await engine.process_turn(req_strong)
    assert state.level == "Hard"
    assert "INTERVIEW LEVEL: Hard" in mock_llm.last_prompt

    # 3. Weak answer -> should decrease difficulty to Medium
    req_weak = InterviewRequest(sessionId=session_id, message="This answer is weak.")
    await engine.process_turn(req_weak)
    assert state.level == "Medium"
    assert "INTERVIEW LEVEL: Medium" in mock_llm.last_prompt

    # 4. Another weak answer -> should decrease difficulty to Easy
    req_weak2 = InterviewRequest(sessionId=session_id, message="This answer is weak again.")
    await engine.process_turn(req_weak2)
    assert state.level == "Easy"
    assert "INTERVIEW LEVEL: Easy" in mock_llm.last_prompt

@pytest.mark.anyio
async def test_e2e_curriculum_coverage(setup_engine):
    engine, sm, mock_llm = setup_engine
    session_id = "e2e-curr-sess"
    candidate = candidate_loader.get_candidate("CAND-001")
    
    req_init = InterviewRequest(sessionId=session_id, candidate=candidate)
    await engine.process_turn(req_init)
    state = sm.get_session(session_id)
    
    # Sarah Johnson has encountered days in her candidate profile.
    encountered_days = {m.day for m in candidate.missions}
    
    # Check that the first question targets a day in encountered days
    assert state.current_curriculum_day in encountered_days
    
    # Walk through the full 10-question interview and verify curriculum days covered
    for q in range(1, 10):
        req = InterviewRequest(sessionId=session_id, message=f"Answer {q}")
        await engine.process_turn(req)
        
    req_10 = InterviewRequest(sessionId=session_id, message="Answer 10")
    await engine.process_turn(req_10)
    
    # Covered days must be a subset of candidate's encountered days
    unique_covered = set(state.covered_days)
    assert unique_covered.issubset(encountered_days)
    
    # Verify that at least 4 unique days were covered
    assert len(unique_covered) >= 4
    
    # Verify that covered_topics match actual curriculum titles
    for day_num, topic_title in zip(state.covered_days, state.covered_topics):
        curr_day = curriculum_retriever.get_day(day_num)
        assert curr_day is not None
        assert curr_day.title == topic_title

@pytest.mark.anyio
async def test_e2e_timer_expiration(setup_engine):
    engine, sm, mock_llm = setup_engine
    session_id = "e2e-timer-sess"
    candidate = candidate_loader.get_candidate("CAND-001")
    
    req_init = InterviewRequest(sessionId=session_id, candidate=candidate)
    await engine.process_turn(req_init)
    state = sm.get_session(session_id)
    
    # Simulate time elapsed > 20 minutes (1201 seconds)
    state.start_time = time.time() - 1201
    
    # Next answer attempt should trigger timer expiration
    req_attempt = InterviewRequest(sessionId=session_id, message="Attempting to answer.")
    res_attempt = await engine.process_turn(req_attempt)
    
    assert res_attempt.done is True
    assert state.status == "EXPIRED_TIME"
    assert "Time limit exceeded" in res_attempt.reply
    
    # Trying to send another answer should not allow any progression
    req_attempt2 = InterviewRequest(sessionId=session_id, message="Yet another attempt.")
    res_attempt2 = await engine.process_turn(req_attempt2)
    
    assert res_attempt2.done is True
    assert state.status == "EXPIRED_TIME"

@pytest.mark.anyio
async def test_e2e_violations(setup_engine):
    engine, sm, mock_llm = setup_engine
    session_id = "e2e-violations-sess"
    candidate = candidate_loader.get_candidate("CAND-001")
    
    req_init = InterviewRequest(sessionId=session_id, candidate=candidate)
    await engine.process_turn(req_init)
    state = sm.get_session(session_id)
    
    assert state.violations_count == 0
    assert state.question_count == 1
    
    # Violation 1
    req_v1 = InterviewRequest(sessionId=session_id, violation=True)
    res_v1 = await engine.process_turn(req_v1)
    assert state.violations_count == 1
    assert "Violation 1/3" in res_v1.reply
    assert state.question_count == 1  # Violation does not consume a question
    assert len(state.answer_evaluations) == 0
    
    # Violation 2
    req_v2 = InterviewRequest(sessionId=session_id, violation=True)
    res_v2 = await engine.process_turn(req_v2)
    assert state.violations_count == 2
    assert "Violation 2/3" in res_v2.reply
    assert state.question_count == 1  # Violation does not consume a question
    assert len(state.answer_evaluations) == 0
    
    # Violation 3 -> Fails interview
    req_v3 = InterviewRequest(sessionId=session_id, violation=True)
    res_v3 = await engine.process_turn(req_v3)
    assert state.violations_count == 3
    assert state.status == "FAILED_VIOLATION"
    assert "locked" in res_v3.reply.lower() or "maximum violations exceeded" in res_v3.reply.lower()
    assert res_v3.done is True
    assert len(state.answer_evaluations) == 0

    # A failed interview cannot continue
    req_post = InterviewRequest(sessionId=session_id, message="Let me answer.")
    res_post = await engine.process_turn(req_post)
    assert res_post.done is True
    assert state.status == "FAILED_VIOLATION"
