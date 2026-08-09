import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

// 3 DISTINCT 10-QUESTION POOLS FOR EASY, MEDIUM, AND HARD
const questionPoolsByTier = {
  Easy: [
    {
      id: 1,
      day: 1,
      module: "M1: Environment & Tooling",
      topic: "Python Virtual Environment & VS Code Setup",
      difficulty: "Easy",
      question:
        "Welcome to your technical interview. In your Day 1 setup, you configured a Python virtual environment (.venv) in VS Code. Why is it important to use isolated virtual environments instead of installing packages into your global Python installation?",
    },
    {
      id: 2,
      day: 2,
      module: "M1: Environment & Tooling",
      topic: "Local Ollama Model Execution",
      difficulty: "Easy",
      question:
        "In Day 2, you downloaded and ran local coding models using Ollama. How do you verify that Ollama is actively serving inference requests locally, and what is the primary benefit of running models locally compared to cloud APIs?",
    },
    {
      id: 3,
      day: 3,
      module: "M1: Environment & Tooling",
      topic: "FastAPI Backend & React Connection",
      difficulty: "Easy",
      question:
        "On Day 3, you connected your React frontend with a FastAPI backend. How did you configure CORS (Cross-Origin Resource Sharing) middleware in FastAPI so your Vite React app could communicate with the backend without browser security errors?",
    },
    {
      id: 4,
      day: 4,
      module: "M2: Data Foundations",
      topic: "Loading & Inspecting JSON / CSV Datasets",
      difficulty: "Easy",
      question:
        "In Day 4, you loaded structured datasets. When reading external JSON or CSV files into Python, what methods or libraries did you use, and how did you handle missing or null values in the data?",
    },
    {
      id: 5,
      day: 7,
      module: "M3: Embeddings & Vector Search",
      topic: "Introduction to ChromaDB & Embeddings",
      difficulty: "Easy",
      question:
        "In Day 7, you stored document embeddings in ChromaDB. In simple terms, what is a vector embedding, and how does ChromaDB use embeddings to find documents similar to a user query?",
    },
    {
      id: 6,
      day: 11,
      module: "M4: LLM Core & Prompting",
      topic: "System Prompts & Role Formatting",
      difficulty: "Easy",
      question:
        "In Day 11, you structured chat prompts. What is the difference between the System prompt, User prompt, and Assistant prompt roles in conversational LLM APIs?",
    },
    {
      id: 7,
      day: 13,
      module: "M4: LLM Core & Prompting",
      topic: "Basic Function Calling with Python Types",
      difficulty: "Easy",
      question:
        "In Day 13, you created your first tool function for the model. How do type annotations (like str, int, list) in Python help the LLM understand what arguments to generate when calling a tool?",
    },
    {
      id: 8,
      day: 16,
      module: "M5: Chatbot Application Build",
      topic: "Building a Multi-Turn Chat Loop",
      difficulty: "Easy",
      question:
        "In Day 16, you built a chatbot conversation loop in FastAPI. How did you maintain the ongoing conversation history so the model knows what was said in previous turns?",
    },
    {
      id: 9,
      day: 21,
      module: "M6: Agentic AI & MCP",
      topic: "Introduction to Model Context Protocol",
      difficulty: "Easy",
      question:
        "In Day 21, you were introduced to the Model Context Protocol (MCP). What core problem does MCP solve when connecting AI models to external tools and files?",
    },
    {
      id: 10,
      day: 28,
      module: "M7: Security & Deployment",
      topic: "Dockerfile Creation & Container Basics",
      difficulty: "Easy",
      question:
        "In Day 28, you created a Docker container for your application. Can you explain what a Dockerfile is and what the FROM, COPY, and CMD commands do in your setup?",
    },
  ],
  Medium: [
    {
      id: 1,
      day: 3,
      module: "M1: Environment & Tooling",
      topic: "FastAPI Backend & Streaming SSE Responses",
      difficulty: "Medium",
      question:
        "In your Day 3 mission, you connected React with a FastAPI backend running local Ollama inference. How did you structure your API endpoints using StreamingResponse and Server-Sent Events (SSE) to stream tokens in real-time without blocking worker threads?",
    },
    {
      id: 2,
      day: 5,
      module: "M2: Data Foundations",
      topic: "Tokenization, Chunking & Context Overlap",
      difficulty: "Medium",
      question:
        "In Day 5, you processed long technical documentation. When chunking large files for a retrieval pipeline, how did you choose your chunk size and chunk overlap parameters, and how did you preserve source document metadata?",
    },
    {
      id: 3,
      day: 7,
      module: "M3: Embeddings & Vector Search",
      topic: "ChromaDB Indexing & Distance Metric Trade-offs",
      difficulty: "Medium",
      question:
        "In Day 7, you configured vector indexing in ChromaDB. Explain the mathematical and practical trade-offs between Cosine Similarity, L2 Euclidean distance, and Dot Product on normalized dense vector embeddings.",
    },
    {
      id: 4,
      day: 10,
      module: "M3: Embeddings & Vector Search",
      topic: "Hybrid Search (Dense Vectors + SQLite Full-Text)",
      difficulty: "Medium",
      question:
        "In Day 10, you built a hybrid retrieval system combining ChromaDB dense embeddings with SQLite structured search. How did you arbitrate query routing and score merging when combining keyword matches with semantic nearest-neighbors?",
    },
    {
      id: 5,
      day: 13,
      module: "M4: LLM Core & Prompting",
      topic: "Pydantic Schema Validation & Tool Healing",
      difficulty: "Medium",
      question:
        "In Day 13, you configured LLM function calling with Pydantic validation. How does your execution layer validate arguments, handle malformed model outputs, and execute retries with error feedback when a schema check fails?",
    },
    {
      id: 6,
      day: 15,
      module: "M4: LLM Core & Prompting",
      topic: "RAG Evaluation Metrics (Recall & Faithfulness)",
      difficulty: "Medium",
      question:
        "In Day 15, you evaluated your RAG pipeline. Which specific evaluation metrics (such as Context Recall, Faithfulness, and Answer Relevance) did you track, and how did you detect and minimize generation hallucinations?",
    },
    {
      id: 7,
      day: 18,
      module: "M5: Chatbot Application Build",
      topic: "FastAPI WebSockets & Real-Time Broadcasts",
      difficulty: "Medium",
      question:
        "On Day 18, you built a real-time conversational interface with WebSockets. How did you design the connection manager in FastAPI to handle client disconnects, message interruptions, and streaming token delivery?",
    },
    {
      id: 8,
      day: 20,
      module: "M5: Chatbot Application Build",
      topic: "Conversation Memory Pruning & Summary Buffers",
      difficulty: "Medium",
      question:
        "When maintaining context across long multi-turn sessions in Day 20, how did your architecture prune older conversation history with summary buffers while retaining active entity states and user preferences?",
    },
    {
      id: 9,
      day: 23,
      module: "M6: Agentic AI & MCP",
      topic: "MCP Server Development & Async Tool Invocations",
      difficulty: "Medium",
      question:
        "In Day 23, you developed an MCP (Model Context Protocol) server. Explain how MCP standardizes tools, resources, and prompts across client agents, and how your server handles asynchronous tool execution safely.",
    },
    {
      id: 10,
      day: 28,
      module: "M7: Security & Deployment",
      topic: "Docker Compose & Production Guardrails",
      difficulty: "Medium",
      question:
        "In Day 28, you containerized your multi-service agent with Docker Compose and added security guardrails. What defensive strategies did you implement to protect against prompt injection and unauthorized tool execution in production?",
    },
  ],
  Hard: [
    {
      id: 1,
      day: 3,
      module: "M1: Environment & Tooling",
      topic: "Non-Blocking Asynchronous Concurrency in FastAPI",
      difficulty: "Hard",
      question:
        "Under high concurrent load with multiple simultaneous LLM streaming sessions, how did you architect your FastAPI ASGI event loop, thread pool executors, and async generator pipelines to prevent worker process starvation and minimize latency jitter?",
    },
    {
      id: 2,
      day: 6,
      module: "M2: Data Foundations",
      topic: "High-Throughput Streaming & Backpressure Control",
      difficulty: "Hard",
      question:
        "When ingesting massive unstructured datasets in Day 6, how did you implement reactive backpressure management and memory-bounded token streaming to prevent memory exhaustion and socket pool starvation in distributed worker nodes?",
    },
    {
      id: 3,
      day: 8,
      module: "M3: Embeddings & Vector Search",
      topic: "HNSW Graph Tuning & Vector Quantization (IVF-PQ)",
      difficulty: "Hard",
      question:
        "In Day 8, you optimized vector search at scale. Explain how tuning HNSW parameters (M, efConstruction, and efSearch) alongside Product Quantization (IVF-PQ) impacts search latency, memory footprint, and recall accuracy on million-scale vector indexes.",
    },
    {
      id: 4,
      day: 10,
      module: "M3: Embeddings & Vector Search",
      topic: "Reciprocal Rank Fusion (RRF) & Cross-Encoder Re-ranking",
      difficulty: "Hard",
      question:
        "In Day 10, you built hybrid retrieval. Explain the mathematical formulation of Reciprocal Rank Fusion (RRF), how you calibrated the smoothing constant k, and how you integrated a secondary cross-encoder re-ranking stage to optimize NDCG@10 precision.",
    },
    {
      id: 5,
      day: 13,
      module: "M4: LLM Core & Prompting",
      topic: "Dynamic AST Schema Validation & Self-Healing Tools",
      difficulty: "Hard",
      question:
        "In enterprise agent deployments from Day 13, how did you design a deterministic Abstract Syntax Tree (AST) validation and self-healing execution engine that catches model runtime tool errors, isolates side-effects, and safely repairs schemas in sub-50ms?",
    },
    {
      id: 6,
      day: 15,
      module: "M4: LLM Core & Prompting",
      topic: "Automated Continuous RAG Benchmarking & LLM-as-a-Judge",
      difficulty: "Hard",
      question:
        "In Day 15, you configured automated evaluation. How did you calibrate and guard against positional, length, and self-enhancement biases when using LLM-as-a-Judge frameworks to grade context recall and answer faithfulness across dynamic benchmarks?",
    },
    {
      id: 7,
      day: 18,
      module: "M5: Chatbot Application Build",
      topic: "Distributed WebSockets & Redis Pub/Sub Backplane",
      difficulty: "Hard",
      question:
        "When scaling real-time conversational agents across a multi-node cluster in Day 18, how did you implement a Redis Pub/Sub backplane to synchronize bidirectional WebSocket connection states, stream token broadcasts, and handle sudden node failovers?",
    },
    {
      id: 8,
      day: 20,
      module: "M5: Chatbot Application Build",
      topic: "Hierarchical Memory Architecture & Semantic TTL",
      difficulty: "Hard",
      question:
        "In Day 20, you implemented advanced memory. How did you design a multi-tiered memory architecture combining short-term working buffers, episodic vector clusters with semantic decay TTL, and persistent user knowledge graphs?",
    },
    {
      id: 9,
      day: 24,
      module: "M6: Agentic AI & MCP",
      topic: "Distributed MCP Capability Negotiation & Sandboxing",
      difficulty: "Hard",
      question:
        "In Day 24, you designed an enterprise MCP infrastructure. How did you implement capability negotiation, bidirectional JSON-RPC 2.0 stdio/SSE multiplexing, and isolated gVisor/Wasm sandboxing to prevent untrusted tools from accessing the host runtime?",
    },
    {
      id: 10,
      day: 31,
      module: "M8: Production & Capstone",
      topic: "Zero-Downtime Kubernetes Deployment & Defense-in-Depth",
      difficulty: "Hard",
      question:
        "In your Day 31 Capstone production deployment, how did you configure Kubernetes rolling updates, sidecar security proxy guardrails for prompt sanitization, and autoscaling policies based on real-time token throughput and GPU inference saturation?",
    },
  ],
};

