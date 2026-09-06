export type CareerRoleId =
  | 'java_developer'
  | 'web_developer'
  | 'data_analyst'
  | 'software_engineer'
  | 'cloud_devops';

export interface CareerSkillRequirement {
  name: string;
  required: number;
  category: 'core' | 'framework' | 'tools' | 'soft';
  description: string;
}

export interface CareerRole {
  id: CareerRoleId;
  title: string;
  category: string;
  description: string;
  targetPackage: string;
  skills: CareerSkillRequirement[];
}

export interface StudentScores {
  academic: number;
  technical: number;
  aptitude: number;
  communication: number;
  projects: number;
  exposure: number;
}

export interface ScoringWeights {
  academic: number;
  technical: number;
  aptitude: number;
  communication: number;
  projects: number;
  exposure: number;
}

export type SkillProficiency =
  | 'None'
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'Expert';

export interface UploadedCertificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  category:
    | 'technical'
    | 'cloud'
    | 'soft_skills'
    | 'academic'
    | 'internship'
    | 'other';
  credentialId?: string;
  fileDataUrl?: string;
  fileName?: string;
  fileSize?: number;
  uploadedAt: string;
}

export interface StudentFactualData {
  // Academic Performance & Coursework Evidence

  // Overall CGPA used by the existing scoring engine
  cgpa: number;

  // NEW: Current academic year
  // 1 = First Year
  // 2 = Second Year
  // 3 = Third Year
  // 4 = Fourth Year
  currentYear?: 1 | 2 | 3 | 4;

  // NEW: Semester-wise CGPA
  // Index 0 = Semester 1
  // Index 1 = Semester 2
  // ...
  // Index 7 = Semester 8
  semesterCgpas?: number[];

  assignmentsScore: number;
  hasBacklogs: boolean;
  backlogCount: number;

  // Technical & Coding Skills Evidence
  codingAssessmentScore: number;
  primaryLanguage: string;
  primaryLanguageLevel: SkillProficiency;
  secondaryLanguage: string;
  secondaryLanguageLevel: SkillProficiency;
  dsaLevel: SkillProficiency;
  sqlLevel: SkillProficiency;
  dsaProblemsSolved: number;
  githubCommitsThisYear: number;

  // Projects & Practical Work Evidence
  projectCount: number;
  hasFullStackOrDeployed: boolean;
  hasGitRepo: boolean;

  // Certifications & Industry Exposure Evidence
  certificationsCount: number;
  hasInternship: boolean;
  internshipRole?: string;
  internshipMonths: number;

  // Aptitude & Analytical Reasoning Evidence
  aptitudeMockPercentile: number;
  aptitudePracticeLevel:
    | 'Beginner'
    | 'Intermediate'
    | 'Advanced';

  // Communication & Viva / Interview Evidence
  communicationRating:
    | 'Needs Practice'
    | 'Average'
    | 'Good'
    | 'Excellent';

  vivaInterviewScore?: number;
  gdParticipation: boolean;
  englishProficiency:
    | 'Basic'
    | 'Conversational'
    | 'Professional'
    | 'Fluent';
}

export interface StudentProfile {
  name: string;
  rollNo: string;
  branch: string;
  semester: string;
  college: string;
  targetRole: CareerRoleId;
  email: string;
  github: string;
  linkedin: string;
  bio: string;
  certifications: string[];
  uploadedCertificates: UploadedCertificate[];
  factualData: StudentFactualData;
  projects: Array<{
    title: string;
    tech: string;
    description: string;
  }>;
  customSkillLevels: Record<string, number>;
}

export type ReadinessCategory =
  | 'Highly Prepared'
  | 'Placement Ready'
  | 'Needs Improvement'
  | 'Needs Attention';

export interface ScoreComponentInfo {
  key: keyof StudentScores;
  label: string;
  shortLabel: string;
  weight: number;
  score: number;
  contribution: number;
  description: string;
  color: string;
}

export interface ReadinessResult {
  overallScore: number;
  category: ReadinessCategory;
  categoryBadgeColor: string;
  categoryDesc: string;
  percentile: number;
  components: ScoreComponentInfo[];
  topStrengths: ScoreComponentInfo[];
  topImprovementAreas: ScoreComponentInfo[];
}

export interface SkillGapItem {
  skillName: string;
  required: number;
  current: number;
  gap: number;
  status: 'Good' | 'Needs Improvement' | 'High Priority';
  category: string;
  description: string;
}

export interface RoadmapTask {
  id: string;
  phase: '30_day' | '60_day' | '90_day';
  title: string;
  description: string;
  targetSkill: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface HistorySnapshot {
  id: string;
  timestamp: string;
  label: string;
  scores: StudentScores;
  readinessScore: number;
  category: ReadinessCategory;
  targetRole: string;
  notes: string;
}

export interface AppSettings {
  darkMode: boolean;
  hapticFeedback: boolean;
  autoSave: boolean;
  weights: ScoringWeights;
}

export interface PresetProfile {
  id: string;
  title: string;
  subtitle: string;
  branch: string;
  targetRole: CareerRoleId;
  scores: StudentScores;
  skillLevels: Record<string, number>;
}
