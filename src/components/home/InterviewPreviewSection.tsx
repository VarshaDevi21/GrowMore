import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Sparkles,
  Clock,
  Gauge,
  CheckCircle2,
  Terminal,
  ShieldAlert,
  Zap,
  RefreshCw,
  Cpu,
  Flame,
  Check,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SectionHeading } from '../common/SectionHeading';

export const InterviewPreviewSection: React.FC = () => {
  const [userAnswer, setUserAnswer] = useState(
    'I would first load the knowledge base chunks from Day 6 into ChromaDB using SentenceTransformers embeddings. To maintain low latency, I would use HNSW index parameters with cosine distance. For the query, I would first check if a hybrid SQL router is needed for metadata filtering (e.g. plan type), and apply cross-encoder re-ranking on the top 20 retrieved vector matches before feeding context into the grounded LLM prompt.'
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showEvaluationResult, setShowEvaluationResult] = useState(true);

  const sampleQuestions = [
    {
      number: '04',
      total: '10',
      difficulty: 'MEDIUM',
      topic: 'Day 10 · The Retrieval & Matching Engine',
      question:
        'Tell me how you would approach designing a hybrid retrieval engine that combines structured SQL queries with vector search (ChromaDB), while ensuring low-latency response times and preventing hallucinated healthcare policy answers?',
      tags: ['ChromaDB', 'SQLAlchemy', 'Hybrid Routing', 'Grounded Prompting'],
    },
    {
      number: '07',
      total: '10',
      difficulty: 'HARD',
      topic: 'Day 22 · Multi-Agent Orchestration & MCP',
      question:
        'When orchestrating multiple specialized agents with LangGraph and Model Context Protocol (MCP), how do you prevent cascading tool failures and ensure memory state persistence across async HTTP requests?',
      tags: ['LangGraph', 'MCP Protocol', 'FastAPI', 'State Persistence'],
    },
  ];

  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const currentQ = sampleQuestions[activeQuestionIdx];

  const handleSimulateSubmit = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setShowEvaluationResult(true);
    }, 1000);
  };

  return (
    <section id="interview-preview" className="py-24 relative overflow-hidden bg-[#071426]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#16345C]/25 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Live Interface Simulation"
          badgeIcon={<Bot className="w-3.5 h-3.5" />}
          title="Adaptive Interview"
          highlightedTitle="Experience Preview"
          subtitle="Experience how the AI interviewer dynamically probes your technical answers, assesses architectural choices, and computes real-time feedback."
        />

        <div className="max-w-4xl mx-auto">
          {/* Main Interview Simulator Card */}
          <div className="relative rounded-3xl bg-[#0B1F3A]/90 backdrop-blur-2xl border border-[#C9A96E]/30 shadow-2xl shadow-[#071426] p-6 sm:p-8">
            {/* Top Navigation & Status Bar inside Interview */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
              {/* AI Interviewer status */}
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#16345C] to-[#071426] border border-[#C9A96E]/50 shadow-md">
                  <Bot className="w-6 h-6 text-[#C9A96E]" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#3A7D44] border-2 border-[#0B1F3A] rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#FFFDF7] font-['Outfit']">
                      AI INTERVIEWER
                    </span>
                    <Badge variant="gold" size="sm" pulse>
                      ACTIVE PROBING
                    </Badge>
                  </div>
                  <span className="text-[11px] font-mono text-[#8B93A1]">
                    {currentQ.topic}
                  </span>
                </div>
              </div>

              {/* Stats badges: Question, Difficulty, Timer */}
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-[#071426] border border-white/10 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#C9A96E]" />
                  <span className="text-xs font-mono font-bold text-[#FFFDF7]">
                    Question {currentQ.number} / {currentQ.total}
                  </span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-[#071426] border border-white/10 flex items-center gap-2">
                  <Gauge className="w-3.5 h-3.5 text-[#F6AD55]" />
                  <span className="text-xs font-mono font-bold text-[#F6AD55]">
                    {currentQ.difficulty}
                  </span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-[#071426] border border-white/10 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#68D391]" />
                  <span className="text-xs font-mono font-bold text-[#68D391]">
                    14:25 Left
                  </span>
                </div>
              </div>
            </div>

            {/* AI Question Bubble */}
            <div className="py-6 space-y-3">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#16345C] border border-[#C9A96E]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-[#C9A96E]" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#071426]/90 border border-white/10 text-sm sm:text-base text-[#FFFDF7] leading-relaxed font-medium">
                    "{currentQ.question}"
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-mono text-[#8B93A1]">Evaluated Topics:</span>
                    {currentQ.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-[#16345C]/60 text-[10px] font-mono text-[#C9A96E] border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Candidate Answer Box */}
            <div className="pt-2 pb-6 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-[#C9A96E] font-semibold flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" /> Your Technical Answer
                </label>
                <span className="text-[11px] font-mono text-[#8B93A1]">
                  Simulated Input · Real Evaluation
                </span>
              </div>

              <div className="relative">
                <textarea
                  rows={5}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your technical answer..."
                  className="w-full rounded-2xl bg-[#071426] border border-white/15 p-4 text-xs sm:text-sm text-[#FFFDF7] font-mono leading-relaxed focus:outline-none focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E] transition-all resize-none shadow-inner"
                />
              </div>

              {/* Submit & Question Switcher Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-[#8B93A1]">
                  <span>Switch Sample Probe:</span>
                  <button
                    onClick={() => {
                      setActiveQuestionIdx(0);
                      setUserAnswer(
                        'I would first load the knowledge base chunks from Day 6 into ChromaDB using SentenceTransformers embeddings. To maintain low latency, I would use HNSW index parameters with cosine distance. For the query, I would first check if a hybrid SQL router is needed for metadata filtering (e.g. plan type), and apply cross-encoder re-ranking on the top 20 retrieved vector matches before feeding context into the grounded LLM prompt.'
                      );
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                      activeQuestionIdx === 0
                        ? 'bg-[#C9A96E] text-[#071426] font-bold'
                        : 'bg-[#16345C] text-[#C8CDD5]'
                    }`}
                  >
                    Q4 (RAG)
                  </button>
                  <button
                    onClick={() => {
                      setActiveQuestionIdx(1);
                      setUserAnswer(
                        'With LangGraph, I define isolated state schemas with checkpointing in SQLite. MCP servers run with explicit timeout wrappers and health check signals so failed tool calls trigger a fallback LLM plan rather than crashing the multi-agent graph.'
                      );
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                      activeQuestionIdx === 1
                        ? 'bg-[#C9A96E] text-[#071426] font-bold'
                        : 'bg-[#16345C] text-[#C8CDD5]'
                    }`}
                  >
                    Q7 (Agents)
                  </button>
                </div>

                <Button
                  variant="gold"
                  size="md"
                  icon={
                    isEvaluating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )
                  }
                  onClick={handleSimulateSubmit}
                  disabled={isEvaluating}
                  className="w-full sm:w-auto"
                >
                  {isEvaluating ? 'Evaluating Depth...' : 'Submit Technical Answer'}
                </Button>
              </div>
            </div>

            {/* AI Adaptive Feedback / Probe Preview */}
            <AnimatePresence>
              {showEvaluationResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-5 border-t border-white/10"
                >
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#16345C]/50 border border-[#C9A96E]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#FFFDF7]">
                        <Cpu className="w-4 h-4 text-[#68D391]" />
                        <span>Adaptive AI Probe Feedback</span>
                      </div>
                      <Badge variant="success" size="sm">
                        Accuracy: 92% · High Depth
                      </Badge>
                    </div>

                    <p className="text-xs text-[#C8CDD5] leading-relaxed">
                      <strong className="text-[#FFFDF7]">Key Strength Detected:</strong> Strong
                      distinction between structured SQL lookup vs vector semantic similarity and
                      proactive use of cross-encoder re-ranking.
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1 border-t border-white/5 font-mono">
                      <span className="text-[#68D391] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Next Question Difficulty: SCALED UP (Hard)
                      </span>
                      <span className="text-[#C9A96E]">Day 10 & 11 Objectives Validated</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