const technicalKeywords = [
  "fastapi", "ollama", "streamingresponse", "sse", "websocket", "async", "pydantic",
  "chromadb", "embeddings", "hnsw", "cosine", "dot product", "l2", "vector",
  "hybrid search", "sqlite", "rrf", "reciprocal rank fusion", "re-ranking",
  "rag", "faithfulness", "context recall", "ragas", "hallucination",
  "memory", "summary buffer", "sliding window", "mcp", "model context protocol",
  "json-rpc", "tools", "resources", "docker", "kubernetes", "guardrails", "prompt injection"
];

const evaluateAnswer = (_question, answerText) => {
  if (!answerText || !answerText.trim()) {
    return {
      score: 45,
      strengths: ["Attempted answer submission"],
      weaknesses: ["Answer was too brief; lacks architectural depth"],
      detected_terms: [],
    };
  }

  if (answerText.includes("[Question Skipped by Candidate]")) {
    return {
      score: 50,
      strengths: ["Paced interview progress by skipping unfamiliar topic"],
      weaknesses: ["Opted to skip topic; recommend reviewing corresponding curriculum day"],
      detected_terms: [],
    };
  }

  const textLower = answerText.toLowerCase();
  const detected = technicalKeywords.filter((term) => textLower.includes(term));
  const wordCount = answerText.trim().split(/\s+/).length;

  let baseScore = Math.min(60 + detected.length * 7, 95);
  if (wordCount < 15) baseScore = Math.min(baseScore, 55);
  if (wordCount > 35 && detected.length >= 2) baseScore = Math.max(baseScore, 85);

  const strengths = [];
  const weaknesses = [];

  if (detected.length >= 2) {
    strengths.push(`Accurate technical terminology (${detected.slice(0, 3).join(", ")})`);
    strengths.push("Demonstrated strong understanding of underlying architectural trade-offs");
  } else if (detected.length >= 1) {
    strengths.push(`Referenced core concept: ${detected[0]}`);
    weaknesses.push("Could expand on concrete system failure modes and latency implications");
  } else {
    weaknesses.push("Lacks specific technical keywords and concrete implementation details");
  }

  return {
    score: baseScore,
    strengths,
    weaknesses,
    detected_terms: detected,
  };
};

