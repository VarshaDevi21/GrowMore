/**
 * Centralized Candidate Evaluation History Service
 * Manages multi-session interview history per candidate in localStorage
 */

const HISTORY_STORAGE_KEY = 'growmore_interview_history';

/**
 * Seed historical sessions when candidate has no existing history
 */
const getInitialSeedHistory = (candidateId) => {
  return [
    {
      id: `attempt-seed-1-${candidateId}`,
      candidate_id: candidateId,
      date: '2026-08-08',
      tier: 'Medium',
      score: 88,
      questionsCount: 10,
      daysCovered: [3, 7, 10, 13, 18, 23, 28],
      summary: 'Demonstrated strong command of vector similarity distance metrics and FastAPI SSE streaming token delivery.',
      status: 'PASSED',
      strengths: [
        'Vector similarity search & HNSW index trade-offs',
        'FastAPI asynchronous event handling and streaming response architecture',
        'Bidirectional Model Context Protocol (MCP) tool decoupling',
      ],
      gaps: [
        'Deepen understanding of Reciprocal Rank Fusion (RRF) smoothing constants',
        'Review Docker container isolation policies and AST schema healing under edge inputs',
      ],
    },
    {
      id: `attempt-seed-2-${candidateId}`,
      candidate_id: candidateId,
      date: '2026-08-05',
      tier: 'Medium',
      score: 79,
      questionsCount: 10,
      daysCovered: [1, 4, 8, 12, 16, 21],
      summary: 'Solid core Python environment setup; recommended revisiting RRF smoothing constants for hybrid retrieval.',
      status: 'PASSED',
      strengths: [
        'Python virtual environment isolation & dependency locking',
        'Basic dense vector storage in ChromaDB',
      ],
      gaps: [
        'gVisor container runtime security guardrails',
      ],
    },
    {
      id: `attempt-seed-3-${candidateId}`,
      candidate_id: candidateId,
      date: '2026-07-28',
      tier: 'Easy',
      score: 92,
      questionsCount: 10,
      daysCovered: [1, 2, 3, 4, 5, 7],
      summary: 'High accuracy across foundational tooling, local Ollama execution, and environment setup.',
      status: 'PASSED',
      strengths: [
        'Environment configuration & environment variables',
        'Local model execution via Ollama CLI',
      ],
      gaps: [],
    },
  ];
};

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

    if (candidateHistory.length === 0) {
      const seed = getInitialSeedHistory(candidateId);
      allHistory = [...seed, ...allHistory];
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(allHistory));
      return seed;
    }

    return candidateHistory;
  } catch (error) {
    console.error('Error reading candidate history:', error);
    return getInitialSeedHistory(candidateId);
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
  const score = report.overall_score || report.score || 85;
  return {
    id: report.sessionId || report.id || `attempt-${Date.now()}`,
    candidate_id: report.candidate_id || report.candidateId || 'CAND-001',
    date: report.date || new Date().toISOString().split('T')[0],
    tier: report.difficulty || report.tier || 'Medium',
    score: score,
    questionsCount: report.history?.length || report.questionsCount || 10,
    daysCovered: report.curriculum_days_covered || [3, 7, 10, 13, 18, 23, 28],
    summary: report.feedback?.summary || report.summary || 'Technical diagnostic evaluation completed cleanly.',
    status: score >= 70 ? 'PASSED' : 'NEEDS_IMPROVEMENT',
    strengths: report.feedback?.strengths || report.strengths || [],
    gaps: report.feedback?.gaps || report.gaps || [],
    next: report.feedback?.next || report.next || [],
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
