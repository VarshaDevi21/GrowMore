import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
import HowItWorks from './pages/HowItWorks';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import InterviewSetup from './pages/InterviewSetup';
import Interview from './pages/Interview';
import InterviewExperience from './pages/InterviewExperience';
import Report from './pages/Report';
import TrackImprove from './pages/TrackImprove';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Candidate Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roadmap"
          element={
            <ProtectedRoute>
              <Roadmap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview-setup"
          element={
            <ProtectedRoute>
              <InterviewSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <Interview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview-experience"
          element={
            <ProtectedRoute>
              <InterviewExperience />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track-improve"
          element={
            <ProtectedRoute>
              <TrackImprove />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
