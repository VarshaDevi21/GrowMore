import candidatesJson from './candidates.json';

/**
 * Return all 20 real candidates from candidates.json
 */
export const getAllCandidates = () => {
  return candidatesJson.candidates || [];
};

/**
 * Reusable candidate lookup by ID (e.g. 'CAND-001')
 * Inspects candidate.member.id from candidates.json
 */
export const getCandidateById = (id) => {
  if (!id) return null;
  const candidates = getAllCandidates();
  return candidates.find((c) => c.member && c.member.id === id) || null;
};

/**
 * Read currently selected candidate ID from localStorage
 */
export const getSelectedCandidateId = () => {
  return localStorage.getItem('selectedCandidateId');
};

/**
 * Store selected candidate ID in localStorage
 */
export const setSelectedCandidateId = (id) => {
  if (id) {
    localStorage.setItem('selectedCandidateId', id);
  }
};

/**
 * Clear stored candidate ID upon logout
 */
export const clearSelectedCandidate = () => {
  localStorage.removeItem('selectedCandidateId');
};

/**
 * Helper to determine candidate mission status for a given curriculum day
 * Returns: 'completed' | 'skipped' | 'not_completed'
 */
export const getCandidateDayStatus = (candidate, dayNumber) => {
  if (!candidate || !candidate.missions) return 'not_completed';
  const mission = candidate.missions.find((m) => m.day === dayNumber);
  if (!mission) return 'not_completed';
  if (mission.passed === true) return 'completed';
  if (mission.skipped === true) return 'skipped';
  return 'not_completed';
};