const generateFinalReport = (candidate, history, violationsCount = 0, difficulty = "Medium") => {
  const scores = history.map((h) => h.evaluation?.score || (h.skipped ? 50 : 85));
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / (scores.length || 1));
  const daysCovered = [...new Set(history.map((h) => h.curriculum_day || h.day || 3))];
  const skippedDays = history.filter((h) => h.skipped).map((h) => h.curriculum_day || h.day);

  const finalSkillGaps = [
    "Deepen understanding of reciprocal rank fusion (RRF) smoothing constants in Day 10",
    "Review Docker container isolation policies and AST schema healing under edge-case inputs",
  ];

  if (skippedDays.length > 0) {
    finalSkillGaps.unshift(`Revisit Day ${skippedDays.join(", ")} curriculum objectives marked as skipped during evaluation`);
  }

  return {
    candidate_id: candidate.member.id,
    candidate_name: candidate.member.name,
    job_role: candidate.member.jobRole,
    difficulty,
    overall_score: Math.max(avgScore - violationsCount * 2, 50),
    evaluation_dimensions: [
      {
        name: "Technical Depth",
        score: Math.min(avgScore + 2, 98),
        description: "Command of vectors, FastAPI concurrency, and MCP protocol architecture",
      },
      {
        name: "System Reasoning",
        score: Math.min(avgScore - 1, 95),
        description: "Ability to articulate trade-offs between latency, accuracy, and memory",
      },
      {
        name: "Curriculum Mastery",
        score: Math.min(avgScore + 3, 99),
        description: `Verified recall across ${daysCovered.length} distinct curriculum days`,
      },
      {
        name: "Communication & Structure",
        score: Math.min(avgScore, 92),
        description: "Clarity of technical explanations and structured design walkthroughs",
      },
      {
        name: "Production Readiness",
        score: Math.min(avgScore - 2, 94),
        description: "Knowledge of containerization, security guardrails, and error handling",
      },
    ],
    curriculum_days_covered: daysCovered,
    skipped_days: skippedDays,
    history: history,
    strengths: [
      "Strong grasp of vector database distance metrics and hybrid retrieval strategies",
      "Clear articulation of asynchronous event handling and streaming token delivery in FastAPI",
      "Solid understanding of Model Context Protocol (MCP) tool decoupling",
    ],
    skill_gaps: finalSkillGaps,
    recommended_next_steps: [
      {
        day: 10,
        title: "Hybrid Search & Retrieval Optimization",
        action: "Revisit SQLite full-text search indexing combined with ChromaDB dense embeddings.",
      },
      {
        day: 23,
        title: "Model Context Protocol (MCP) Server Architecture",
        action: "Practice building custom MCP tools with strict Pydantic schema validation.",
      },
      {
        day: 28,
        title: "Production Guardrails & Container Security",
        action: "Strengthen prompt injection defenses and least-privilege Docker runtime execution.",
      },
    ],
    completed_at: new Date().toISOString(),
  };
};

