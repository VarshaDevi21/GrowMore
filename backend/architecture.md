# Backend System Architecture

## 1. High-Level Architecture

```
                    React Frontend
                          │
                          │ HTTP POST /api/interview
                          ▼
                 ┌──────────────────┐
                 │     FastAPI      │
                 │   (Router/API)   │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Interview Engine │ (Deterministic Controller)
                 └────────┬─────────┘
                          │
       ┌──────────────────┼──────────────────┐
       ▼                  ▼                  ▼
┌──────────────┐   ┌─────────────┐   ┌──────────────┐
│  Interview   │   │ Evaluator   │   │ Curriculum   │
│    State     │   │  Service    │   │  Retriever   │
└──────────────┘   └──────┬──────┘   └──────┬───────┘
                          │                 │
                          └────────┬────────┘
                                   ▼
                         Question Generator
                                   │
                                   ▼
                          LLM Service Interface
                                   │
                                   ▼
                           NVIDIA Provider
                                   │
                                   ▼
                              NVIDIA API
```

## 2. Component Responsibilities

### A. API Layer (`api/interview.py`)
- Receives HTTP requests on `POST /api/interview`.
- Validates request payload using Pydantic models (`InterviewRequest`).
- Handles session lifecycle (starts new session or retrieves active session).
- Invokes `InterviewEngine` to process turn.
- Formats and returns standardized HTTP `InterviewResponse`.

### B. Interview Engine (`services/interview_engine.py`)
- Central deterministic orchestrator.
- Enforces strict business rules:
  - 10 questions hard limit (returns `done: true` on Turn 10 completion).
  - 20-minute timer check.
  - Violation counter tracking (3 violations -> hard fail).
  - Dynamic difficulty adaptation based on candidate performance.
  - Ensures minimum 4 curriculum days coverage.

### C. Curriculum Retriever (`services/curriculum_retriever.py`)
- Loads and parses `curriculum.json`.
- Maps candidate's mission history to curriculum topics, tools, and objectives.
- Identifies skill gaps and completed/skipped days.
- Provides contextually relevant curriculum details for question probers and final feedback recommendations.

### D. Evaluator Service (`services/evaluator.py`)
- Uses LLM + structured parsing to grade candidate answers.
- Evaluates 5 dimensions: Completeness, Accuracy, Logic, Tone/Grammar, Time Management.
- Extracts `technical_terms_detected`, `missing_concepts`, `incorrect_concepts`.
- Classifies response as `Strong`, `Partial`, or `Weak`.

### E. Question Generator (`services/question_generator.py`)
- Formulates probing technical questions.
- Implements adaptive deep-dive logic:
  - Probes terms explicitly mentioned in previous candidate answers.
  - Targets identified skill gaps or unverified curriculum days.
  - Adjusts question complexity based on engine's target difficulty (`Easy`, `Medium`, `Hard`).

### F. Feedback Generator (`services/feedback_generator.py`)
- Generates final comprehensive summary upon interview completion.
- Formats structured feedback matching the exact specification:
  - `summary`: High-level evaluation paragraph.
  - `strengths`: Bullet points of demonstrated skills.
  - `gaps`: Bullet points of identified missing concepts.
  - `next`: Targeted recommendations mapping back to actual curriculum days (e.g. `Day 15 — Fine-Tuning: Hands-On with LoRA & QLoRA — ...`).

### G. LLM Provider Layer (`services/llm/`)
- Abstract base class `BaseLLMProvider` defining `generate_completion` and `generate_structured_json`.
- `NvidiaLLMProvider` implementing call to NVIDIA API via standard OpenAI-compatible SDK interface using `NVIDIA_API_KEY` environment variable.
- Allows zero-code-change replacement of LLM providers in the future.

## 3. Data & Control Flow
1. **Init**: Client sends `sessionId` + `candidate`. `InterviewEngine` initializes `InterviewState`, selects starting curriculum day & topic, generates Question 1, and returns `reply` with `done: false`.
2. **Turn**: Client sends `sessionId` + `message`.
   - `InterviewEngine` checks duration and violation limits.
   - `EvaluatorService` evaluates the answer.
   - `InterviewEngine` updates state (questions count, difficulty, covered days, strengths/weaknesses).
   - If `question_count == 10` or violation count == 3 or time > 20 mins:
     - `FeedbackGenerator` constructs final report.
     - State set to completed.
     - Return `done: true` with `feedback`.
   - Else:
     - `QuestionGenerator` generates Question N+1 probing the candidate's last answer and curriculum objectives.
     - Return `done: false` with question `reply`.
