# AI Prompt History — GrowMore

> **AI Usage Log & Prompt History for Hackathon Submission**
> Repository: [https://github.com/VarshaDevi21/GrowMore](https://github.com/VarshaDevi21/GrowMore)
> Team: VarshaDevi21

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
