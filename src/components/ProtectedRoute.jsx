import React from 'react';
import { Navigate } from 'react-router-dom';
import { getSelectedCandidateId, getCandidateById } from '../data/candidate';

export const ProtectedRoute = ({ children }) => {
  const candidateId = getSelectedCandidateId();
  const candidate = getCandidateById(candidateId);

  // If no candidate selected or invalid ID, redirect to /login
  if (!candidateId || !candidate) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
