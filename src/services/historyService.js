/**
 * Centralized Candidate Evaluation History Service
 * Manages multi-session interview history per candidate in localStorage
 */

const HISTORY_STORAGE_KEY = 'growmore_interview_history';

/**
 * Get full history map for all candidates or filter by candidate ID
 * @param {string} candidateId - Active candidate ID
 * @returns {Array<object>} List of evaluation attempts
 */
export const getCandidateHistory = (candidateId) => {
  if (!candidateId) return [];

  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    let allHistory = raw ? JSON.parse(raw) : [];

    // Filter by candidate ID
    let candidateHistory = allHistory.filter((item) => item.candidate_id === candidateId);

    // Also check last_interview_report if recent
    const storedLastReport = localStorage.getItem('last_interview_report');
    if (storedLastReport) {
      const parsedLast = JSON.parse(storedLastReport);
      if (parsedLast && parsedLast.candidate_id === candidateId) {
        const exists = candidateHistory.some((item) => item.id === parsedLast.sessionId || item.date === parsedLast.date);
        if (!exists) {
          const formattedFromLast = formatReportToHistoryItem(parsedLast);
          candidateHistory.unshift(formattedFromLast);
          allHistory.unshift(formattedFromLast);
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(allHistory));
        }
      }
    }

    return candidateHistory;
  } catch (error) {
    console.error('Error reading candidate history:', error);
    return [];
  }
};

/**
 * Save an interview evaluation report into candidate history
 * @param {object} report - Report object from POST /api/interview
 * @returns {object} Formatted history item
 */
export const saveInterviewReportToHistory = (report) => {
  if (!report || !report.candidate_id) return null;

  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    const allHistory = raw ? JSON.parse(raw) : [];

    const newItem = formatReportToHistoryItem(report);

    // Prevent duplicate entries by ID
    const existingIdx = allHistory.findIndex((h) => h.id === newItem.id);
    if (existingIdx >= 0) {
      allHistory[existingIdx] = newItem;
    } else {
      allHistory.unshift(newItem);
    }

    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(allHistory));
    localStorage.setItem('last_interview_report', JSON.stringify(report));

    return newItem;
  } catch (error) {
    console.error('Failed to save interview report to history:', error);
    return null;
  }
};

/**
 * Format raw evaluation report into history item structure
 */
const formatReportToHistoryItem = (report) => {
  const reportPayload = report.report || report;
  const feedback = reportPayload.feedback || report.feedback || {};
  const score = reportPayload.overall_score ?? report.overall_score ?? reportPayload.score ?? report.score ?? 0;
  return {
    id: reportPayload.sessionId || report.sessionId || reportPayload.id || report.id || `attempt-${Date.now()}`,
    candidate_id: reportPayload.candidate_id || report.candidate_id || reportPayload.candidateId || report.candidateId || 'CAND-001',
    date: reportPayload.date || report.date || new Date().toISOString().split('T')[0],
    tier: reportPayload.difficulty || report.difficulty || reportPayload.tier || report.tier || 'Medium',
    score,
    questionsCount: reportPayload.history?.length || report.history?.length || reportPayload.questionsCount || report.questionsCount || 0,
    daysCovered: reportPayload.curriculum_days_covered || report.curriculum_days_covered || [],
    summary: feedback.summary || reportPayload.summary || report.summary || 'Interview completed with backend feedback.',
    status: score >= 70 ? 'PASSED' : 'NEEDS_IMPROVEMENT',
    strengths: feedback.strengths || reportPayload.strengths || report.strengths || [],
    gaps: feedback.gaps || reportPayload.gaps || report.gaps || [],
    next: feedback.next || reportPayload.next || report.next || [],
  };
};

/**
 * Clear all evaluation history for a specific candidate
 */
export const clearCandidateHistory = (candidateId) => {
  if (!candidateId) return;

  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return;

    const allHistory = JSON.parse(raw);
    const filtered = allHistory.filter((item) => item.candidate_id !== candidateId);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));

    // Clear last report if matching
    const storedLast = localStorage.getItem('last_interview_report');
    if (storedLast) {
      const parsed = JSON.parse(storedLast);
      if (parsed.candidate_id === candidateId) {
        localStorage.removeItem('last_interview_report');
      }
    }
  } catch (error) {
    console.error('Error clearing candidate history:', error);
  }
};

/**
 * Remove a specific evaluation attempt
 */
export const deleteHistoryItem = (candidateId, attemptId) => {
  if (!candidateId || !attemptId) return;

  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return;

    const allHistory = JSON.parse(raw);
    const filtered = allHistory.filter((item) => !(item.candidate_id === candidateId && item.id === attemptId));
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting history item:', error);
  }
};
