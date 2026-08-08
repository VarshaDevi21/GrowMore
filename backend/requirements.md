# Backend Requirements & Technical Constraints

## 1. Project Overview
The AI Interview Agent backend powers an adaptive technical interview that evaluates candidates based on their actual learning journey in a 31-day AI Engineering Cohort. The backend is built in Python with FastAPI, Pydantic, Uvicorn, and NVIDIA API (via LLM service abstraction layer).

## 2. Source Data Files
- **Curriculum Dataset**: `backend/data/curriculum.json` — 31 days divided across 8 modules. Includes title, type, tools, and learning objectives for each day.
- **Candidate Dataset**: `backend/data/candidates.json` — List of candidates (`CAND-001` through `CAND-020`) containing profile metadata (`member`), detailed mission logs (`missions`), and activity signals (`signals`).

## 3. HTTP API Requirements
- **Endpoint**: `POST /api/interview`
- **Authentication**: None required.
- **Session State Persistence**: In-memory state tracking using `sessionId`.

### Request Variants:
1. **Interview Initialization (Start)**:
   ```json
   {
     "sessionId": "abc-123",
     "candidate": { ... }
   }
   ```
   **Response**:
   ```json
   {
     "reply": "Welcome. Let's begin your interview.",
     "done": false
   }
   ```

2. **Conversation Turn (Turn 1 to 10)**:
   ```json
   {
     "sessionId": "abc-123",
     "message": "Candidate's response..."
   }
   ```
   **Response (Active)**:
   ```json
   {
     "reply": "Follow-up question or evaluation probe",
     "done": false
   }
   ```

3. **Interview Termination (Completion / Violation Lockout / Timeout)**:
   ```json
   {
     "reply": "Interview completed.",
     "done": true,
     "feedback": {
       "summary": "Concise high-level performance assessment.",
       "strengths": ["Demonstrated mastery in Vector DBs", "..."],
       "gaps": ["Difficulty with LoRA fine-tuning concept", "..."],
       "next": [
         "Day 15 — Fine-Tuning: Hands-On with LoRA & QLoRA — Review parameter-efficient fine-tuning techniques.",
         "..."
       ]
     }
   }
   ```

## 4. Hard Constraints (Enforced Deterministically in Code)
1. **Exactly 10 Questions**: The backend must track `question_count`. After 10 questions, `done: true` must be returned with final structured feedback. Question 11 must NEVER be generated.
2. **Maximum Duration (20 Minutes)**: The backend records `start_time`. If dynamic elapsed time > 20 minutes (or 1200 seconds), the interview terminates automatically on the current request.
3. **Curriculum Coverage (Min 4 Days)**: The interview engine must select and probe topics across at least 4 distinct curriculum days from the candidate's actual mission history.
4. **Violation Warnings & Hard Lockout**:
   - Violation 1 -> Warning appended to reply.
   - Violation 2 -> Final warning appended to reply.
   - Violation 3 -> Immediate interview failure (`done: true`), JEE-exam-style lockout environment.
5. **Deterministic Control**: The LLM generates wording and performs concept extraction, but the backend Python controller makes all state, difficulty, question progression, and lock decisions.

## 5. Answer Evaluation & Probing Mechanics
- Every candidate answer is evaluated across 5 dimensions:
  1. Content & Answer Completeness
  2. Technical & Domain Accuracy
  3. Structure & Logic
  4. Grammar, Tone & Clarity
  5. Time Management & Efficiency
- Structured evaluation produces:
  - `classification`: `Strong` | `Partial` | `Weak`
  - `technical_terms_detected`: List of technical concepts extracted.
  - `missing_concepts`: Key concepts missed in the answer.
  - `incorrect_concepts`: Misconceptions identified.
  - `recommended_difficulty`: `Easy` | `Medium` | `Hard`.

## 6. Unresolved Issues & Assumptions
- **Assumption 1**: Session state is held in-memory (`dict[str, InterviewState]`). For server restart resilience, in-memory state will be reset.
- **Assumption 2**: If no explicit candidate object is sent on initialization, `CAND-001` or a default candidate schema is initialized.
