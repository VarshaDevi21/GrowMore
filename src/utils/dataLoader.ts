import candidatesJson from '../data/candidates.json';
import curriculumJson from '../data/curriculum.json';
import type { Candidate, CandidatesData, CurriculumData, CurriculumDay, CurriculumModule } from '../types';

export const candidatesData = candidatesJson as unknown as CandidatesData;
export const curriculumData = curriculumJson as unknown as CurriculumData;

export const getAllCandidates = (): Candidate[] => {
  return candidatesData.candidates;
};

export const getDefaultCandidate = (): Candidate => {
  return candidatesData.candidates[0] || null;
};

export const getCandidateById = (id: string): Candidate | undefined => {
  return candidatesData.candidates.find((c) => c.member.id === id);
};

export const getCurriculumModules = (): CurriculumModule[] => {
  return curriculumData.modules;
};

export const getCurriculumDays = (): CurriculumDay[] => {
  return curriculumData.days;
};

export const getDayDetails = (dayNumber: number): CurriculumDay | undefined => {
  return curriculumData.days.find((d) => d.day === dayNumber);
};

export const getCandidateDayStatus = (
  candidate: Candidate,
  dayNumber: number
): 'completed' | 'skipped' | 'not_completed' => {
  const mission = candidate.missions.find((m) => m.day === dayNumber);
  if (!mission) return 'not_completed';
  if (mission.skipped) return 'skipped';
  if (mission.passed) return 'completed';
  return 'not_completed';
};

export const getCandidateMissionForDay = (candidate: Candidate, dayNumber: number) => {
  return candidate.missions.find((m) => m.day === dayNumber);
};
