# Backend Data Models & Schemas

## 1. Curriculum Schema (`curriculum.json`)

```json
{
  "cohort": "string",
  "modules": [
    {
      "n": "integer",
      "title": "string",
      "days": ["integer (start_day)", "integer (end_day)"]
    }
  ],
  "days": [
    {
      "day": "integer",
      "title": "string",
      "type": "string (SETUP | BUILD | AI_CORE | SHIP_IT | LEARN | OPTIMIZE | CAPSTONE)",
      "tools": ["string"],
      "objectives": ["string"]
    }
  ]
}
```

## 2. Candidate Schema (`candidates.json`)

```json
{
  "member": {
    "id": "string (e.g. CAND-001)",
    "name": "string",
    "jobRole": "string",
    "yearsExperience": "integer",
    "education": "string",
    "status": "string (COMPLETED)"
  },
  "missions": [
    {
      "day": "integer",
      "title": "string",
      "passed": "boolean (optional)",
      "attempts": "integer (optional)",
      "skipped": "boolean (optional)"
    }
  ],
  "signals": {
    "commitDays": "integer",
    "missionsCompleted": "integer",
    "missionsFirstTry": "integer"
  }
}
```

## 3. Interview State Schema (`state/interview_state.py`)

```python
class AnswerEvaluation(BaseModel):
    question_number: int
    question_text: str
    candidate_answer: str
    completeness_score: float  # 0.0 - 1.0
    accuracy_score: float      # 0.0 - 1.0
    logic_score: float         # 0.0 - 1.0
    tone_clarity_score: float  # 0.0 - 1.0
    time_mgmt_score: float     # 0.0 - 1.0
    classification: str        # "Strong" | "Partial" | "Weak"
    technical_terms_detected: list[str]
    missing_concepts: list[str]
    incorrect_concepts: list[str]
    recommended_difficulty: str

class InterviewState(BaseModel):
    session_id: str
    candidate_id: str
    candidate_name: str
    candidate_role: str
    level: str = "Medium"      # "Easy" | "Medium" | "Hard"
    start_time: float          # timestamp
    duration_minutes: float = 20.0
    question_count: int = 0    # 0 to 10
    current_question: str = ""
    covered_days: list[int] = []
    covered_topics: list[str] = []
    mentioned_terms: list[str] = []
    strengths: list[str] = []
    weaknesses: list[str] = []
    skill_gaps: list[str] = []
    violations_count: int = 0
    answer_evaluations: list[AnswerEvaluation] = []
    status: str = "ACTIVE"     # "ACTIVE" | "COMPLETED" | "FAILED_VIOLATION" | "EXPIRED_TIME"
```

## 4. API Request & Response Schemas (`models/schemas.py`)

### Request Payload
```python
class CandidateMember(BaseModel):
    id: str
    name: str
    jobRole: str
    yearsExperience: int
    education: str
    status: str

class CandidateMission(BaseModel):
    day: int
    title: str
    passed: Optional[bool] = None
    attempts: Optional[int] = None
    skipped: Optional[bool] = None

class CandidateSignals(BaseModel):
    commitDays: int
    missionsCompleted: int
    missionsFirstTry: int

class CandidatePayload(BaseModel):
    member: CandidateMember
    missions: list[CandidateMission]
    signals: CandidateSignals

class InterviewRequest(BaseModel):
    sessionId: str
    candidate: Optional[CandidatePayload] = None
    message: Optional[str] = None
    violation: Optional[bool] = False  # Optional flag for third-party violation events
```

### Response Payload
```python
class FeedbackPayload(BaseModel):
    summary: str
    strengths: list[str]
    gaps: list[str]
    next: list[str]

class InterviewResponse(BaseModel):
    reply: str
    done: bool = False
    feedback: Optional[FeedbackPayload] = None
```
