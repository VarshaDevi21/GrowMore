import logging
from typing import Dict, Optional

from models.schemas import InterviewRequest, InterviewResponse, FeedbackPayload, CandidatePayload
from services.state_manager import state_manager, StateManager
from services.candidate_loader import candidate_loader
from services.curriculum_retriever import curriculum_retriever
from services.evaluator import evaluator, AnswerEvaluator
from services.question_generator import question_generator, QuestionGenerator
from services.feedback_generator import feedback_generator, FeedbackGenerator

logger = logging.getLogger("ai-interview-agent.interview_engine")

class InterviewEngine:
    """
    Central Orchestrator for the AI Interview Agent.
    Enforces deterministic business rules (10-question hard cap, 20-min timer, 3-violation lockout)
    while leveraging LLMs for answer evaluation and adaptive question formulation.
    """

    def __init__(
        self,
        sm: Optional[StateManager] = None,
        eval_service: Optional[AnswerEvaluator] = None,
        q_gen_service: Optional[QuestionGenerator] = None,
        fb_service: Optional[FeedbackGenerator] = None
    ):
        self.sm = sm or state_manager
        self.evaluator = eval_service or evaluator
        self.q_generator = q_gen_service or question_generator
        self.feedback_gen = fb_service or feedback_generator
        self.candidate_loader = candidate_loader
        self.retriever = curriculum_retriever
        # A supplied candidate may not exist in candidates.json. Retain it for
        # the life of this in-memory session instead of falling back to None.
        self._session_candidates: Dict[str, CandidatePayload] = {}

    async def process_turn(self, request: InterviewRequest) -> InterviewResponse:
        """
        Process an incoming turn request for POST /api/interview.
        """
        session_id = request.sessionId
        session = self.sm.get_session(session_id)

        # --- FLOW 1: INITIALIZE / REINITIALIZE INTERVIEW SESSION ---
        if not session or request.candidate is not None:
            # Load candidate payload from request or fallback dataset
            candidate_data = request.candidate
            if not candidate_data:
                cand_id = "CAND-001"
                candidate_data = self.candidate_loader.get_candidate(cand_id)

            cand_member = candidate_data.member if candidate_data else None
            cand_name = cand_member.name if cand_member else "Candidate"
            cand_id = cand_member.id if cand_member else "CAND-001"
            cand_role = cand_member.jobRole if cand_member else "AI Engineer"

            # Create new state in StateManager
            session = self.sm.create_session(
                session_id=session_id,
                candidate_id=cand_id,
                candidate_name=cand_name,
                candidate_role=cand_role,
                level="Medium"
            )
            self._session_candidates[session_id] = candidate_data

            q1_text = await self._generate_and_advance(session, candidate_data)
            if not q1_text:
                feedback = await self.feedback_gen.generate_feedback(session)
                return InterviewResponse(reply="Interview completed.", done=True, feedback=feedback)

            logger.info(f"Initialized new session {session_id} for {cand_name}. Question 1 generated.")
            return InterviewResponse(
                reply=f"Welcome. Let's begin your interview.\n\n{q1_text}",
                done=False
            )

        # Retrieve candidate object for active session
        candidate_obj = self._session_candidates.get(session_id)
        if not candidate_obj:
            candidate_obj = self.candidate_loader.get_candidate(session.candidate_id)

        if not candidate_obj:
            # An active state without a candidate cannot safely be evaluated or
            # used to generate a curriculum-grounded question.
            session.status = "COMPLETED"
            feedback = await self.feedback_gen.generate_feedback(session)
            return InterviewResponse(reply="Interview completed.", done=True, feedback=feedback)

        # --- FLOW 2: CHECK SESSION STATUS & HARD TERMINAL CONSTRAINTS ---
        if session.status in ["COMPLETED", "FAILED_VIOLATION", "EXPIRED_TIME"]:
            feedback = await self.feedback_gen.generate_feedback(session)
            return InterviewResponse(
                reply="Interview completed.",
                done=True,
                feedback=feedback
            )

        # A corrupted count must never result in Question 11 or later.
        if session.question_count > 10:
            session.status = "COMPLETED"
            feedback = await self.feedback_gen.generate_feedback(session)
            return InterviewResponse(reply="Interview completed.", done=True, feedback=feedback)

        # --- FLOW 3: TIMER EXPIRATION CHECK (20 Mins Max) ---
        if self.sm.check_timer_expired(session_id):
            logger.warning(f"Session {session_id} duration limit exceeded 20 minutes.")
            feedback = await self.feedback_gen.generate_feedback(session)
            return InterviewResponse(
                reply="Interview completed (Time limit exceeded).",
                done=True,
                feedback=feedback
            )

        # --- FLOW 4: VIOLATION CHECK (3 Violations Max) ---
        violation_warning = ""
        # Check if request has violation flag or message signals violation
        if request.violation:
            session, violation_warning = self.sm.record_violation(session_id)
            if session.status == "FAILED_VIOLATION":
                feedback = await self.feedback_gen.generate_feedback(session)
                return InterviewResponse(
                    reply=violation_warning,
                    done=True,
                    feedback=feedback
                )

        # Do not consume a question for a notification-only request. This is
        # also the recovery response for an empty answer submitted by a client.
        if not (request.message and request.message.strip()):
            reply = session.current_question or "Please provide your answer to continue."
            if violation_warning:
                reply = f"{violation_warning}\n\n{reply}"
            return InterviewResponse(reply=reply, done=False)

        # --- FLOW 5: EVALUATE CANDIDATE ANSWER ---
        if not session.current_question:
            session.status = "COMPLETED"
            feedback = await self.feedback_gen.generate_feedback(session)
            return InterviewResponse(reply="Interview completed.", done=True, feedback=feedback)

        current_day_num = session.current_curriculum_day
        current_topic = session.current_curriculum_topic
        day_context_str = self.retriever.get_day_context_summary(current_day_num) if current_day_num else "General AI Engineering principles"

        last_eval = await self.evaluator.evaluate_answer(
            question_number=session.question_count,
            question_text=session.current_question,
            candidate_answer=request.message.strip(),
            current_level=session.level,
            curriculum_context=day_context_str
        )

        # The state manager owns evaluated terms, gaps, weaknesses, coverage,
        # and difficulty. The engine adds evidence-backed strengths.
        session = self.sm.record_evaluation(
            session_id=session_id,
            evaluation=last_eval,
            covered_day=current_day_num,
            covered_topic=current_topic
        )
        self._record_strengths(session, last_eval)

        # --- FLOW 6: HARD CONSTRAINT CHECK — 10 QUESTIONS MAX ---
        if session.question_count >= 10:
            session.status = "COMPLETED"
            feedback = await self.feedback_gen.generate_feedback(session)
            logger.info(f"Session {session_id} completed after Question 10 evaluation.")
            return InterviewResponse(
                reply="Interview completed.",
                done=True,
                feedback=feedback
            )

        # --- FLOW 7: GENERATE NEXT QUESTION (Question N+1) ---
        next_q_text = await self._generate_and_advance(session, candidate_obj, last_eval)
        if not next_q_text:
            session.status = "COMPLETED"
            feedback = await self.feedback_gen.generate_feedback(session)
            return InterviewResponse(reply="Interview completed.", done=True, feedback=feedback)

        reply_content = next_q_text
        if violation_warning:
            reply_content = f"{violation_warning}\n\n{next_q_text}"

        return InterviewResponse(
            reply=reply_content,
            done=False
        )

    async def _generate_and_advance(
        self,
        session,
        candidate: CandidatePayload,
        last_eval=None
    ) -> Optional[str]:
        """Choose the next curriculum target, generate one question, then advance once."""
        if session.question_count >= 10 or session.status != "ACTIVE":
            return None

        probe_strategy = "NEW_TOPIC"
        if last_eval and last_eval.technical_terms_detected:
            probe_strategy = "DEEP_DIVE"

        if probe_strategy == "DEEP_DIVE" and session.current_curriculum_day is not None:
            target_day = self.retriever.get_day(session.current_curriculum_day)
        else:
            target_day = self.retriever.select_next_probing_day(
                candidate=candidate,
                covered_days=session.covered_days,
                demonstrated_gaps=session.skill_gaps,
            )
        target_day_num = target_day.day if target_day else None
        target_topic = target_day.title if target_day else ""

        question = await self.q_generator.generate_question(
            state=session,
            candidate=candidate,
            last_eval=last_eval,
        )
        self.sm.set_current_curriculum_context(session.session_id, target_day_num, target_topic)
        advanced = self.sm.advance_question(session.session_id, question)
        return advanced.current_question if advanced.question_count <= 10 and advanced.status == "ACTIVE" else None

    @staticmethod
    def _record_strengths(session, evaluation) -> None:
        """Capture only concrete, strong-answer evidence for final feedback."""
        if evaluation.classification != "Strong":
            return

        terms = evaluation.technical_terms_detected[:2]
        strength = (
            f"Demonstrated strong understanding of {', '.join(terms)}."
            if terms else "Delivered a strong, technically sound response."
        )
        if strength not in session.strengths:
            session.strengths.append(strength)

# Singleton instance
interview_engine = InterviewEngine()
