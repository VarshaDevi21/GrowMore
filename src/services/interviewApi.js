/**
 * Interview API Service Layer conforming strictly to TECHNICAL SPEC.md:
 * - POST /api/interview
 * - Start session: { sessionId, candidate } -> { reply, done: false }
 * - Turn session:  { sessionId, message }   -> { reply, done: false } OR { reply, done: true, feedback: { summary, strengths, gaps, next } }
 */

import {
  fetchMcpTools,
  invokeMcpTool,
  runAgenticWorkflow,
  getAgenticProgress,
  getPhase6Progress,
} from './agenticApi';

export { fetchMcpTools, invokeMcpTool, runAgenticWorkflow, getAgenticProgress, getPhase6Progress };

/**
 * Start an interview session per Technical Spec:
 * POST /api/interview { sessionId, candidate }
 */
export const startInterview = async (sessionId, candidate) => {
  return await postInterviewApi({
    sessionId,
    candidate,
  });
};

/**
 * Submit a candidate message/answer turn per Technical Spec:
 * POST /api/interview { sessionId, message }
 */
export const submitAnswer = async (sessionId, message) => {
  return await postInterviewApi({
    sessionId,
    message,
  });
};

/**
 * Core fetcher for POST /api/interview.
 * The backend is the single source of truth for interview state, reporting, and feedback.
 */
export const postInterviewApi = async (payload) => {
  console.log('========== POST /api/interview ==========');
  console.log(payload);

  const normalizedPayload = { ...payload };
  if (!normalizedPayload.sessionId && normalizedPayload.session_id) {
    normalizedPayload.sessionId = normalizedPayload.session_id;
  }
  if (normalizedPayload.answer && !normalizedPayload.message) {
    normalizedPayload.message = normalizedPayload.answer;
  }

  try {
    const response = await fetch('/api/interview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(normalizedPayload),
    });

    console.log('API STATUS:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: HTTP status ${response.status}${errorText ? ` - ${errorText}` : ''}`);
    }

    const data = await response.json();
    console.log('API RESPONSE:', data);
    return normalizeInterviewResponse(normalizedPayload, data);
  } catch (error) {
    console.error('API FAILED:', error);
    throw error;
  }
};

const normalizeInterviewResponse = (payload, response) => {
  if (!response || typeof response !== 'object') {
    return response;
  }

  const normalizedResponse = { ...response };
  const sessionId = response.sessionId || response.session_id || payload.sessionId || payload.session_id;

  if (sessionId) {
    normalizedResponse.sessionId = sessionId;
  }

  if (payload.candidate && !normalizedResponse.candidate) {
    normalizedResponse.candidate = payload.candidate;
  }

  return normalizedResponse;
};

