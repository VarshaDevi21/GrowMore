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
                    next_recommendations.append(f"Day {day.day} — {day.title} — Review objectives: {', '.join(day.objectives[:2])}.")

        overall_score = self._compute_overall_score(state)
        evaluation_dimensions = self._build_evaluation_dimensions(state, overall_score)

        # Generate summary text using LLM or structured template
        prompt = (
            f"Generate a 3-4 sentence overall evaluation summary for candidate {state.candidate_name} ({state.candidate_role}).\n"
            f"Address overall performance, key strengths, technical skill gaps, and actionable improvement areas.\n"
            f"Total questions evaluated: {len(state.answer_evaluations)}.\n"
            f"Demonstrated concepts: {', '.join(state.mentioned_terms[:5])}.\n"
            f"Identified skill gaps: {', '.join(gaps[:3])}."
        )
        system_prompt = "You are a lead technical interviewer writing a structured candidate evaluation summary."

        try:
            summary_text = await self.llm_provider.generate_completion(
                prompt=prompt,
                system_prompt=system_prompt,
                temperature=0.5
            )
        except Exception as e:
            logger.error(f"Error generating feedback summary LLM text: {e}")
            summary_text = ""

        # Use robust template if LLM fails, is too short, or returns mock interviewer dialog
        if (not summary_text 
            or len(summary_text) < 20 
            or "elaborate" in summary_text.lower() 
            or "thank you for sharing" in summary_text.lower()):
            summary_text = (
                f"Candidate {state.candidate_name} completed the technical interview for the role of {state.candidate_role}, "
                f"demonstrating solid overall performance across {len(state.covered_days)} curriculum topics. "
                f"The candidate showed clear strengths in {', '.join(state.mentioned_terms[:2]) or 'core AI concepts'}. "
                f"To improve further, they should focus on addressing identified gaps in {', '.join(gaps[:2]) or 'advanced tools'}."
            )

        return FeedbackPayload(
            summary=summary_text.strip(),
            strengths=strengths[:5],
            gaps=gaps[:5],
            next=next_recommendations[:5],
            overall_score=overall_score,
            evaluation_dimensions=evaluation_dimensions,
        )

    def _compute_overall_score(self, state: InterviewState) -> float:
        """Compute a deterministic overall score from accumulated evaluations."""
        if not state.answer_evaluations:
            return 0.0

        scores = []
        for evaluation in state.answer_evaluations:
            comp = evaluation.completeness_score
            acc = evaluation.accuracy_score
            logic = evaluation.logic_score
            tone = evaluation.tone_clarity_score
            time_mgmt = evaluation.time_mgmt_score
            scores.append((comp * 0.30) + (acc * 0.30) + (logic * 0.20) + (tone * 0.10) + (time_mgmt * 0.10))

        avg = sum(scores) / len(scores)
        penalty = max(0, len(state.skill_gaps) * 2 + len(state.weaknesses) * 1.5)
        score = round(max(0.0, min(100.0, (avg * 100) - penalty)), 1)
        return score

    def _build_evaluation_dimensions(self, state: InterviewState, overall_score: float) -> List[dict]:
        """Build a structured evaluation dimension payload for the report UI."""
        if not state.answer_evaluations:
            return []

        base = max(60.0, min(95.0, overall_score))
        return [
            {"name": "Technical Depth", "score": round(min(100.0, base + 2), 1), "description": "Depth of technical understanding and concept mastery."},
            {"name": "Reasoning & Trade-offs", "score": round(min(100.0, base + 1), 1), "description": "Ability to explain design decisions and trade-offs clearly."},
            {"name": "Curriculum Mastery", "score": round(min(100.0, base + 3), 1), "description": "Breadth of coverage across the curriculum."},
            {"name": "Communication", "score": round(min(100.0, base - 1), 1), "description": "Clarity, structure, and professional presentation of the answer."},
        ]

# Singleton instance
feedback_generator = FeedbackGenerator()
