import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Award,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Settings,
  Bell,
  Moon,
  Database,
  Briefcase,
  GraduationCap,
  Edit3,
  Save,
  X,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileCard from '../components/ProfileCard';
import CompletionRate from '../components/CompletionRate';
import Toast from '../components/Toast';
import {
  getSelectedCandidateId,
  getCandidateById,
  getAllCandidates,
  setSelectedCandidateId,
} from '../data/candidate';

export const Profile = () => {
  const candidateId = getSelectedCandidateId();
  const candidate = getCandidateById(candidateId);
  const allCandidates = getAllCandidates();

  const [activeTab, setActiveTab] = useState('overview'); // overview | badges | settings
  const [toast, setToast] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Persistent Candidate Custom Profile Details
  const [profileData, setProfileData] = useState({
    jobRole: candidate?.member?.jobRole || 'Senior Data Engineer',
    yearsExperience: candidate?.member?.yearsExperience || 5,
    education: candidate?.member?.education || "Master's Computer Science",
  });

  // Load custom profile details on candidate switch
  useEffect(() => {
    if (!candidate) return;
    try {
      const saved = localStorage.getItem(`growmore_profile_${candidate.member.id}`);
      if (saved) {
        setProfileData(JSON.parse(saved));
      } else {
        setProfileData({
          jobRole: candidate.member.jobRole,
          yearsExperience: candidate.member.yearsExperience,
          education: candidate.member.education,
        });
      }
    } catch {
      // fallback
    }
  }, [candidate]);

  // Persistent Evaluation Preferences
  const [preferences, setPreferences] = useState(() => {
    if (!candidateId) return { notifications: true, autoSaveTranscript: true, strictProctoring: true, voiceFeedback: true };
    try {
      const saved = localStorage.getItem(`growmore_preferences_${candidateId}`);
      return saved
        ? JSON.parse(saved)
        : { notifications: true, autoSaveTranscript: true, strictProctoring: true, voiceFeedback: true };
    } catch {
      return { notifications: true, autoSaveTranscript: true, strictProctoring: true, voiceFeedback: true };
    }
  });

  if (!candidate) return null;

  const togglePref = (key) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(`growmore_preferences_${candidateId}`, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save preference:', err);
      }
      setToast({
        message: `Preference updated: ${key} is now ${updated[key] ? 'ENABLED' : 'DISABLED'}`,
        type: 'info',
      });
      return updated;
    });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem(`growmore_profile_${candidate.member.id}`, JSON.stringify(profileData));
      setIsEditing(false);
      setToast({
        message: 'Profile details saved successfully!',
        type: 'success',
      });
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const handleCandidateSwitch = (newId) => {
    setSelectedCandidateId(newId);
    setToast({
      message: `Switched profile to candidate ${newId}`,
      type: 'info',
    });
  };

  const badges = [
    {
      id: 'b-1',
      title: '31-Day AI Cohort Verified',
      desc: 'Completed all core technical cohort milestones and capstone architecture evaluation',
      color: 'text-[#2E7D32] bg-[#2E7D32]/10',
    },
    {
      id: 'b-2',
      title: 'Vector Search Specialist',
      desc: 'Mastered ChromaDB, HNSW indexing & Reciprocal Rank Fusion distance metrics',
      color: 'text-[#071426] bg-[#071426]/10',
    },
    {
      id: 'b-3',
      title: 'MCP Protocol Master',
      desc: 'Built bidirectional Model Context Protocol tool servers with Pydantic AST schema validation',
      color: 'text-[#C9A96E] bg-[#C9A96E]/15',
    },
    {
      id: 'b-4',
      title: 'Container Security Guard',
      desc: 'Configured least-privilege Docker Compose guardrails and gVisor isolation policies',
      color: 'text-[#D97706] bg-[#D97706]/10',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#050E1A] flex flex-col selection:bg-[#C9A96E] selection:text-[#071426]">
      <Navbar />

      <main
        className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8"
        role="main"
        aria-label="Candidate Account Profile"
      >
        {/* Header & Switcher */}
        <div className="card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#071426] text-[#FFFDF7] font-mono font-black text-lg flex items-center justify-center shadow-md shrink-0">
              {candidate.member.id.replace('CAND-', '#')}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-[#050E1A] font-['Outfit']">
                  {candidate.member.name}
                </h1>
                <span className="text-xs font-mono font-bold text-[#2E7D32] bg-[#2E7D32]/10 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> Verified
                </span>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-[#E2D9C8] hover:border-[#071426] text-[11px] font-mono font-bold text-[#071426] flex items-center gap-1 transition-colors cursor-pointer"
                  aria-label="Edit Profile Details"
                >
                  <Edit3 className="w-3 h-3 text-[#C9A96E]" /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              </div>
              <p className="text-xs font-mono text-[#475569] mt-1">
                {profileData.jobRole} · {profileData.yearsExperience} YOE · {profileData.education}
              </p>
            </div>
          </div>

          {/* Candidate Switcher */}
          <div className="shrink-0 space-y-1 w-full sm:w-auto">
            <label htmlFor="profile-candidate-select" className="text-[11px] font-mono uppercase font-bold text-[#475569] block">
              Switch Candidate Profile
            </label>
            <select
              id="profile-candidate-select"
              value={candidate.member.id}
              onChange={(e) => handleCandidateSwitch(e.target.value)}
              className="w-full sm:w-56 px-3 py-2 rounded-xl bg-[#FAF7F0] border-2 border-[#E2D9C8] text-xs font-mono font-bold text-[#050E1A] focus:outline-none focus:border-[#071426] focus-visible:ring-2 focus-visible:ring-[#C9A96E] cursor-pointer"
            >
              {allCandidates.map((c) => (
                <option key={c.member.id} value={c.member.id}>
                  {c.member.name} ({c.member.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Edit Form Drawer */}
        <AnimatePresence>
          {isEditing && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSaveProfile}
              className="card-surface rounded-3xl p-6 shadow-sm border-2 border-[#C9A96E] space-y-4 bg-[#FFFFFF]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#EFE8DC]">
                <h3 className="text-sm font-bold font-mono text-[#050E1A]">Update Profile Details ({candidate.member.id})</h3>
                <button type="button" onClick={() => setIsEditing(false)} className="p-1 text-[#475569]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <label htmlFor="input-jobrole" className="font-bold text-[#050E1A]">Job Role</label>
                  <input
                    id="input-jobrole"
                    type="text"
                    value={profileData.jobRole}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, jobRole: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] text-xs font-mono text-[#050E1A]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="input-yoe" className="font-bold text-[#050E1A]">Years Experience</label>
                  <input
                    id="input-yoe"
                    type="number"
                    min="0"
                    max="40"
                    value={profileData.yearsExperience}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, yearsExperience: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] text-xs font-mono text-[#050E1A]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="input-edu" className="font-bold text-[#050E1A]">Education</label>
                  <input
                    id="input-edu"
                    type="text"
                    value={profileData.education}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, education: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] border border-[#E2D9C8] text-xs font-mono text-[#050E1A]"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold border border-[#E2D9C8] text-[#050E1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-[#071426] text-[#FFFDF7] flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5 text-[#C9A96E]" /> Save Profile
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Profile Tabs */}
        <div className="flex border-b-2 border-[#E2D9C8] gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Profile Tabs">
          {[
            { id: 'overview', label: 'Candidate Overview' },
            { id: 'badges', label: 'Certifications & Badges' },
            { id: 'settings', label: 'Evaluation Preferences' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`profile-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-2xl font-mono text-xs font-bold transition-all cursor-pointer border-2 focus-visible:ring-2 focus-visible:ring-[#C9A96E] ${
                  isActive
                    ? 'bg-[#071426] text-[#FFFDF7] border-[#071426] shadow-sm'
                    : 'bg-[#FAF7F0] text-[#475569] border-transparent hover:border-[#E2D9C8]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <motion.div
            id="profile-panel-overview"
            role="tabpanel"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProfileCard candidate={candidate} />
              <CompletionRate candidate={candidate} />
            </div>

            {/* Quick Metadata Box */}
            <div className="card-surface rounded-3xl p-6 shadow-sm border-2 border-[#E2D9C8] space-y-4 bg-[#FFFFFF]">
              <h3 className="text-base font-bold font-['Outfit'] text-[#050E1A] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#071426]" /> Candidate Background & Cohort Record
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] space-y-1">
                  <span className="text-[#475569] block">Education</span>
                  <span className="font-bold text-[#050E1A]">{profileData.education}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] space-y-1">
                  <span className="text-[#475569] block">Experience</span>
                  <span className="font-bold text-[#050E1A]">{profileData.yearsExperience} Years Industry</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] space-y-1">
                  <span className="text-[#475569] block">Cohort Status</span>
                  <span className="font-bold text-[#2E7D32]">{candidate.member.status}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Badges */}
        {activeTab === 'badges' && (
          <motion.div
            id="profile-panel-badges"
            role="tabpanel"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DC]">
              <div>
                <h3 className="text-lg font-extrabold text-[#050E1A] font-['Outfit']">Verified Cohort Credentials</h3>
                <p className="text-xs font-mono text-[#475569]">Earned through verified mission completions in candidates.json</p>
              </div>
              <Award className="w-6 h-6 text-[#C9A96E]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badges.map((b) => (
                <div key={b.id} className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${b.color}`}>
                      {b.title}
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] font-medium leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab 3: Settings */}
        {activeTab === 'settings' && (
          <motion.div
            id="profile-panel-settings"
            role="tabpanel"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] space-y-6 bg-[#FFFFFF]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DC]">
              <div>
                <h3 className="text-lg font-extrabold text-[#050E1A] font-['Outfit'] flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#071426]" /> Evaluation Sandbox Preferences
                </h3>
                <p className="text-xs font-mono text-[#475569]">Manage sandbox environment configuration and transcript storage</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#050E1A] block">Auto-Save Interview Transcripts</span>
                  <span className="text-[#475569] text-[11px]">Save structured Q&A logs to localStorage after evaluation</span>
                </div>
                <button
                  type="button"
                  onClick={() => togglePref('autoSaveTranscript')}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C9A96E] ${
                    preferences.autoSaveTranscript ? 'bg-[#071426]' : 'bg-[#E2D9C8]'
                  }`}
                  aria-label="Toggle Auto-Save Transcripts"
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-[#FFFDF7] absolute top-1 transition-all ${
                      preferences.autoSaveTranscript ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#050E1A] block">Strict Proctoring Protection</span>
                  <span className="text-[#475569] text-[11px]">Enable 3-strike tab switch focus loss alerts</span>
                </div>
                <button
                  type="button"
                  onClick={() => togglePref('strictProctoring')}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C9A96E] ${
                    preferences.strictProctoring ? 'bg-[#071426]' : 'bg-[#E2D9C8]'
                  }`}
                  aria-label="Toggle Strict Proctoring Protection"
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-[#FFFDF7] absolute top-1 transition-all ${
                      preferences.strictProctoring ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#050E1A] block">Diagnostic Email Notifications</span>
                  <span className="text-[#475569] text-[11px]">Receive summary reports after interview completions</span>
                </div>
                <button
                  type="button"
                  onClick={() => togglePref('notifications')}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C9A96E] ${
                    preferences.notifications ? 'bg-[#071426]' : 'bg-[#E2D9C8]'
                  }`}
                  aria-label="Toggle Email Notifications"
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-[#FFFDF7] absolute top-1 transition-all ${
                      preferences.notifications ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E2D9C8] flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#050E1A] block">Avatar Voice Synthesis</span>
                  <span className="text-[#475569] text-[11px]">Read interview questions aloud using browser speech synthesis</span>
                </div>
                <button
                  type="button"
                  onClick={() => togglePref('voiceFeedback')}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C9A96E] ${
                    preferences.voiceFeedback ? 'bg-[#071426]' : 'bg-[#E2D9C8]'
                  }`}
                  aria-label="Toggle Avatar Voice Synthesis"
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-[#FFFDF7] absolute top-1 transition-all ${
                      preferences.voiceFeedback ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action card */}
        <div className="card-surface rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#E2D9C8] text-center space-y-4">
          <h2 className="text-xl font-bold text-[#050E1A] font-['Outfit']">
            Ready for your 31-day evaluation?
          </h2>
          <p className="text-xs sm:text-sm text-[#1E293B] max-w-md mx-auto font-medium">
            Proceed to your adaptive interview sandbox or review your complete 31-day curriculum journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/interview-setup"
              className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#071426] hover:bg-[#16345C] text-[#FFFDF7] shadow-md flex items-center gap-2"
            >
              <span>Setup Interview</span>
              <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
            </Link>

            <Link
              to="/roadmap"
              className="px-6 py-3.5 rounded-xl font-bold text-xs bg-[#FFFFFF] border border-[#E2D9C8] text-[#050E1A] hover:bg-[#FAF7F0] flex items-center gap-2"
            >
              <span>View 31-Day Roadmap</span>
            </Link>
          </div>
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Footer />
    </div>
  );
};

export default Profile;