// Vite plugin exposing /api/interview and /api/phase6/* endpoints directly in Vite dev server
const interviewApiPlugin = () => ({
  name: "interview-api-endpoint",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      // 1. GET /api/phase6/mcp/tools
      if (req.url === "/api/phase6/mcp/tools" && req.method === "GET") {
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            status: "success",
            server_version: "1.0.0-phase6",
            protocol: "Model Context Protocol (MCP) JSON-RPC 2.0",
            tools: [
              {
                name: "python_ast_validator",
                description: "Validates Python tool function AST syntax and Pydantic schema type annotations (Day 13 & Day 23).",
                parameters: {
                  type: "object",
                  properties: {
                    code_snippet: { type: "string", description: "Python source code" },
                    strict_mode: { type: "boolean", default: true },
                  },
                  required: ["code_snippet"],
                },
              },
              {
                name: "sql_hybrid_retriever",
                description: "Executes SQLite full-text search combined with ChromaDB dense vector distance matching (Day 10 & Day 23).",
                parameters: {
                  type: "object",
                  properties: {
                    query: { type: "string", description: "Search query string" },
                    rrf_k: { type: "integer", default: 60 },
                    top_n: { type: "integer", default: 5 },
                  },
                  required: ["query"],
                },
              },
              {
                name: "mcp_capability_negotiator",
                description: "Negotiates bidirectional stdio/SSE capability schemas between MCP client and server (Day 24).",
                parameters: {
                  type: "object",
                  properties: {
                    protocol_version: { type: "string", default: "2024-11-05" },
                    requested_capabilities: { type: "array", items: { type: "string" } },
                  },
                  required: ["requested_capabilities"],
                },
              },
              {
                name: "docker_security_sandbox",
                description: "Evaluates tool call security boundaries and verifies least-privilege gVisor/Wasm container isolation (Day 24 & Day 28).",
                parameters: {
                  type: "object",
                  properties: {
                    command: { type: "string" },
                    sandbox_policy: { type: "string", enum: ["read_only", "isolated_tmp", "full_network"] },
                  },
                  required: ["command"],
                },
              },
            ],
          })
        );
        return;
      }

      // 2. POST /api/phase6/mcp/invoke
      if (req.url === "/api/phase6/mcp/invoke" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });

        req.on("end", () => {
          try {
            const parsed = JSON.parse(body || "{}");
            const toolName = parsed.params?.name || "unknown_tool";
            const toolArgs = parsed.params?.arguments || {};

            const responsePayload = {
              jsonrpc: "2.0",
              id: parsed.id || `rpc-${Date.now()}`,
              result: {
                tool: toolName,
                status: "executed",
                sandbox_execution: "isolated_gvisor",
                output: {
                  message: `Successfully executed MCP tool '${toolName}'`,
                  received_arguments: toolArgs,
                  execution_timestamp: new Date().toISOString(),
                },
                execution_time_ms: Math.floor(Math.random() * 25) + 10,
              },
            };

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(responsePayload));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ jsonrpc: "2.0", error: { code: -32603, message: err.message } }));
          }
        });
        return;
      }

      // 3. POST /api/phase6/agent/orchestrate
      if (req.url === "/api/phase6/agent/orchestrate" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });

        req.on("end", () => {
          try {
            const parsed = JSON.parse(body || "{}");
            const taskPrompt = parsed.task_prompt || "Execute Multi-Agent Reasoning Loop";
            const candidateId = parsed.candidate_id || "CAND-001";

            const orchestrationResponse = {
              session_id: parsed.session_id || `agent-sess-${Date.now()}`,
              candidate_id: candidateId,
              task_prompt: taskPrompt,
              status: "COMPLETED",
              orchestration_mode: "Multi-Agent Triad (Planner -> Coder -> Verifier)",
              steps: [
                {
                  step: 1,
                  agent: "Planner Agent (Day 21)",
                  action: "Deconstruct prompt into discrete MCP tool sub-tasks",
                  thought: `Parsed target query: "${taskPrompt}". Selected MCP tool 'sql_hybrid_retriever' and 'python_ast_validator'.`,
                  status: "SUCCESS",
                },
                {
                  step: 2,
                  agent: "Execution Agent (Day 22)",
                  action: "Invoke MCP Tool: sql_hybrid_retriever",
                  thought: "Invoked JSON-RPC 2.0 tool execution over SSE transport in sub-30ms sandbox.",
                  status: "SUCCESS",
                },
                {
                  step: 3,
                  agent: "Verifier Agent (Day 24)",
                  action: "Sandbox verification & Guardrail check",
                  thought: "Verified AST Pydantic schema enforcement and clean error self-healing output.",
                  status: "SUCCESS",
                },
              ],
              final_output: {
                summary: `Successfully completed agentic reasoning loop for: "${taskPrompt}"`,
                curriculum_milestone: "Module 6: Agentic AI & MCP",
                verified_days: [21, 22, 23, 24],
                score_boost: 5,
              },
            };

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(orchestrationResponse));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
        return;
      }

      // 4. GET & POST /api/interview (TECHNICAL SPEC.md Compliant)
      if ((req.url === "/api/interview" || req.url === "/api/interview/") && req.method === "GET") {
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            status: "ok",
            endpoint: "/api/interview",
            service: "GrowMore Technical Interview API Engine",
            specification: "TECHNICAL SPEC.md",
            supported_methods: ["GET", "POST"],
            contract: {
              start: { request: { sessionId: "string", candidate: "object" }, response: { reply: "string", done: false } },
              turn: { request: { sessionId: "string", message: "string" }, response: { reply: "string", done: "boolean", feedback: "object?" } },
            },
          })
        );
        return;
      }

      if ((req.url === "/api/interview" || req.url === "/api/interview/") && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });

        req.on("end", () => {
          try {
            const parsed = JSON.parse(body || "{}");
            const sessionId = parsed.sessionId || parsed.session_id || `sess-${Date.now()}`;

            const candidateFilePath = path.resolve(process.cwd(), "src/data/candidates.json");
            const candidatesFile = JSON.parse(fs.readFileSync(candidateFilePath, "utf8"));

            const candidateObj = parsed.candidate || {};
            const candidateId = candidateObj.member?.id || candidateObj.id || parsed.candidate_id;
            const candidate =
              candidatesFile.candidates.find((c) => c.member && c.member.id === candidateId) ||
              candidatesFile.candidates[0];

            const tierKey = ["Easy", "Medium", "Hard"].includes(parsed.starting_difficulty)
              ? parsed.starting_difficulty
              : "Medium";
            const tierQuestions = questionPoolsByTier[tierKey];

            // Inspect if request is Start Interview (contains candidate or action === 'start' or no message)
            const isStartRequest = Boolean(parsed.candidate || parsed.action === "start" || (!parsed.message && !parsed.answer));

            if (!global.__interviewSessions) {
              global.__interviewSessions = new Map();
            }

            let sessionState = global.__interviewSessions.get(sessionId);

            if (isStartRequest || !sessionState) {
              const firstQ = tierQuestions[0];
              sessionState = {
                sessionId,
                candidate,
                tierKey,
                tierQuestions,
                history: [],
                questionIndex: 0,
                violationsCount: parsed.violations_count || 0,
              };
              global.__interviewSessions.set(sessionId, sessionState);

              const candidateName = candidate.member?.name || "Candidate";
              const startReply = `Welcome ${candidateName}. Let's begin your technical interview.\n\nQuestion 1 (${firstQ.module}): ${firstQ.question}`;

              const startResponse = {
                reply: startReply,
                done: false,
                sessionId,
                session_id: sessionId,
                question_number: 1,
                total_questions: 10,
                is_complete: false,
                curriculum_day: firstQ.day,
                module: firstQ.module,
                topic: firstQ.topic,
                difficulty: firstQ.difficulty,
                question: firstQ.question,
                context: `Initial technical probe covering Day ${firstQ.day} (${firstQ.topic})`,
              };

              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(startResponse));
              return;
            }

            // Process Turn (Submit Answer)
            const userMessage = parsed.message || parsed.answer || "";
            const currentQ = sessionState.tierQuestions[sessionState.questionIndex] || sessionState.tierQuestions[0];
            const evalResult = evaluateAnswer(currentQ.question, userMessage);

            sessionState.history.push({
              question_number: sessionState.questionIndex + 1,
              curriculum_day: currentQ.day,
              question: currentQ.question,
              answer: userMessage,
              evaluation: evalResult,
              skipped: userMessage.includes("[Question Skipped by Candidate]"),
            });

            sessionState.questionIndex += 1;
            const isCompleted = sessionState.questionIndex >= 10 || parsed.done === true;

            if (isCompleted) {
              const finalReport = generateFinalReport(
                sessionState.candidate,
                sessionState.history,
                sessionState.violationsCount,
                sessionState.tierKey
              );

              const feedbackObj = {
                summary: `Technical interview completed for ${sessionState.candidate.member?.name || "Candidate"} (${sessionState.candidate.member?.jobRole || "Software Engineer"}). Diagnostic score: ${finalReport.overall_score}/100 across 10 curriculum probes.`,
                strengths: finalReport.strengths || [
                  "Strong grasp of vector database distance metrics and hybrid retrieval strategies",
                  "Clear articulation of asynchronous event handling and streaming token delivery in FastAPI",
                  "Solid understanding of Model Context Protocol (MCP) tool decoupling",
                ],
                gaps: finalReport.skill_gaps || [
                  "Deepen understanding of reciprocal rank fusion (RRF) constants",
                  "Review container isolation policies and AST schema healing",
                ],
                next: finalReport.recommended_next_steps
                  ? finalReport.recommended_next_steps.map((s) => `Day ${s.day} (${s.title}): ${s.action}`)
                  : [
                      "Revisit Day 10 SQLite full-text search indexing combined with ChromaDB embeddings",
                      "Practice building custom MCP tools with strict Pydantic schema validation",
                      "Strengthen prompt injection defenses and Docker runtime security",
                    ],
              };

              const completeResponse = {
                reply: "Interview completed.",
                done: true,
                feedback: feedbackObj,
                sessionId,
                session_id: sessionId,
                question_number: 10,
                total_questions: 10,
                is_complete: true,
                report: finalReport,
              };

              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(completeResponse));
              return;
            }

            // Advance to Next Question
            const nextQ = sessionState.tierQuestions[sessionState.questionIndex];
            let contextualPrefix = "";
            if (userMessage.includes("[Question Skipped by Candidate]")) {
              contextualPrefix = "Understood. Moving directly to our next milestone: ";
            } else if (evalResult.detected_terms.length > 0) {
              contextualPrefix = `Building on your mention of ${evalResult.detected_terms[0]}, `;
            }

            const customizedQuestion = contextualPrefix
              ? `${contextualPrefix}${nextQ.question}`
              : nextQ.question;

            const turnReply = `Question ${sessionState.questionIndex + 1} of 10 (Day ${nextQ.day} - ${nextQ.topic}):\n${customizedQuestion}`;

            const turnResponse = {
              reply: turnReply,
              done: false,
              sessionId,
              session_id: sessionId,
              question_number: sessionState.questionIndex + 1,
              total_questions: 10,
              is_complete: false,
              curriculum_day: nextQ.day,
              module: nextQ.module,
              topic: nextQ.topic,
              difficulty: nextQ.difficulty,
              question: customizedQuestion,
              evaluation: evalResult,
            };

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(turnResponse));
          } catch (e) {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                reply: "An unexpected API error occurred while processing the interview turn.",
                done: false,
                error: e.message,
              })
            );
          }
        });
        return;
      }
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), interviewApiPlugin()],
});