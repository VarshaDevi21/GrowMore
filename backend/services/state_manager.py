import time
from typing import Dict, Optional, Tuple, List
import logging

from state.interview_state import InterviewState, AnswerEvaluation

logger = logging.getLogger("ai-interview-agent.state_manager")

class StateManager:
    def __init__(self):
        # In-memory session store
        self._sessions: Dict[str, InterviewState] = {}

    def create_session(
        self,
        session_id: str,
        candidate_id: str,
        candidate_name: str,
        candidate_role: str,
        level: str = "Medium"
    ) -> InterviewState:
        """Initialize and store a new interview session."""
        state = InterviewState(
            session_id=session_id,
            candidate_id=candidate_id,
            candidate_name=candidate_name,
            candidate_role=candidate_role,
            level=level,
            start_time=time.time(),
            duration_minutes=20.0,
            question_count=0,
            status="ACTIVE"
        )
        self._sessions[session_id] = state
        logger.info(f"Created new session {session_id} for candidate {candidate_name} ({candidate_id}).")
        return state

    def get_session(self, session_id: str) -> Optional[InterviewState]:
        """Retrieve an active or past session by session_id."""
        return self._sessions.get(session_id)

    def check_timer_expired(self, session_id: str) -> bool:
        """Check if 20 minutes duration has elapsed. Mark status EXPIRED_TIME if expired."""
        state = self.get_session(session_id)
        if not state:
            return False
        
        elapsed_seconds = time.time() - state.start_time
        max_seconds = state.duration_minutes * 60.0
        
        if elapsed_seconds > max_seconds and state.status == "ACTIVE":
            state.status = "EXPIRED_TIME"
            logger.warning(f"Session {session_id} expired. Elapsed: {elapsed_seconds:.1f}s > {max_seconds:.1f}s.")
            return True
        return state.status == "EXPIRED_TIME"

    def record_violation(self, session_id: str) -> Tuple[InterviewState, str]:
        """
        Record an interview integrity violation.
        Violation 1 -> Warning
        Violation 2 -> Second Warning
        Violation 3 -> Failure & Lockout
        """
        state = self.get_session(session_id)
        if not state:
            raise ValueError(f"Session {session_id} not found.")

        state.violations_count += 1
        
        if state.violations_count == 1:
            warning_msg = "WARNING [Violation 1/3]: Unintended tab switch or navigation detected. Please remain in the interview window."
        elif state.violations_count == 2:
            warning_msg = "WARNING [Violation 2/3]: Second violation detected. One more violation will terminate and fail your interview."
        else:
            state.status = "FAILED_VIOLATION"
            warning_msg = "INTERVIEW FAILED [Violation 3/3]: Maximum violations exceeded. Your interview session has been locked."
            logger.error(f"Session {session_id} failed due to 3 violations.")

        return state, warning_msg

    def advance_question(self, session_id: str, new_question_text: str) -> InterviewState:
        """Increment question count and set active question. Enforces 10-question hard cap."""
        state = self.get_session(session_id)
        if not state:
            raise ValueError(f"Session {session_id} not found.")

        if state.question_count >= 10 or state.status != "ACTIVE":
            state.status = "COMPLETED"
            logger.info(f"Session {session_id} reached 10 questions hard limit.")
            return state

        state.question_count += 1
        state.current_question = new_question_text
        
        logger.info(f"Session {session_id} advanced to Question {state.question_count}/10.")
        return state

    def set_current_curriculum_context(
        self,
        session_id: str,
        day: Optional[int],
        topic: str = ""
    ) -> InterviewState:
        """Associate the active question with the curriculum day it probes."""
        state = self.get_session(session_id)
        if not state:
            raise ValueError(f"Session {session_id} not found.")

        state.current_curriculum_day = day
        state.current_curriculum_topic = topic
        return state

    def record_evaluation(
        self,
        session_id: str,
        evaluation: AnswerEvaluation,
        covered_day: Optional[int] = None,
        covered_topic: Optional[str] = None
    ) -> InterviewState:
        """Record turn evaluation and update accumulated state attributes."""
        state = self.get_session(session_id)
        if not state:
            raise ValueError(f"Session {session_id} not found.")

        state.answer_evaluations.append(evaluation)
        
        # Update technical terms mentioned
        for term in evaluation.technical_terms_detected:
            if term not in state.mentioned_terms:
                state.mentioned_terms.append(term)

        # Update covered days & topics
        if covered_day and covered_day not in state.covered_days:
            state.covered_days.append(covered_day)
        if covered_topic and covered_topic not in state.covered_topics:
            state.covered_topics.append(covered_topic)

        # Update skill gaps and incorrect concepts
        for gap in evaluation.missing_concepts:
            if gap not in state.skill_gaps:
                state.skill_gaps.append(gap)
        for err in evaluation.incorrect_concepts:
            if err not in state.weaknesses:
                state.weaknesses.append(err)

        # Update difficulty level based on recommendation
        if evaluation.recommended_difficulty in ["Easy", "Medium", "Hard"]:
            state.level = evaluation.recommended_difficulty

        # If turn 10 evaluation is completed, mark session as COMPLETED
        if state.question_count >= 10:
            state.status = "COMPLETED"

        return state

    def clear_all_sessions(self):
        """Reset state storage (used for tests)."""
        self._sessions.clear()

# Singleton instance
state_manager = StateManager()
