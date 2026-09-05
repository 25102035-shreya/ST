export type CareerRoleId =
  | 'java_developer'
  | 'web_developer'
  | 'data_analyst'
  | 'software_engineer'
  | 'cloud_devops';

export interface CareerSkillRequirement {
  name: string;
  required: number; // 0-100 scale
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
  academic: number;       // Suggested weight: 25%
  technical: number;      // Suggested weight: 25%
  aptitude: number;       // Suggested weight: 15%
  communication: number;  // Suggested weight: 15%
  projects: number;       // Suggested weight: 10%
  exposure: number;       // Suggested weight: 10%
}

export interface ScoringWeights {
  academic: number;
  technical: number;
  aptitude: number;
  communication: number;
  projects: number;
  exposure: number;
}

export type SkillProficiency = 'None' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface UploadedCertificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  category: 'technical' | 'cloud' | 'soft_skills' | 'academic' | 'internship' | 'other';
  credentialId?: string;
  fileDataUrl?: string; // base64 data url for preview or download
  fileName?: string;
  fileSize?: number;
  uploadedAt: string;
}

export interface StudentFactualData {
  // Academic Performance & Coursework Evidence
  cgpa: number; // e.g. 8.5 (scale 0-10)
  assignmentsScore: number; // e.g. 88 (scale 0-100) coursework assignments & test average
  hasBacklogs: boolean;
  backlogCount: number;

  // Technical & Coding Skills Evidence
  codingAssessmentScore: number; // e.g. 86 (scale 0-100) proctored coding test & assessment
  primaryLanguage: string; // e.g. "Java"
  primaryLanguageLevel: SkillProficiency; // e.g. "Advanced"
  secondaryLanguage: string; // e.g. "Python"
  secondaryLanguageLevel: SkillProficiency; // e.g. "Intermediate"
  dsaLevel: SkillProficiency; // e.g. "Intermediate"
  sqlLevel: SkillProficiency; // e.g. "Intermediate"
  dsaProblemsSolved: number; // e.g. 140 (verified platform problem count)
  githubCommitsThisYear: number; // e.g. 145 (verified commit history)

  // Projects & Practical Work Evidence
  projectCount: number; // e.g. 3
  hasFullStackOrDeployed: boolean; // e.g. true (verified cloud deployment / live URL)
  hasGitRepo: boolean; // e.g. true (active public repository & version control)

  // Certifications & Industry Exposure Evidence
  certificationsCount: number; // e.g. 4
  hasInternship: boolean; // e.g. true (verified industry internship)
  internshipRole?: string; // e.g. "Java Backend Engineering Intern"
  internshipMonths: number; // e.g. 3

  // Aptitude & Analytical Reasoning Evidence
  aptitudeMockPercentile: number; // e.g. 78 (standardized test result)
  aptitudePracticeLevel: 'Beginner' | 'Intermediate' | 'Advanced';

  // Communication & Viva / Interview Evidence
  communicationRating: 'Needs Practice' | 'Average' | 'Good' | 'Excellent';
  vivaInterviewScore?: number; // e.g. 85 (technical viva & mock interview performance)
  gdParticipation: boolean; // group discussion & technical seminar participation
  englishProficiency: 'Basic' | 'Conversational' | 'Professional' | 'Fluent';
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
  projects: Array<{ title: string; tech: string; description: string }>;
  customSkillLevels: Record<string, number>; // e.g. "Java": 85, "OOP": 80, "DSA": 55, "SQL": 60, "Git": 75, "Spring Boot": 35
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
  gap: number; // required - current
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
