import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Send,
  AlertTriangle,
  LogOut,
  Code2,
  ShieldAlert,
  Sparkles,
  Maximize2,
  SkipForward,
} from 'lucide-react';
import InterviewerAvatar from '../components/InterviewerAvatar';
import { getSelectedCandidateId, getCandidateById } from '../data/candidate';
import { postInterviewApi } from '../services/interviewApi';
import { saveInterviewReportToHistory } from '../services/historyService';

export const Interview = () => {
  const navigate = useNavigate();
  const candidateId = getSelectedCandidateId();
  const candidate = getCandidateById(candidateId);

  // Stored starting difficulty or default to Medium
  const selectedDifficulty = localStorage.getItem('interview_starting_difficulty') || 'Medium';

  // Live Session States
  const [sessionId] = useState(`sess-${Date.now()}`);
  const [currentQuestionData, setCurrentQuestionData] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [answerText, setAnswerText] = useState('');
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes (1200 seconds)
  const [avatarState, setAvatarState] = useState('asking');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Anti-Cheat, Focus & Screenshot/OCR Protection States
  const [violationsCount, setViolationsCount] = useState(0);
  const [violationModal, setViolationModal] = useState(null); // null | 1 | 2 | 3
  const [showEndModal, setShowEndModal] = useState(false);
  const [isScreenBlurred, setIsScreenBlurred] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const buildReportPayloadForStorage = useCallback(
    (reportData = {}, extra = {}) => {
      const historyEntries = Array.isArray(reportData?.history) ? reportData.history : (Array.isArray(reportData?.report?.history) ? reportData.report.history : []);
      const curriculumDayValues = Array.from(
        new Set(historyEntries.map((turn) => turn.curriculum_day).filter(Boolean))
      );

      const payload = {
        candidate_id: candidate?.member?.id || 'CAND-001',
        candidate_name: candidate?.member?.name || 'Candidate',
        job_role: candidate?.member?.jobRole || 'AI Engineer',
        difficulty: selectedDifficulty || 'Medium',
        history: historyEntries,
        curriculum_days_covered: curriculumDayValues.length > 0 ? curriculumDayValues : [],
        ...extra,
      };

      if (reportData?.sessionId) payload.sessionId = reportData.sessionId;
      if (reportData?.completed_at) payload.completed_at = reportData.completed_at;
      if (reportData?.termination_reason) payload.termination_reason = reportData.termination_reason;
      if (reportData?.overall_score != null) payload.overall_score = reportData.overall_score;
      if (reportData?.feedback) payload.feedback = reportData.feedback;
      if (reportData?.evaluation_dimensions) payload.evaluation_dimensions = reportData.evaluation_dimensions;
      if (reportData?.report) payload.report = reportData.report;

      return payload;
    },
    [candidate, selectedDifficulty]
  );

  // Unified conclusion handler that guarantees navigation to /report
  const concludeToNormalWindow = useCallback(
    (reportData) => {
      const finalReportToSave = reportData
        ? { ...buildReportPayloadForStorage(reportData), ...reportData }
        : buildReportPayloadForStorage();

      // Always persist to localStorage for Report component lookup and history tracking
      localStorage.setItem('last_interview_report', JSON.stringify(finalReportToSave));
      saveInterviewReportToHistory(finalReportToSave);

      // Exit fullscreen mode if active
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      // Always navigate current window directly to /report
      navigate('/report');

      // If opened in separate popup window, also redirect opener window & attempt window close
      if (window.opener && !window.opener.closed) {
        try {
          window.opener.location.href = '/report';
          window.opener.focus();
        } catch {
          // ignore cross-origin restrictions if present
        }
        setTimeout(() => {
          try {
            window.close();
          } catch {
            // ignore browser popup close restrictions
          }
        }, 800);
      }
    },
    [candidate, selectedDifficulty, navigate]
  );

  // API Error state
  const [apiError, setApiError] = useState(null);

  // Initialize Session with POST /api/interview per TECHNICAL SPEC.md ({ sessionId, candidate })
  useEffect(() => {
    if (!candidate) return;

    const startSession = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const response = await postInterviewApi({
          sessionId,
          candidate,
          candidate_id: candidate.member.id,
          starting_difficulty: selectedDifficulty,
        });

        if (response.reply) {
          setCurrentQuestionData({
            ...response,
            question: response.question || response.reply,
          });
        } else {
          setCurrentQuestionData(response);
        }

        setQuestionNumber(response.question_number || 1);
        setAvatarState('asking');
        setTimeout(() => setAvatarState('listening'), 1800);
      } catch (err) {
        console.error('Failed to start interview session:', err);
        setApiError('Failed to connect to the backend. Please retry the interview.');
      } finally {
        setIsLoading(false);
      }
    };

    startSession();
  }, [candidate, selectedDifficulty, sessionId]);

  const finishInterview = useCallback(
    async (reason = 'completed') => {
      const reportPayload = {
        sessionId,
        message: answerText || 'Session concluded.',
        done: true,
        candidate_id: candidate?.member?.id,
        starting_difficulty: selectedDifficulty,
        violations_count: violationsCount,
      };

      try {
        const finalResponse = await postInterviewApi(reportPayload);
        const report = buildReportPayloadForStorage(finalResponse.report || finalResponse, {
          termination_reason: reason,
          feedback: finalResponse.feedback || (finalResponse.report && finalResponse.report.feedback),
          history,
        });

        concludeToNormalWindow(report);
      } catch (err) {
        console.error('Error finalizing report:', err);
        setApiError('The backend did not return a final report. Please retry the interview.');
      }
    },
    [candidate, sessionId, answerText, selectedDifficulty, violationsCount, concludeToNormalWindow]
  );

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishInterview('time_expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [finishInterview]);

  // Request Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // STRICT TAB SWITCH & FOCUS INTEGRITY (3-STRIKE SYSTEM) + SCREENSHOT / OCR DEFENSE
  useEffect(() => {
    const triggerViolation = () => {
      setIsScreenBlurred(true);
      setViolationsCount((prev) => {
        const nextCount = prev + 1;
        if (nextCount === 1) {
          setViolationModal(1);
        } else if (nextCount === 2) {
          setViolationModal(2);
        } else if (nextCount >= 3) {
          setViolationModal(3);
          setTimeout(() => {
            finishInterview('integrity_limit_exceeded');
          }, 3000);
        }
        return nextCount;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation();
      } else {
        setIsScreenBlurred(false);
      }
    };

    const handleBlur = () => {
      triggerViolation();
    };

    const handleFocus = () => {
      setIsScreenBlurred(false);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    // Intercept Screenshot / PrintScreen / Devtools / Save / Print Shortcuts
    const handleKeyDown = (e) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        try {
          navigator.clipboard.writeText('');
        } catch {
          // ignore
        }
        triggerViolation();
        return;
      }

      if (e.key === 'F12') {
        e.preventDefault();
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        if (
          e.key === 'p' ||
          e.key === 'P' ||
          e.key === 's' ||
          e.key === 'S' ||
          e.key === 'u' ||
          e.key === 'U' ||
          (e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))
        ) {
          e.preventDefault();
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        try {
          navigator.clipboard.writeText('');
        } catch {
          // ignore
        }
        triggerViolation();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [finishInterview]);

  if (!candidate) return null;

  const progressPercent = Math.round((questionNumber / 10) * 100);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeCritical = timeLeft < 120; // under 2 minutes

  // SUBMIT CANDIDATE RESPONSE
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim() || avatarState === 'thinking') return;

    setAvatarState('thinking');
    setApiError(null);

    const updatedHistory = [
      ...history,
      {
        question_number: questionNumber,
        curriculum_day: currentQuestionData?.curriculum_day || 3,
        question: currentQuestionData?.question,
        answer: answerText,
        skipped: false,
      },
    ];

    setHistory(updatedHistory);

    // If completing the 10th question, generate report and return to normal window
    if (questionNumber >= 10 || updatedHistory.length >= 10) {
      try {
        const response = await postInterviewApi({
          sessionId,
          message: answerText,
          candidate_id: candidate.member.id,
          starting_difficulty: selectedDifficulty,
          violations_count: violationsCount,
        });

        const reportToStore = buildReportPayloadForStorage(response.report || response, {
          feedback: response.feedback || (response.report && response.report.feedback),
          history: updatedHistory,
        });

        setAvatarState('encouraging');
        setTimeout(() => {
          concludeToNormalWindow(reportToStore);
        }, 800);
      } catch (err) {
        console.error('Error finalizing report:', err);
        setApiError('The backend did not return a final report. Please retry the interview.');
      }
      return;
    }

    // Otherwise advance to next question
    try {
      const response = await postInterviewApi({
        sessionId,
        message: answerText,
        candidate_id: candidate.member.id,
        starting_difficulty: selectedDifficulty,
        violations_count: violationsCount,
      });

      if (response.done || response.is_complete) {
        const reportToStore = buildReportPayloadForStorage(response.report || response, {
          feedback: response.feedback || (response.report && response.report.feedback),
          history: updatedHistory,
        });
        concludeToNormalWindow(reportToStore);
        return;
      }

      setAvatarState('encouraging');
      setTimeout(() => {
        setCurrentQuestionData({
          ...response,
          question: response.question || response.reply,
        });
        setQuestionNumber(response.question_number || questionNumber + 1);
        setAnswerText('');
        setAvatarState('asking');
        setTimeout(() => setAvatarState('listening'), 1500);
      }, 1000);
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setApiError('The backend did not return the next interview step. Please retry.');
      setAvatarState('listening');
    }
  };

  // SKIP CURRENT QUESTION
  const handleSkipQuestion = async () => {
    if (avatarState === 'thinking' || isLoading) return;

    setAvatarState('thinking');
    setApiError(null);

    const skipMessage = '[Question Skipped by Candidate]';
    const updatedHistory = [
      ...history,
      {
        question_number: questionNumber,
        curriculum_day: currentQuestionData?.curriculum_day || 3,
        question: currentQuestionData?.question,
        answer: skipMessage,
        skipped: true,
      },
    ];

    setHistory(updatedHistory);

    if (questionNumber >= 10 || updatedHistory.length >= 10) {
      try {
        const response = await postInterviewApi({
          sessionId,
          message: skipMessage,
          candidate_id: candidate.member.id,
          starting_difficulty: selectedDifficulty,
          violations_count: violationsCount,
        });

        const reportToStore = buildReportPayloadForStorage(response.report || response, {
          feedback: response.feedback || (response.report && response.report.feedback),
          history: updatedHistory,
        });

        setAvatarState('encouraging');
        setTimeout(() => {
          concludeToNormalWindow(reportToStore);
        }, 800);
      } catch (err) {
        console.error('Error finalizing report on skip:', err);
        setApiError('The backend did not return a final report after skipping. Please retry.');
      }
      return;
    }

    try {
      const response = await postInterviewApi({
        sessionId,
        message: skipMessage,
        candidate_id: candidate.member.id,
        starting_difficulty: selectedDifficulty,
        violations_count: violationsCount,
      });

      if (response.done || response.is_complete) {
        concludeToNormalWindow(response.report);
        return;
      }

      setTimeout(() => {
        setCurrentQuestionData({
          ...response,
          question: response.question || response.reply,
        });
        setQuestionNumber(response.question_number || questionNumber + 1);
        setAnswerText('');
        setAvatarState('asking');
        setTimeout(() => setAvatarState('listening'), 1500);
      }, 800);
    } catch (err) {
      console.error('Failed to skip question:', err);
      setApiError('The backend did not return the next interview step after skipping. Please retry.');
      setAvatarState('listening');
    }
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className={`min-h-screen bg-[#FAF7F0] text-[#050E1A] flex flex-col justify-between selection:bg-transparent selection:text-[#050E1A] relative overflow-hidden ${
        isScreenBlurred ? 'blur-md filter' : ''
      }`}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Dynamic Background Security Watermark */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] select-none flex flex-wrap items-center justify-around gap-20 p-8 rotate-[-15deg]"
        aria-hidden="true"
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className="text-xl font-mono font-black text-[#050E1A] tracking-widest whitespace-nowrap">
            SECURE EVALUATION · {candidate.member.id} · {candidate.member.name}
          </span>
        ))}
      </div>

      {/* 1. FOCUS SANDBOX TOP HEADER */}
      <header className="border-b-2 border-[#E2D9C8] bg-[#FFFFFF] py-3.5 px-4 sm:px-8 sticky top-0 z-40 shadow-sm relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand & Candidate Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#071426] text-[#FFFDF7] flex items-center justify-center font-mono font-bold text-xs shadow-sm">
              {candidate.member.id.replace('CAND-', '#')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-[#050E1A] font-['Outfit']">
                  AI Technical Interview
                </span>
                <span className="text-[10px] font-mono uppercase bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-0.5 rounded font-bold">
                  Tier: {selectedDifficulty}
                </span>
              </div>
              <span className="text-xs font-mono text-[#475569]">
                Candidate: {candidate.member.name} ({candidate.member.id}) · {candidate.member.jobRole}
              </span>
            </div>
          </div>

          {/* Progress Bar + Question Counter + Fullscreen + Timer */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* Question Counter & Mini Progress */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#050E1A]">
                <span>Question {questionNumber} of 10</span>
                <span className="text-[#C9A96E]">({progressPercent}%)</span>
              </div>
              <div className="w-32 sm:w-40 h-2 bg-[#FAF7F0] rounded-full overflow-hidden border border-[#E2D9C8]">
                <div
                  className="h-full bg-gradient-to-r from-[#071426] to-[#C9A96E] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Countdown Timer Badge */}
            <div
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-mono font-black text-xs border-2 transition-all ${
                isTimeCritical
                  ? 'bg-[#DC2626] text-[#FFFDF7] border-[#DC2626] animate-pulse'
                  : 'bg-[#FAF7F0] text-[#050E1A] border-[#E2D9C8]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{timeFormatted}</span>
            </div>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              className="p-2 rounded-xl bg-[#FAF7F0] hover:bg-[#EFE8DC] border border-[#E2D9C8] text-[#050E1A] cursor-pointer transition-colors"
              aria-label="Toggle Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* End Session Button */}
            <button
              type="button"
              onClick={() => setShowEndModal(true)}
              title="Finish Early"
              className="p-2 rounded-xl bg-[#FAF7F0] hover:bg-[#EFE8DC] border border-[#E2D9C8] text-[#DC2626] cursor-pointer transition-colors"
              aria-label="End Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN EVALUATION SANDBOX WORKSPACE */}
      <main className="max-w-5xl mx-auto w-full px-4 py-8 space-y-6 flex-grow relative z-10">
        {/* API Error Warning Alert */}
        {apiError && (
          <div className="p-4 rounded-2xl bg-[#DC2626]/10 border-2 border-[#DC2626] text-[#DC2626] text-xs font-mono font-bold flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{apiError}</span>
            </div>
            <button
              type="button"
              onClick={() => setApiError(null)}
              className="px-3 py-1 rounded-lg bg-[#DC2626] text-[#FFFDF7] hover:bg-[#B91C1C] transition-colors cursor-pointer text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}
        {/* AI Interviewer Section: Avatar + Question Box */}
        <div
          onCopy={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
          className="card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] space-y-6 select-none cursor-default"
          style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar Component */}
            <div className="shrink-0">
              <InterviewerAvatar state={avatarState} />
            </div>

            {/* Interviewer Question Box */}
            <div className="flex-grow space-y-3 w-full select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
              {isLoading ? (
                <div className="py-8 text-center text-xs font-mono text-[#475569] animate-pulse">
                  Connecting to AI Interview API...
                </div>
              ) : (
                <>
                  {/* Question Metadata Tags */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#EFE8DC]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-extrabold uppercase bg-[#071426] text-[#FFFDF7] px-2.5 py-1 rounded-lg">
                        Day {currentQuestionData?.curriculum_day || 3} Topic
                      </span>
                      <span className="text-xs font-mono font-bold text-[#C9A96E]">
                        {currentQuestionData?.module || 'Curriculum Milestone'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-0.5 rounded font-bold">
                        Tier: {currentQuestionData?.difficulty || selectedDifficulty}
                      </span>
                    </div>
                  </div>

                  {/* Main Conversational Question Text */}
                  <h2
                    onCopy={(e) => e.preventDefault()}
                    className="text-base sm:text-lg md:text-xl font-extrabold text-[#050E1A] font-['Outfit'] leading-relaxed select-none pointer-events-auto"
                    style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                  >
                    "{currentQuestionData?.question}"
                  </h2>

                  <div className="text-xs font-mono text-[#475569] pt-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
                    <span>Focus: {currentQuestionData?.topic || 'Applied Architecture'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Candidate Input & Answer Section */}
        <form onSubmit={handleSubmitAnswer} className="card-surface rounded-3xl p-6 sm:p-8 shadow-md border-2 border-[#E2D9C8] space-y-5 bg-[#FFFFFF]">
          <div className="flex items-center justify-between pb-2 border-b border-[#EFE8DC]">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#071426]" />
              <label htmlFor="candidate-answer" className="text-xs font-mono uppercase font-black text-[#050E1A]">
                Candidate Response
              </label>
            </div>

            <div className="text-xs font-mono text-[#475569]">
              {answerText.length} characters · {answerText.trim() ? answerText.trim().split(/\s+/).length : 0} words
            </div>
          </div>

          {/* Clean Text Area */}
          <textarea
            id="candidate-answer"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            disabled={avatarState === 'thinking' || isLoading}
            placeholder="Type your technical response here. Explain your design decisions, system components, trade-offs, and implementation approach. (If unfamiliar with this topic, click 'Skip Question' below to proceed)..."
            rows={8}
            className="w-full rounded-2xl bg-[#FAF7F0] border-2 border-[#E2D9C8] p-4 text-xs sm:text-sm text-[#050E1A] font-medium focus:outline-none focus:border-[#071426] transition-colors resize-none leading-relaxed"
          />

          {/* Action Bar with Skip and Submit */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs font-mono text-[#475569]">
              {avatarState === 'thinking' && (
                <span className="text-[#D97706] font-bold animate-pulse flex items-center gap-1">
                  ● Interviewer Analyzing Technical Depth via API...
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
              {/* Skip Question Button */}
              <button
                type="button"
                onClick={handleSkipQuestion}
                disabled={avatarState === 'thinking' || isLoading}
                className="px-5 py-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#FAF7F0] hover:bg-[#EFE8DC] border-2 border-[#E2D9C8] text-[#050E1A] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 transition-colors"
                title="Skip this question and move to the next curriculum milestone"
              >
                <SkipForward className="w-4 h-4 text-[#D97706]" />
                <span>Skip Question</span>
              </button>

              {/* Submit Answer Button */}
              <button
                type="submit"
                disabled={!answerText.trim() || avatarState === 'thinking' || isLoading}
                className="px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#071426] hover:bg-[#16345C] text-[#FFFDF7] shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {avatarState === 'thinking' ? (
                  <span>Evaluating Answer...</span>
                ) : (
                  <>
                    <span>{questionNumber < 10 ? 'Submit Response & Next' : 'Submit & Generate Scorecard'}</span>
                    <Send className="w-4 h-4 text-[#C9A96E]" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* 3. FOCUS FOOTER */}
      <footer className="border-t-2 border-[#E2D9C8] bg-[#F5EFE0] py-3.5 px-6 text-center text-xs font-mono text-[#475569] relative z-10">
        <span>31-Day AI Engineering Cohort · Live Technical Interview Sandbox · Proctored Session</span>
      </footer>

      {/* 4. 3-STRIKE TAB SWITCH / FOCUS LOSS MODALS */}
      <AnimatePresence>
        {violationModal === 1 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071426]/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card-surface rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-[#D97706] shadow-2xl space-y-4 bg-[#FFFFFF] text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#D97706]/15 text-[#D97706] flex items-center justify-center mx-auto shadow-sm">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-[#D97706]/10 text-[#D97706] text-xs font-mono font-bold">
                Warning 1 of 3: Focus Lost
              </div>

              <h3 className="text-xl font-extrabold text-[#050E1A] font-['Outfit']">
                Window Switch Detected
              </h3>

              <p className="text-xs sm:text-sm text-[#1E293B] font-medium leading-relaxed">
                You switched away from the active interview sandbox. Please stay on this window throughout your evaluation. 2 more violations will terminate your session immediately.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setViolationModal(null);
                    setIsScreenBlurred(false);
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#071426] text-[#FFFDF7] font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md hover:bg-[#16345C]"
                >
                  I Understand · Return to Interview
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {violationModal === 2 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071426]/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="card-surface rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-[#DC2626] shadow-2xl space-y-4 bg-[#FFFFFF] text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#DC2626]/15 text-[#DC2626] flex items-center justify-center mx-auto shadow-md animate-pulse">
                <ShieldAlert className="w-9 h-9" />
              </div>

              <div className="inline-block px-3.5 py-1 rounded-full bg-[#DC2626] text-[#FFFDF7] text-xs font-mono font-black">
                FINAL WARNING (2 of 3)
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#DC2626] font-['Outfit']">
                Critical Integrity Alert
              </h3>

              <p className="text-xs sm:text-sm text-[#050E1A] font-bold leading-relaxed">
                You have lost focus 2 times. If you switch tabs or minimize this window ONE more time, the interview will be terminated immediately and your scorecard finalized as-is.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setViolationModal(null);
                    setIsScreenBlurred(false);
                  }}
                  className="w-full py-4 rounded-xl bg-[#DC2626] text-[#FFFDF7] font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg hover:bg-[#B91C1C]"
                >
                  Acknowledge Final Warning
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {violationModal === 3 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071426]/90 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-surface rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-[#DC2626] shadow-2xl space-y-4 bg-[#FFFFFF] text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#DC2626] text-[#FFFDF7] flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-[#DC2626] font-['Outfit']">
                Interview Terminated
              </h3>

              <p className="text-xs sm:text-sm text-[#1E293B] font-medium leading-relaxed">
                Session integrity limit reached (3 tab switches detected). Your interview is ending and forwarding to your diagnostic scorecard...
              </p>

              <div className="pt-2">
                <div className="w-full py-3 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] text-xs font-mono font-bold text-[#DC2626]">
                  Redirecting to Scorecard...
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal to End Early */}
      <AnimatePresence>
        {showEndModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071426]/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card-surface rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-[#E2D9C8] shadow-2xl space-y-5 bg-[#FFFFFF] text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-extrabold text-[#050E1A] font-['Outfit']">
                Conclude Interview Early?
              </h3>

              <p className="text-xs sm:text-sm text-[#1E293B] font-medium leading-relaxed">
                You have completed {questionNumber} of 10 questions with {timeFormatted} remaining. Concluding now will generate your final scorecard based on submitted answers.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEndModal(false)}
                  className="py-3 rounded-xl border-2 border-[#E2D9C8] font-bold text-xs text-[#050E1A] hover:bg-[#FAF7F0] cursor-pointer"
                >
                  Continue Interview
                </button>

                <button
                  type="button"
                  onClick={() => finishInterview('user_concluded_early')}
                  className="py-3 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-[#FFFDF7] font-bold text-xs cursor-pointer shadow-md"
                >
                  End & View Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Interview;
