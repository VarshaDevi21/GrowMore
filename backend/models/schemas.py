from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

# --- Curriculum Schemas ---

class CurriculumDay(BaseModel):
    day: int = Field(..., description="Day number from 1 to 31")
    title: str = Field(..., description="Title of the curriculum day")
    type: str = Field(..., description="Type of day e.g. SETUP, BUILD, AI_CORE, etc.")
    tools: List[str] = Field(default_factory=list, description="Tools used in this day")
    objectives: List[str] = Field(default_factory=list, description="Learning objectives")

class CurriculumModule(BaseModel):
    n: int = Field(..., description="Module number")
    title: str = Field(..., description="Module title")
    days: List[int] = Field(..., description="Start and end day numbers range")

class CurriculumData(BaseModel):
    cohort: str = Field(..., description="Cohort description string")
    modules: List[CurriculumModule]
    days: List[CurriculumDay]


# --- Candidate Schemas ---

class CandidateMember(BaseModel):
    id: str = Field(..., description="Candidate unique ID e.g. CAND-001")
    name: str = Field(..., description="Candidate full name")
    jobRole: str = Field(..., description="Candidate job role")
    yearsExperience: int = Field(..., description="Years of professional experience")
    education: str = Field(..., description="Candidate education background")
    status: str = Field(..., description="Cohort status e.g. COMPLETED")

class CandidateMission(BaseModel):
    day: int = Field(..., description="Curriculum day number of the mission")
    title: str = Field(..., description="Title of the mission")
    passed: Optional[bool] = Field(None, description="Whether mission was passed")
    attempts: Optional[int] = Field(None, description="Number of attempts")
    skipped: Optional[bool] = Field(None, description="Whether mission was skipped")

class CandidateSignals(BaseModel):
    commitDays: int = Field(..., description="Total commit days")
    missionsCompleted: int = Field(..., description="Total missions completed")
    missionsFirstTry: int = Field(..., description="Missions passed on first attempt")

class CandidatePayload(BaseModel):
    member: CandidateMember
    missions: List[CandidateMission]
    signals: CandidateSignals

class CandidatesData(BaseModel):
    candidates: List[CandidatePayload]


# --- API Request & Response Schemas ---

class InterviewRequest(BaseModel):
    sessionId: str = Field(..., description="Session identifier for interview state tracking")
    candidate: Optional[CandidatePayload] = Field(None, description="Candidate data payload on start turn")
    message: Optional[str] = Field(None, description="Candidate response text on turn 1..10")
    violation: bool = Field(False, description="Whether an interview-integrity violation was detected")

class FeedbackPayload(BaseModel):
    summary: str = Field(..., description="Overall evaluation summary text")
    strengths: List[str] = Field(default_factory=list, description="List of candidate strengths")
    gaps: List[str] = Field(default_factory=list, description="List of identified skill gaps")
    next: List[str] = Field(default_factory=list, description="Actionable curriculum recommendations")
    overall_score: Optional[float] = Field(None, description="Overall interview score from 0 to 100")
    evaluation_dimensions: List[Dict[str, Any]] = Field(default_factory=list, description="Structured evaluation dimensions")

class InterviewResponse(BaseModel):
    reply: str = Field(..., description="Interviewer question or response text")
    done: bool = Field(False, description="Whether interview is finished")
    feedback: Optional[FeedbackPayload] = Field(None, description="Final feedback payload if done=True")
    question: Optional[str] = Field(None, description="The active interview question to present to the user")
    question_number: Optional[int] = Field(None, description="The current question number for the session")
    curriculum_day: Optional[int] = Field(None, description="Curriculum day associated with the active question")
    curriculum_topic: Optional[str] = Field(None, description="Curriculum topic associated with the active question")
    difficulty: Optional[str] = Field(None, description="Current interview difficulty tier")
    evaluation: Optional[Dict[str, Any]] = Field(None, description="Per-turn evaluation payload for the latest answer")
