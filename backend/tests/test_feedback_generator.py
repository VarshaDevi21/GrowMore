import asyncio

from services.feedback_generator import FeedbackGenerator
from state.interview_state import InterviewState, AnswerEvaluation
from services.llm.base import BaseLLMProvider


class DummyFeedbackLLMProvider(BaseLLMProvider):
    async def generate_completion(self, prompt: str, system_prompt: str = None, temperature: float = 0.7) -> str:
        return "Candidate showed solid technical understanding and should continue practicing core concepts."

    async def generate_structured_json(self, prompt: str, system_prompt: str = None, temperature: float = 0.2) -> dict:
        return {}


def test_generate_feedback_includes_structured_score_and_dimensions():
    state = InterviewState(
        session_id="sess-feedback",
        candidate_id="CAND-001",
        candidate_name="Sample Candidate",
        candidate_role="AI Engineer",
        level="Medium",
        question_count=2,
        covered_days=[3, 7],
        strengths=["Shows strong reasoning"],
        weaknesses=["Needs more vector search practice"],
        skill_gaps=["Vector search"],
        answer_evaluations=[
            AnswerEvaluation(
                question_number=1,
                question_text="What is a vector embedding?",
                candidate_answer="A vector embedding is a dense representation of meaning.",
                completeness_score=0.8,
                accuracy_score=0.9,
                logic_score=0.7,
                tone_clarity_score=0.8,
                time_mgmt_score=0.9,
                classification="Strong",
                technical_terms_detected=["embedding"],
                missing_concepts=[],
                incorrect_concepts=[],
                recommended_difficulty="Medium",
            ),
            AnswerEvaluation(
                question_number=2,
                question_text="How does ChromaDB search?",
                candidate_answer="It uses similarity search over stored vectors.",
                completeness_score=0.7,
                accuracy_score=0.8,
                logic_score=0.8,
                tone_clarity_score=0.85,
                time_mgmt_score=0.9,
                classification="Partial",
                technical_terms_detected=["ChromaDB"],
                missing_concepts=["vector search"],
                incorrect_concepts=[],
                recommended_difficulty="Medium",
            ),
        ],
    )

    generator = FeedbackGenerator(llm_provider=DummyFeedbackLLMProvider())
    result = asyncio.run(generator.generate_feedback(state))

    assert result.summary
    assert result.overall_score is not None
    assert result.overall_score >= 0
    assert result.overall_score <= 100
    assert len(result.evaluation_dimensions) == 4
    assert result.evaluation_dimensions[0]["name"] == "Technical Depth"
