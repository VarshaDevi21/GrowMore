import logging
from typing import List, Optional

from state.interview_state import InterviewState, AnswerEvaluation
from models.schemas import CandidatePayload, CurriculumDay
from services.curriculum_retriever import curriculum_retriever, CurriculumRetriever
from services.llm.factory import get_llm_provider
from services.llm.base import BaseLLMProvider

logger = logging.getLogger("ai-interview-agent.question_generator")

class QuestionGenerator:
    """
    Generates adaptive, conversational technical interview questions.
    Enforces curriculum grounding, difficulty level, and repetition prevention.
    """

    def __init__(
        self,
        llm_provider: Optional[BaseLLMProvider] = None,
        retriever: Optional[CurriculumRetriever] = None
    ):
        self.llm_provider = llm_provider or get_llm_provider()
        self.retriever = retriever or curriculum_retriever

    async def generate_question(
        self,
        state: InterviewState,
        candidate: CandidatePayload,
        last_eval: Optional[AnswerEvaluation] = None
    ) -> str:
        """
        Formulates the next technical question (Questions 1 through 10).
        """
        # 1. Determine probing strategy (Deep-Dive vs New Topic)
        probe_strategy = "NEW_TOPIC"
        last_term = ""
        if last_eval and last_eval.technical_terms_detected:
            probe_strategy = "DEEP_DIVE"
            last_term = last_eval.technical_terms_detected[0]

        # 2. Determine target curriculum day for this turn
        if probe_strategy == "DEEP_DIVE" and state.current_curriculum_day is not None:
            target_day = self.retriever.get_day(state.current_curriculum_day)
        else:
            target_day = self.retriever.select_next_probing_day(
                candidate=candidate,
                covered_days=state.covered_days,
                demonstrated_gaps=state.skill_gaps
            )

        day_context = ""
        if target_day:
            day_context = self.retriever.get_day_context_summary(target_day.day)

        # 3. Construct System Prompt & User Prompt for LLM
        system_prompt = (
            "You are a Senior AI Lead conducting a technical interview for a 31-day AI Engineering Cohort.\n"
            "Ask ONE single, concise, professional technical question.\n"
            "Do NOT include greeting filler, pleasantries, or multiple sub-questions.\n"
            "Return ONLY the question text ending with a question mark."
        )

        previous_questions = [eval_obj.question_text for eval_obj in state.answer_evaluations]
        if state.current_question:
            previous_questions.append(state.current_question)

        user_prompt = f"""
CANDIDATE: {state.candidate_name} ({state.candidate_role})
INTERVIEW LEVEL: {state.level}
QUESTION NUMBER: {state.question_count + 1} of 10
PROBING STRATEGY: {probe_strategy}

TARGET CURRICULUM:
{day_context}

PREVIOUS CANDIDATE ANSWER EVALUATION:
{f"Last answer classification: {last_eval.classification}. Mentioned terms: {', '.join(last_eval.technical_terms_detected)}. Skill gaps: {', '.join(last_eval.missing_concepts)}." if last_eval else "This is Question 1 (Interview Initialization)."}

PREVIOUS QUESTIONS ASKED (DO NOT REPEAT ANY OF THESE):
{chr(10).join(f"- {q}" for q in previous_questions) if previous_questions else "None"}

REQUIREMENTS:
- Level: {state.level} (Easy = fundamental concepts; Medium = MNC-level implementation details; Hard = MAANG-level system design and production trade-offs).
- If Deep-Dive: ask specifically about candidate's mentioned term '{last_term}' and probe depth of knowledge.
- If previous answer was Partial and has skill gaps, prioritize probing those missing concepts: {', '.join(last_eval.missing_concepts) if last_eval else ""}.
- If previous answer was Weak, ask a simpler, more fundamental question to guide the candidate.
- Ground the question in the candidate's learning journey and job role ({state.candidate_role}).
- Ensure the question flows naturally from the previous turn like a real conversational interview.
- Ask ONE clear technical question.
"""

        # 4. Generate candidate question using LLM
        generated_text = await self.llm_provider.generate_completion(
            prompt=user_prompt,
            system_prompt=system_prompt,
            temperature=0.7
        )

        # 5. Backend Validation & Fallback Guard
        valid_question = self._validate_and_sanitize_question(
            generated_text=generated_text,
            previous_questions=previous_questions,
            target_day=target_day,
            level=state.level,
            last_term=last_term
        )

        logger.info(f"Generated Q{state.question_count + 1} ({state.level}): {valid_question[:80]}...")
        return valid_question

    def _validate_and_sanitize_question(
        self,
        generated_text: str,
        previous_questions: List[str],
        target_day: Optional[CurriculumDay],
        level: str,
        last_term: str = ""
    ) -> str:
        """
        Validates generated question text.
        Checks length, formatting, and prevents duplicate questions.
        Fallback to curriculum template if generated text is invalid.
        """
        text = generated_text.strip()
        
        # Clean up any surrounding quotes or markdown
        if (text.startswith('"') and text.endswith('"')) or (text.startswith("'") and text.endswith("'")):
            text = text[1:-1].strip()

        # Check basic validity
        is_valid = (
            len(text) >= 15 and
            len(text) <= 350 and
            text.endswith("?") and
            text not in previous_questions
        )

        if is_valid:
            return text

        # Fallback question generation if validation fails
        logger.warning(f"LLM question failed validation ('{text[:40]}...'). Generating deterministic fallback.")
        return self._generate_fallback_question(target_day, level, last_term)

    def _generate_fallback_question(
        self,
        target_day: Optional[CurriculumDay],
        level: str,
        last_term: str
    ) -> str:
        """Deterministic fallback question generator grounded in curriculum data."""
        if last_term:
            return f"You mentioned {last_term}. Can you explain how it works under the hood and what trade-offs you consider when implementing it?"
        
        if target_day:
            tool = target_day.tools[0] if target_day.tools else "Python"
            obj = target_day.objectives[0] if target_day.objectives else "building AI applications"
            if level == "Hard":
                return f"In Day {target_day.day} ({target_day.title}), how would you architect a production system using {tool} to achieve {obj} at scale?"
            elif level == "Medium":
                return f"Regarding Day {target_day.day} ({target_day.title}), what key challenges arise when using {tool} for {obj}?"
            else:
                return f"Can you explain the core fundamentals of {tool} and its role in {target_day.title}?"

        return "Can you describe a key technical challenge you encountered during your AI Engineering cohort and how you solved it?"

# Singleton instance
question_generator = QuestionGenerator()
