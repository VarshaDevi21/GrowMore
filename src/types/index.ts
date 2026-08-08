export interface CandidateMember {
  id: string;
  name: string;
  jobRole: string;
  yearsExperience: number;
  education: string;
  status: string;
}

export interface CandidateMission {
  day: number;
  title: string;
  passed?: boolean;
  skipped?: boolean;
  attempts?: number;
}

export interface CandidateSignals {
  commitDays: number;
  missionsCompleted: number;
  missionsFirstTry: number;
}

export interface Candidate {
  member: CandidateMember;
  missions: CandidateMission[];
  signals: CandidateSignals;
}

export interface CandidatesData {
  candidates: Candidate[];
}

export interface CurriculumModule {
  n: number;
  title: string;
  days: [number, number];
}

export interface CurriculumDay {
  day: number;
  title: string;
  type: string;
  tools: string[];
  objectives: string[];
}

export interface CurriculumData {
  cohort: string;
  modules: CurriculumModule[];
  days: CurriculumDay[];
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  iconName: string;
}

export interface HowItWorksStep {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  icon: string;
}

export interface ComparisonItem {
  feature: string;
  traditional: string;
  agent: string;
  highlight?: boolean;
}
