import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getSelectedCandidateId, getCandidateById } from '../data/candidate';

export const Report = () => {
  const candidateId = getSelectedCandidateId();
  const candidate = getCandidateById(candidateId);

  // Read structured report saved by POST /api/interview
  const reportData = useMemo(() => {
    try {
      const stored = localStorage.getItem('last_interview_report');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return null;
  }, []);

  if (!candidate) return null;

  const candidateName = reportData?.candidate_name || candidate.member.name;
  const overallScore = reportData?.overall_score || reportData?.report?.overall_score || 0;
  const daysCovered = reportData?.curriculum_days_covered || reportData?.report?.curriculum_days_covered || [];
  const historyTurns = reportData?.history || reportData?.report?.history || [];

  const dimensions = (reportData?.evaluation_dimensions || reportData?.report?.evaluation_dimensions || []).length > 0
    ? (reportData?.evaluation_dimensions || reportData?.report?.evaluation_dimensions || [])
    : [];

  const feedbackSummary = reportData?.feedback?.summary || reportData?.report?.feedback?.summary || reportData?.report?.summary;

  const strengths = reportData?.feedback?.strengths || reportData?.strengths || reportData?.report?.feedback?.strengths || reportData?.report?.strengths || [];

  const skillGaps = reportData?.feedback?.gaps || reportData?.skill_gaps || reportData?.report?.feedback?.gaps || reportData?.report?.skill_gaps || [];

  const rawNext = reportData?.feedback?.next || reportData?.recommended_next_steps || reportData?.report?.feedback?.next || reportData?.report?.recommended_next_steps;
  const studyRecommendations = Array.isArray(rawNext)
    ? rawNext.map((item, idx) => {
        if (typeof item === 'string') {
          return { day: (daysCovered[0] || 10) + idx * 3, title: 'Curriculum Recommendation', action: item };
        }
        return item;
      })
    : [];

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#050E1A] flex flex-col selection:bg-[#C9A96E] selection:text-[#071426]">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E2D9C8] text-xs font-mono text-[#050E1A] mb-3 font-bold shadow-sm">
            <Award className="w-3.5 h-3.5 text-[#C9A96E]" /> AI Interview Evaluation Scorecard
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#050E1A] font-['Outfit']">
            Diagnostic Evaluation Report
          </h1>
          <p className="text-xs sm:text-sm text-[#1E293B] max-w-md mx-auto font-medium mt-1">
            Candidate: {candidateName} ({candidate.member.id}) · {candidate.member.jobRole}
          </p>
        </div>

        {/* Overall Score & Telemetry Banner */}
        <div className="card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase bg-[#2E7D32]/10 text-[#2E7D32] px-2.5 py-1 rounded-md font-bold">
                Evaluation Complete
              </span>
              <span className="text-xs font-mono text-[#475569]">
                10 Questions · {daysCovered.length} Curriculum Days Tested
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#050E1A] font-['Outfit']">
              Demonstrated Technical Mastery
            </h2>

            <p className="text-xs sm:text-sm text-[#1E293B] font-medium max-w-lg leading-relaxed">
              Based on your responses across all 10 adaptive questions, the AI interviewer calibrated your proficiency across core engineering dimensions.
            </p>
          </div>

          {/* Big Score Box */}
          <div className="w-28 h-28 rounded-3xl bg-[#071426] text-[#FFFDF7] flex flex-col items-center justify-center shadow-xl shrink-0 border-2 border-[#C9A96E]/40">
            <span className="text-4xl font-black font-mono">{overallScore}</span>
            <span className="text-[10px] font-mono uppercase text-[#C9A96E] font-bold">/ 100 Overall</span>
          </div>
        </div>

        {/* Curriculum Days Tested Pill Bar */}
        <div className="card-surface rounded-3xl p-5 sm:p-6 shadow-sm border-2 border-[#E2D9C8] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-bold text-[#050E1A] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#071426]" /> Curriculum Days Evaluated ({daysCovered.length} Days)
            </span>
            <span className="text-xs font-mono font-bold text-[#2E7D32]">
              Grounded in candidates.json
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {daysCovered.map((dayNum) => (
              <span
                key={dayNum}
                className="px-3 py-1 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] text-xs font-mono font-bold text-[#050E1A] flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3 text-[#2E7D32]" /> Day {dayNum}
              </span>
            ))}
          </div>
        </div>

        {/* 5 Core Evaluation Dimensions */}
        <div className="card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] space-y-5">
          <h3 className="text-base font-bold text-[#050E1A] font-['Outfit'] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C9A96E]" /> 5 Core Diagnostic Dimensions
          </h3>

          {dimensions.length > 0 ? (
            <div className="space-y-4">
              {dimensions.map((d) => (
                <div key={d.name} className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#050E1A]">
                    <span className="font-['Outfit'] text-sm">{d.name}</span>
                    <span className="font-mono text-sm">{d.score}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#FFFFFF] rounded-full overflow-hidden border border-[#E2D9C8]">
                    <div
                      className="h-full bg-gradient-to-r from-[#071426] to-[#C9A96E] transition-all duration-500"
                      style={{ width: `${d.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#475569] leading-relaxed font-medium">{d.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#475569] leading-relaxed font-medium">
              Detailed evaluation dimensions will appear once the backend returns them for the completed interview session.
            </p>
          )}
        </div>

        {/* Strengths & Skill Gaps 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Demonstrated Strengths */}
          <div className="card-surface rounded-3xl p-6 sm:p-7 shadow-sm border-2 border-[#E2D9C8] space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#EFE8DC]">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
              <h3 className="text-sm font-bold text-[#050E1A] font-['Outfit']">
                Demonstrated Strengths
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-[#1E293B]">
              {strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed font-medium">
                  <span className="text-[#2E7D32] font-bold">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Growth / Skill Gaps */}
          <div className="card-surface rounded-3xl p-6 sm:p-7 shadow-sm border-2 border-[#E2D9C8] space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#EFE8DC]">
              <AlertCircle className="w-4 h-4 text-[#D97706]" />
              <h3 className="text-sm font-bold text-[#050E1A] font-['Outfit']">
                Areas for Growth & Skill Gaps
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-[#1E293B]">
              {skillGaps.map((gap, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed font-medium">
                  <span className="text-[#D97706] font-bold">!</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feedback Summary Banner if available */}
        {feedbackSummary && (
          <div className="card-surface rounded-3xl p-6 shadow-sm border-2 border-[#C9A96E]/40 bg-[#FFFFFF] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#C9A96E]">
              <Sparkles className="w-4 h-4" /> AI Evaluator Summary
            </div>
            <p className="text-xs sm:text-sm text-[#050E1A] font-medium leading-relaxed">
              {feedbackSummary}
            </p>
          </div>
        )}

        {/* Real Turn-by-Turn Response Log Section */}
        {historyTurns.length > 0 && (
          <div className="card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DC]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#071426]" />
                <h3 className="text-base font-bold text-[#050E1A] font-['Outfit']">
                  Real Turn-by-Turn Interview Log ({historyTurns.length} Questions Evaluated)
                </h3>
              </div>
              <span className="text-xs font-mono text-[#475569]">
                Live Session Telemetry
              </span>
            </div>

            <div className="space-y-4">
              {historyTurns.map((turn, idx) => {
                const isSkipped = turn.skipped || turn.answer === '[Question Skipped by Candidate]';
                const score = turn.evaluation?.score ?? turn.evaluation?.overall_score ?? (isSkipped ? 50 : 0);
                const normalizedScore = Math.max(0, Math.min(100, Math.round(score * 100)));
                const scoreColor = normalizedScore >= 80 ? 'text-[#2E7D32] bg-[#2E7D32]/10 border-[#2E7D32]/30' : normalizedScore >= 60 ? 'text-[#D97706] bg-[#D97706]/10 border-[#D97706]/30' : 'text-[#DC2626] bg-[#DC2626]/10 border-[#DC2626]/30';

                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] space-y-3 font-mono text-xs"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFE8DC] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#050E1A]">
                          Q{turn.question_number || idx + 1}: Day {turn.curriculum_day || 3} Probe
                        </span>
                        {isSkipped && (
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#D97706]/10 text-[#D97706]">
                            Skipped
                          </span>
                        )}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-lg border font-bold ${scoreColor}`}>
                        Score: {normalizedScore}/100
                      </span>
                    </div>

                    {/* Question */}
                    <div>
                      <span className="text-[#475569] font-bold block mb-1">INTERVIEWER QUESTION:</span>
                      <p className="text-[#050E1A] font-sans font-semibold italic">"{turn.question}"</p>
                    </div>

                    {/* Candidate Answer */}
                    <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E2D9C8]">
                      <span className="text-[#475569] font-bold block mb-1">CANDIDATE RESPONSE:</span>
                      <p className="text-[#050E1A] font-sans leading-relaxed">
                        {turn.answer || '(No response recorded)'}
                      </p>
                    </div>

                    {/* Detected Terms / Feedback */}
                    {turn.evaluation && (
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#475569]">
                        {turn.evaluation.technical_terms_detected && turn.evaluation.technical_terms_detected.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-[#050E1A]">Keywords Identified:</span>
                            <span className="text-[#2E7D32] font-bold">
                              {turn.evaluation.technical_terms_detected.join(', ')}
                            </span>
                          </div>
                        )}
                        {turn.evaluation.recommended_difficulty && (
                          <div className="text-[#071426] font-semibold">
                            Next difficulty: {turn.evaluation.recommended_difficulty}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* What To Study Next Grounded in Curriculum Days */}
        <div className="card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#EFE8DC]">
            <BookOpen className="w-4 h-4 text-[#071426]" />
            <h3 className="text-base font-bold text-[#050E1A] font-['Outfit']">
              Recommended Next Study Steps (Curriculum Grounded)
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {studyRecommendations.map((rec) => (
              <div
                key={rec.day}
                className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#050E1A]">
                      Day {rec.day}: {rec.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#475569] mt-1 font-medium">{rec.action}</p>
                </div>

                <Link
                  to="/roadmap"
                  className="px-3.5 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#E2D9C8] text-[11px] font-mono font-bold text-[#071426] hover:bg-[#071426] hover:text-[#FFFDF7] transition-colors shrink-0 text-center"
                >
                  Review Day {rec.day} →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/track-improve"
            className="px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#071426] hover:bg-[#16345C] text-[#FFFDF7] shadow-md flex items-center gap-2"
          >
            <span>View Evaluation History</span>
            <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
          </Link>

          <Link
            to="/dashboard"
            className="px-6 py-3.5 rounded-xl font-bold text-xs bg-[#FFFFFF] border border-[#E2D9C8] text-[#050E1A] hover:bg-[#FAF7F0] shadow-sm flex items-center gap-2"
          >
            <span>Candidate Dashboard</span>
          </Link>

          <Link
            to="/roadmap"
            className="px-6 py-3.5 rounded-xl font-bold text-xs bg-[#FFFFFF] border border-[#E2D9C8] text-[#050E1A] hover:bg-[#FAF7F0] shadow-sm flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#071426]" />
            <span>Open 31-Day Roadmap</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Report;
