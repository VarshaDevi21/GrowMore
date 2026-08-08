import logging
from typing import Dict, Any, List, Optional

from state.interview_state import AnswerEvaluation
from services.llm.factory import get_llm_provider
from services.llm.base import BaseLLMProvider

logger = logging.getLogger("ai-interview-agent.evaluator")

class AnswerEvaluator:
    """
    Evaluates candidate responses during technical interview turns.
    Separates LLM technical concept interpretation from deterministic backend scoring rules.
    """

    def __init__(self, llm_provider: Optional[BaseLLMProvider] = None):
        self.llm_provider = llm_provider or get_llm_provider()

    async def evaluate_answer(
        self,
        question_number: int,
        question_text: str,
        candidate_answer: str,
        current_level: str,
        curriculum_context: str = ""
    ) -> AnswerEvaluation:
        """
        Evaluate candidate answer across 5 core dimensions and produce structured output.
        """
        system_prompt = (
            "You are an expert technical interviewer evaluating an AI Engineering candidate's answer.\n"
            "Analyze the candidate's answer objectively against the question and curriculum objectives.\n"
            "You MUST return a valid JSON object containing exact numerical scores (0.0 to 1.0) and lists."
        )

        user_prompt = f"""
QUESTION (Level: {current_level}):
{question_text}

CANDIDATE ANSWER:
{candidate_answer}

CURRICULUM CONTEXT:
{curriculum_context}

Evaluate the candidate's answer and return a JSON object with EXACTLY these keys:
- "completeness_score": (float 0.0 to 1.0) How completely does the answer address all parts of the question?
- "accuracy_score": (float 0.0 to 1.0) Is the technical content domain-accurate and correct?
- "logic_score": (float 0.0 to 1.0) Is the reasoning structured, clear, and logical?
- "tone_clarity_score": (float 0.0 to 1.0) Is the grammar, professional tone, and communication clear?
- "time_mgmt_score": (float 0.0 to 1.0) Is the response concise and efficient without fluff?
- "technical_terms_detected": [list of technical terms/concepts mentioned by candidate]
- "missing_concepts": [list of key concepts candidate failed to mention]
- "incorrect_concepts": [list of technical inaccuracies or misconceptions in answer]
- "strengths": [list of 1-2 demonstrated strengths]
- "weaknesses": [list of 1-2 areas needing improvement]
- "recommended_next_probe": "A suggested follow-up probing concept based on candidate's answer"
- "llm_recommended_difficulty": "Easy" | "Medium" | "Hard"
"""

        # 1. LLM Interpretation Step
        llm_raw = await self.llm_provider.generate_structured_json(
            prompt=user_prompt,
            system_prompt=system_prompt,
            temperature=0.2
        )

        # 2. Extract LLM Scores & Lists safely with defaults
        comp_score = float(llm_raw.get("completeness_score", 0.7))
        acc_score = float(llm_raw.get("accuracy_score", 0.7))
        logic_score = float(llm_raw.get("logic_score", 0.7))
        tone_score = float(llm_raw.get("tone_clarity_score", 0.8))
        time_score = float(llm_raw.get("time_mgmt_score", 1.0))

        # Clamp scores between 0.0 and 1.0
        comp_score = max(0.0, min(1.0, comp_score))
        acc_score = max(0.0, min(1.0, acc_score))
        logic_score = max(0.0, min(1.0, logic_score))
        tone_score = max(0.0, min(1.0, tone_score))
        time_score = max(0.0, min(1.0, time_score))

        tech_terms = llm_raw.get("technical_terms_detected", [])
        if not isinstance(tech_terms, list):
            tech_terms = []

        missing = llm_raw.get("missing_concepts", [])
        if not isinstance(missing, list):
            missing = []

        incorrect = llm_raw.get("incorrect_concepts", [])
        if not isinstance(incorrect, list):
            incorrect = []

        # 3. Deterministic Business Rules (Python Controller)
        # Weighted overall composite score calculation:
        # Completeness (30%), Technical Accuracy (30%), Structure & Logic (20%), Clarity (10%), Time Mgmt (10%)
        overall_score = (
            (comp_score * 0.30) +
            (acc_score * 0.30) +
            (logic_score * 0.20) +
            (tone_score * 0.10) +
            (time_score * 0.10)
        )

        # Deterministic Classification
        if overall_score >= 0.80:
            final_classification = "Strong"
        elif overall_score >= 0.50:
            final_classification = "Partial"
        else:
            final_classification = "Weak"

        # Deterministic Difficulty Adaptation Decision
        final_difficulty = self._compute_deterministic_difficulty(current_level, final_classification)

        logger.info(
            f"Evaluated Q{question_number} ({current_level}): Overall Score={overall_score:.2f} "
            f"-> Classification={final_classification}, Next Difficulty={final_difficulty}"
        )

        return AnswerEvaluation(
            question_number=question_number,
            question_text=question_text,
            candidate_answer=candidate_answer,
            completeness_score=comp_score,
            accuracy_score=acc_score,
            logic_score=logic_score,
            tone_clarity_score=tone_score,
            time_mgmt_score=time_score,
            classification=final_classification,
            technical_terms_detected=[str(t) for t in tech_terms],
            missing_concepts=[str(m) for m in missing],
            incorrect_concepts=[str(i) for i in incorrect],
            recommended_difficulty=final_difficulty
        )

    def _compute_deterministic_difficulty(self, current_level: str, classification: str) -> str:
        """
        Deterministic logic to adjust interview difficulty based on performance classification.
        Strong -> Increase difficulty (Easy -> Medium -> Hard)
        Partial -> Maintain difficulty
        Weak -> Decrease difficulty (Hard -> Medium -> Easy)
        """
        levels = ["Easy", "Medium", "Hard"]
        if current_level not in levels:
            current_level = "Medium"

        idx = levels.index(current_level)

        if classification == "Strong":
            new_idx = min(len(levels) - 1, idx + 1)
        elif classification == "Weak":
            new_idx = max(0, idx - 1)
        else:  # Partial
            new_idx = idx

        return levels[new_idx]

# Singleton instance
evaluator = AnswerEvaluator()
