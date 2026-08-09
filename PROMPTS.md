# AI Prompt History — GrowMore

> **AI Usage Log & Prompt History for Hackathon Submission**
> Repository: [https://github.com/VarshaDevi21/GrowMore](https://github.com/VarshaDevi21/GrowMore)
> Team: GrowMore

---

## Initial Master Prompt

```text
# AI INTERVIEW AGENT — FRONTEND DEVELOPMENT

Build the frontend for my hackathon project:
AI Interview Agent for a 31-Day AI Engineering Cohort

Tech stack:
* React
* Vite
* JavaScript
* React Router
* CSS/Tailwind
* Framer Motion

Design theme: Navy Blue + Cream (#FAF7F0 background, #071426 primary navy buttons, #C9A96E gold accents)

SOURCE OF TRUTH:
The project already contains:
- TECHNICAL SPEC.md
- src/data/candidates.json
- src/data/curriculum.json

Before implementing anything, inspect these files. They are the source of truth.
Do NOT invent candidate IDs, candidate information, curriculum days, or API fields.

MAIN USER FLOW:
Landing Page → Login / Candidate Selection → Dashboard → 31-Day Roadmap → Interview Setup → Live Adaptive Interview (10 Questions) → Final Report → Track & Improve

LOGIN BOUNDARY:
BEFORE LOGIN: Public navbar (Home, How It Works, FAQ, Get Started). Do NOT show Dashboard, Roadmap, Interview, or Profile before login.
AFTER LOGIN: Unlock protected routes (/dashboard, /roadmap, /interview-setup, /interview, /report, /track-improve, /profile). Store candidateId in localStorage.
```

---

## Phase 1 — Landing Page & Public Navigation

```text
Build Phase 1: Set up the public landing page with a Cream background (#FAF7F0) and Navy Blue buttons. Build the public Navbar containing ONLY Logo, Home, How It Works, FAQ, and Get Started. Include Hero section with 'Get Started' and 'Start Interview' CTA buttons pointing to /login, How It Works section, FAQ accordion, and Footer. Do NOT show dashboard or candidate info yet.
```

---

## Phase 2 — Login & Candidate Selection

```text
Build Phase 2: Create the /login page for candidate selection. Display all 20 real candidates from src/data/candidates.json using their actual JSON fields (member name, ID, job role, YOE, education). Add a search input and candidate card grid. When a candidate card is selected, store candidateId in localStorage under 'selectedCandidateId' and navigate to /dashboard. Create helper getCandidateById(id) in src/data/candidate.js.
```

---

## Phase 3 — Protected Routes & Candidate Dashboard

```text
Build Phase 3: Create ProtectedRoute.jsx to protect candidate routes (/dashboard, /roadmap, /interview-setup, /interview, /report, /track-improve, /profile). Redirect to /login if not logged in. Build authenticated Navbar with Logo, Dashboard, 31-Day Roadmap, Interview, Track & Improve, Profile, and Logout. Build Dashboard.jsx to display the selected candidate's real data (name, ID, job role, YOE, education, learning progress, missions, signals).
```

---

## Phase 4 — Candy Crush-Inspired 31-Day Roadmap

```text
Build Phase 4: Create Roadmap.jsx using src/data/curriculum.json and candidate mission data. Display Days 1 to 31. Design a Candy Crush-inspired learning path with curved connectors, level nodes, avatar character, completed nodes (green), active nodes (navy/cream), skipped nodes (yellow), and incomplete nodes (red).
```

---

## Phase 5 — Adaptive Technical Interview Sandbox UI & Anti-Cheat

```text
Build Phase 5: Create InterviewSetup.jsx and Interview.jsx. In InterviewSetup, let candidate choose starting difficulty (Easy, Medium, Hard) for a 10-question, 20-minute sandbox. In Interview.jsx, build a dedicated interview environment that hides the navbar. Display AI Interviewer Avatar with dynamic states (asking, listening, thinking, speaking), question counter (Question 01/10), timer countdown (19:42), difficulty badge, question panel, answer text box, and Done button. Enforce 3-strike focus loss proctoring warnings and screen blur overlay.
```

---

## Phase 6 — API Service Layer & MCP Integration

```text
Build Phase 6: Connect the frontend to the backend API contract from TECHNICAL SPEC.md. Create src/services/interviewApi.js supporting POST /api/interview for session start and turn submissions ({ sessionId, message }). Create src/services/agenticApi.js for Model Context Protocol (MCP) tool server interaction (python_ast_validator, sql_hybrid_retriever, mcp_capability_negotiator, docker_security_sandbox). Include resilient local fallback engines for offline execution.
```

---

## Phase 7 — Final Evaluation Report & Study Recommendations

```text
Build Phase 7: Create Report.jsx to present actual interview results after Question 10. Display overall score out of 100, 5 evaluation dimensions (Technical Depth, System Reasoning, Curriculum Mastery, Communication, Production Readiness), demonstrated strengths, areas for growth, real turn-by-turn question logs, and grounded study recommendations mapped directly to curriculum.json day numbers and topics.
```

---

## Phase 8 — Track & Improve Telemetry, History & Polish

```text
Build Phase 8: Finish evaluation history tracking, skill improvement, profile customization, loading states, error states, and UI polish. Create historyService.js to persist candidate interview sessions in localStorage. Upgrade TrackImprove.jsx with score filters, 8-module mastery meters, persistent actionable study checklist, and clear history modal. Upgrade Profile.jsx with editable candidate profile details (Job Role, YOE, Education) and persistent sandbox preferences. Add Toast.jsx for alerts, SkeletonLoader.jsx for loading states, full ARIA accessibility tags, and rename phase6Api to agenticApi.
```


A1 INTERVIEW AGENT - BACKEND PROMOPT

## Phase 1 — Track & Improve Telemetry, History & Polish


Implement the complete backend project foundation.

Set up the required backend structure, configuration, environment handling, FastAPI application, application startup, dependencies, and basic health/API foundation.

Use the existing repository structure as the source of truth.

Do not invent unnecessary architecture or dependencies.

Test that the backend starts correctly and that the foundation works.

Then STOP.

## PHASE 2 — DATA MODELS

After approval:

Implement the required Pydantic/data models.

The models must cover:

* Curriculum
* CurriculumDay
* Candidate
* CandidateMember
* InterviewRequest
* InterviewState
* AnswerEvaluation

Implement strict validation for required fields and invalid payloads.

Load and validate the supplied 31-day curriculum and candidate dataset.

Test:

* Curriculum loading
* Candidate loading
* Interview state validation
* Invalid schema rejection
* Interview request parsing

Then STOP.
## PHASE 3 — INTERVIEW STATE

After approval:

Implement:

`state/interview_state.py`

and:

`services/state_manager.py`

The state manager must support:

* session creation
* session retrieval
* question count
* interview status
* difficulty level
* start time
* duration
* violations
* answer evaluations
* covered curriculum days
* covered topics
* mentioned technical terms
* skill gaps

Implement:

* question advancement
* evaluation recording
* timer expiration
* violation handling
* interview completion
* Question 10 hard limit

Interview statuses must support:

* ACTIVE
* COMPLETED
* EXPIRED_TIME
* FAILED_VIOLATION

Test:

* session creation/retrieval
* Question 1 → Question 10
* Question 11 must remain impossible
* timer expiration
* violation threshold
* evaluation recording

Then STOP.
## PHASE 4 — CURRICULUM RETRIEVER

After approval:

Implement:

`services/curriculum_retriever.py`

The retriever must understand the candidate's actual curriculum/mission history.

Implement:

* candidate encountered curriculum days
* completed days
* skipped days
* failed days
* next probing day
* uncovered curriculum days
* skill-gap → curriculum recommendation mapping
* invalid/fictional day protection

The curriculum contains exactly:

Day 1 → Day 31

Never generate or select fictional days such as Day 32 or Day 35.

Candidate-specific curriculum selection must be based strictly on the candidate's supplied mission history.

Test:

* candidate encountered curriculum
* next probing day
* skill-gap recommendation
* invalid/fictional day rejection

Then STOP.

## PHASE 5 — LLM PROVIDER

After approval:

Implement the LLM provider abstraction.

Implement:

* `BaseLLMProvider`
* provider factory
* `NvidiaLLMProvider`

The provider must support:

* normal text completion
* structured JSON generation
* safe JSON parsing
* Markdown code-fence JSON parsing

The implementation must use the configured NVIDIA API credentials from environment/configuration.

Do not hardcode API keys.

Test:

* provider instantiation
* normal completion
* structured JSON generation
* JSON-safe parser

Then STOP.

## PHASE 6 — ANSWER EVALUATOR

After approval:

Implement:

`evaluator.py`

The evaluator must produce structured results for:

* completeness
* technical accuracy
* structure/logic
* grammar/tone/clarity
* time management/efficiency
* overall score
* strong/partial/weak classification
* missing concepts
* incorrect concepts
* detected technical terms
* strengths
* weaknesses
* recommended probe
* recommended difficulty

Separate:

**LLM interpretation**

from:

**deterministic business rules**

The LLM should interpret the candidate answer and extract concepts/scores.

The Python backend must calculate deterministic scoring, classification, and difficulty rules.

Implement and test:

* Strong answer
* Partial answer
* Weak answer
* deterministic scoring math
* difficulty transitions

Then STOP.

## PHASE 7 — QUESTION GENERATOR

After approval:

Implement:

`question_generator.py`

It must generate conversational questions using:

* current candidate context
* previous answer
* detected technical terms
* strengths
* weaknesses
* skill gaps
* curriculum context
* current difficulty
* previous questions

Avoid:

* repeated questions
* unrelated topics
* fixed question lists
* random curriculum jumps

Implement logic for:

* follow-up deep dive
* new topic
* difficulty increase
* difficulty decrease
* curriculum coverage

The backend must ensure the generated question is valid before returning it.

If the LLM produces an invalid or repeated question, use backend validation and a safe fallback.

Then STOP.


## PHASE 8 — INTERVIEW ENGINE

After approval:

Implement:

`interview_engine.py`

This becomes the central interview orchestrator.

The flow must be:

Request
↓
Load session
↓
Validate interview state
↓
Check time limit
↓
Check violation status
↓
Evaluate previous answer
↓
Extract concepts
↓
Update strengths/gaps
↓
Update curriculum coverage
↓
Determine difficulty
↓
Retrieve curriculum context
↓
Generate next question
↓
Increment question count
↓
Return response

Hard constraints must be enforced by Python.

The LLM cannot bypass:

* interview time limit
* violation limit
* Question 10 maximum
* interview completion status
* invalid interview state
* invalid question output

Test:

Question 1
→ Question 2
→ Question 3
→ ...
→ Question 10
→ COMPLETED

Verify that:

**Question 11 is impossible.**

Test the complete orchestration flow and ensure all previous Phase 2–7 tests continue to pass.

Then STOP.

PHASE 8.6 — ANSWER EVALUATOR INTEGRATION

WORKING DIRECTORY:
D:\GrowMore\backend

Inspect the existing evaluator and InterviewEngine.

Do not create a second evaluator.

Connect the existing evaluator to the interview lifecycle.

Required flow:

Candidate Answer
↓
InterviewEngine
↓
Evaluator
↓
AnswerEvaluation
↓
StateManager.record_evaluation()
↓
InterviewState updated

Evaluate every actual candidate answer.

The evaluator must produce:

- completeness_score
- accuracy_score
- logic_score
- tone_clarity_score
- time_mgmt_score
- classification
- technical_terms_detected
- missing_concepts
- incorrect_concepts
- recommended_difficulty

The evaluation must also update interview state:

- mentioned_terms
- strengths
- weaknesses
- skill_gaps
- difficulty
- answer_evaluations

Do not expose internal evaluation scores during the interview.

Do NOT implement advanced adaptive questioning yet.

Use mocks/fakes for LLM-dependent behavior during tests.

Test:

1. Strong answer.
2. Partial answer.
3. Weak answer.
4. Answer containing technical terms.
5. Missing concepts.
6. Incorrect concepts.
7. Difficulty recommendation.
8. Evaluation stored exactly once.
9. Initial interview request is not evaluated.
10. Violation-only request is not evaluated.
11. Post-completion answer is not evaluated.

Ensure one submitted answer results in exactly one evaluation.

Run tests.

Fix failures.

STOP.


PHASE 8.8 — CANDIDATE-SPECIFIC CURRICULUM COVERAGE

WORKING DIRECTORY:
D:\GrowMore\backend

Inspect:

- CURRICULAM.json
- candidate data
- candidate_loader.py
- curriculum_retriever.py
- question_generator.py
- interview_engine.py
- interview_state.py

Do not invent curriculum information.

The supplied curriculum and candidate files are the ONLY source of truth.

Requirement:

A completed interview should cover at least 4 UNIQUE curriculum days.

However:

Do NOT artificially add days to covered_days.

A day counts only when an actual interview question targets a topic from that day.

Questions must be based on topics the candidate actually encountered.

Candidate signals/missions should determine relevant learning history according to the existing source data.

Rules:

1. Use actual curriculum day numbers.
2. Use actual curriculum titles/topics.
3. Do not invent day numbers.
4. Do not randomly select unrelated curriculum days.
5. Do not duplicate the same day as new coverage.
6. Track covered_days deterministically.
7. Track covered_topics.
8. Prefer relevant uncovered topics when coverage is below 4.
9. Preserve candidate-specific questioning.

If candidate data genuinely prevents four relevant days from being covered, do not fabricate coverage. Report that constraint instead.

Test:

1. First day tracked.
2. Duplicate day does not increase count.
3. Second unique day tracked.
4. Third unique day tracked.
5. Fourth unique day tracked.
6. Irrelevant day is not selected.
7. Actual question context maps to the recorded day.
8. Final state accurately represents curriculum coverage.

Run tests.

Fix failures.

STOP.

## PHASE 9 — API ENDPOINT

After Phase 8 is approved:

Implement the FastAPI API endpoint.

Implement:

POST /api/interview

The endpoint must connect the API layer to:

InterviewRequest
↓
InterviewEngine
↓
InterviewResponse

Validate all incoming request payloads.

Validate all outgoing response structures.

Handle backend exceptions safely.

Never expose:

- NVIDIA_API_KEY
- environment variables
- internal tracebacks
- internal configuration
- sensitive implementation details

The API must support:

- interview initialization
- candidate answers
- violations
- interview completion
- validation errors
- internal server errors

Add API tests covering:

- health check
- session initiation
- interview turns
- violations
- completion
- invalid payloads
- internal errors

Run the full backend test suite.

Fix all failures.

Then STOP.


## PHASE 10 — FINAL FEEDBACK

After Phase 9 is approved, implement/fix:

services/feedback_generator.py

Use the existing Phase 8 architecture.

After Question 10:

Q10 answer
↓
Q10 evaluation
↓
Complete interview analysis
↓
Final feedback
↓
COMPLETED

The response must follow the exact API structure:

{
  "summary": "...",
  "strengths": [],
  "gaps": [],
  "next": []
}

Verify:

- Q10 is included in analysis.
- Exactly 10 evaluations exist.
- Final feedback is generated only after Q10.
- No Q11 is generated.
- Completed interviews cannot continue.

The "next" recommendations MUST map to actual curriculum data.

Use real:

- curriculum day numbers
- curriculum topics
- curriculum objectives

from CURRICULAM.json.

Do not invent recommendations.

After completing Phase 10:

Run relevant tests.
Fix errors.
Show files changed and test results.

STOP.

## PHASE 11 — FULL BACKEND INTEGRATION TEST

After Phase 10 is approved, test the complete backend.

Test the complete lifecycle:

START
↓
Q1
↓
Q2
↓
Q3
↓
Q4
↓
Q5
↓
Q6
↓
Q7
↓
Q8
↓
Q9
↓
Q10
↓
Final Report
↓
COMPLETED

Verify:

QUESTION LIMIT

- exactly 10 questions
- Question 11 can never be generated
- exactly 10 evaluations
- Q10 is evaluated

CURRICULUM

- minimum 4 relevant curriculum days when candidate data permits
- only actual curriculum days
- only actual curriculum topics
- no unrelated curriculum topics
- no invented curriculum data

ADAPTIVE INTERVIEW

- previous answers influence later questions
- technical terms can trigger follow-ups
- strong answers can increase difficulty
- weak answers can decrease difficulty
- incomplete answers can trigger targeted probing
- no fixed question list
- no unnecessary repeated questions

TIME

- maximum 20 minutes
- expired interviews cannot continue

VIOLATIONS

- violation 1 → warning
- violation 2 → warning
- violation 3 → interview failure
- violations do not consume questions
- failed interviews cannot continue

FINAL REPORT

- generated after Q10
- correct FeedbackPayload structure
- strengths
- gaps
- actionable next steps
- curriculum-linked recommendations

Run:

- unit tests
- integration tests
- API tests
- full backend test suite

If failures occur:

Investigate → Fix → Retest

Do not hide failures.

Do not claim Phase 11 is complete if tests are failing.

After testing:

STOP.