import logging
from typing import Optional, List

from state.interview_state import InterviewState
from models.schemas import FeedbackPayload
from services.curriculum_retriever import curriculum_retriever
from services.llm.factory import get_llm_provider
from services.llm.base import BaseLLMProvider

logger = logging.getLogger("ai-interview-agent.feedback_generator")

class FeedbackGenerator:
    """
    Generates structured final feedback upon interview completion.
    Grounds all recommendations in actual curriculum content.
    """

    def __init__(self, llm_provider: Optional[BaseLLMProvider] = None):
        self.llm_provider = llm_provider or get_llm_provider()
        self.retriever = curriculum_retriever

    async def generate_feedback(self, state: InterviewState) -> FeedbackPayload:
        """
        Produce concise, actionable feedback matching the TECHNICAL SPEC schema.
        """
        # Collect accumulated strengths, gaps, and weaknesses
        strengths = list(dict.fromkeys(state.strengths))
        if not strengths and state.mentioned_terms:
            strengths = [f"Demonstrated technical familiarity with {', '.join(state.mentioned_terms[:3])}."]

        gaps = list(dict.fromkeys(state.skill_gaps + state.weaknesses))

        # Generate actionable curriculum recommendations for gaps
        next_recommendations: List[str] = []
        if gaps:
            for gap in gaps[:4]:
                rec = self.retriever.map_gap_to_recommendation(gap)
                next_recommendations.append(rec)
        else:
            # Fallback if no specific gaps detected
            for day_num in [7, 11, 22, 28]:
                day = self.retriever.get_day(day_num)
                if day:
                    next_recommendations.append(f"Day {day.day} — {day.title} — Practice advanced objectives.")

        # Generate summary text using LLM or structured template
        prompt = (
            f"Generate a 2-3 sentence overall evaluation summary for candidate {state.candidate_name} ({state.candidate_role}).\n"
            f"Total questions evaluated: {len(state.answer_evaluations)}.\n"
            f"Demonstrated concepts: {', '.join(state.mentioned_terms[:5])}.\n"
            f"Identified skill gaps: {', '.join(gaps[:3])}."
        )
        system_prompt = "You are a lead technical interviewer writing a concise candidate evaluation summary."

        try:
            summary_text = await self.llm_provider.generate_completion(
                prompt=prompt,
                system_prompt=system_prompt,
                temperature=0.5
            )
        except Exception as e:
            logger.error(f"Error generating feedback summary LLM text: {e}")
            summary_text = (
                f"{state.candidate_name} completed the technical interview covering {len(state.covered_days)} curriculum topics. "
                f"Demonstrated strong fundamentals in {', '.join(state.mentioned_terms[:2]) or 'AI Core'} with areas for growth in {', '.join(gaps[:2]) or 'advanced tools'}."
            )

        if not summary_text or len(summary_text) < 20:
            summary_text = (
                f"{state.candidate_name} completed the technical interview. "
                f"Showed proficiency in {', '.join(state.mentioned_terms[:2]) or 'core AI concepts'}."
            )

        return FeedbackPayload(
            summary=summary_text.strip(),
            strengths=strengths[:5],
            gaps=gaps[:5],
            next=next_recommendations[:5]
        )

# Singleton instance
feedback_generator = FeedbackGenerator()
