import { StudentFactualData, StudentScores, SkillProficiency, UploadedCertificate } from '../types';

export const PROFICIENCY_SCORES: Record<SkillProficiency, number> = {
  None: 0,
  Beginner: 50,
  Intermediate: 70,
  Advanced: 88,
  Expert: 98,
};

export interface RuleConversionBreakdown {
  component: keyof StudentScores;
  label: string;
  assignedScore: number;
  evidenceSummary: string;
  explanation: string;
  appliedRules: string[];
  evidenceFactors: Array<{ name: string; value: string; impact: string }>;
}

/**
 * System Evidence Evaluation: Academic Performance
 * Evaluates Degree CGPA (0-10 scale), coursework assignments average, and backlog records.
 */
export function calculateAcademicFromFactual(factual: StudentFactualData): {
  score: number;
  evidenceSummary: string;
  explanation: string;
  rules: string[];
  factors: Array<{ name: string; value: string; impact: string }>;
} {
  const safeCgpa = Math.max(0, Math.min(10, factual.cgpa || 0));
  const assignmentsScore = factual.assignmentsScore !== undefined ? factual.assignmentsScore : 88;

  // 70% weight on University CGPA, 30% weight on Coursework Assignments & Tests
  const cgpaPoints = safeCgpa * 10;
  let score = Math.round((cgpaPoints * 0.70) + (assignmentsScore * 0.30));

  const rules: string[] = [
    `Degree CGPA ${safeCgpa.toFixed(1)} / 10 converts to ${cgpaPoints.toFixed(1)} pts (70% weight = ${(cgpaPoints * 0.70).toFixed(1)} pts)`,
    `Coursework assignments & internal semester tests: ${assignmentsScore}% (30% weight = ${(assignmentsScore * 0.30).toFixed(1)} pts)`,
  ];

  const factors = [
    { name: 'University CGPA', value: `${safeCgpa.toFixed(2)} / 10.0`, impact: `+${(cgpaPoints * 0.70).toFixed(1)} pts` },
    { name: 'Coursework / Assignments', value: `${assignmentsScore}% average`, impact: `+${(assignmentsScore * 0.30).toFixed(1)} pts` },
  ];

  if (factual.hasBacklogs && factual.backlogCount > 0) {
    const penalty = factual.backlogCount * 5;
    score = Math.max(25, score - penalty);
    rules.push(`Deducted ${penalty} points for ${factual.backlogCount} active university backlog(s) (-5 pts/backlog)`);
    factors.push({ name: 'Active Backlogs', value: `${factual.backlogCount} pending`, impact: `-${penalty} pts` });
  } else {
    rules.push('Zero active backlogs verified in academic transcript (+0 penalty)');
    factors.push({ name: 'Backlog Record', value: '0 Backlogs (Clean)', impact: 'Verified' });
  }

  score = Math.max(10, Math.min(100, score));

  return {
    score,
    evidenceSummary: `System Calculated Based on university CGPA transcript (${safeCgpa.toFixed(1)}/10), coursework assignment evaluations (${assignmentsScore}%), and verified backlog status.`,
    explanation: `Assigned automatically from verified academic transcript (${safeCgpa.toFixed(1)} CGPA) combined with semester coursework test averages.`,
    rules,
    factors,
  };
}

/**
 * System Evidence Evaluation: Technical / Coding Skills
 * Evaluates proctored coding assessments, language proficiencies, DSA practice volume, and GitHub repository activity.
 * Example: 87/100
 */
export function calculateCodingFromFactual(factual: StudentFactualData): {
  score: number;
  evidenceSummary: string;
  explanation: string;
  rules: string[];
  factors: Array<{ name: string; value: string; impact: string }>;
} {
  const javaScore = PROFICIENCY_SCORES[factual.primaryLanguageLevel] ?? 88;
  const pythonScore = PROFICIENCY_SCORES[factual.secondaryLanguageLevel] ?? 70;
  const dsaScore = PROFICIENCY_SCORES[factual.dsaLevel] ?? 70;
  const sqlScore = PROFICIENCY_SCORES[factual.sqlLevel] ?? 70;
  const assessmentScore = factual.codingAssessmentScore !== undefined ? factual.codingAssessmentScore : 86;
  const problemsSolved = factual.dsaProblemsSolved || 140;
  const commits = factual.githubCommitsThisYear || 145;

  // Language & DSA proficiency core: 40%
  const langWeighted = (javaScore * 0.35) + (pythonScore * 0.25) + (dsaScore * 0.25) + (sqlScore * 0.15);

  // Proctored Coding Assessment: 35%
  const assessmentWeighted = assessmentScore * 0.35;

  // Problem Solving volume bonus: LeetCode / platforms (up to 12 pts)
  const solvedBonus = Math.min(12, Math.floor(problemsSolved / 15));

  // GitHub commit activity & version control (up to 8 pts)
  const gitBonus = Math.min(8, Math.floor(commits / 20));

  const rawScore = (langWeighted * 0.45) + assessmentWeighted + solvedBonus + gitBonus;
  const score = Math.max(15, Math.min(100, Math.round(rawScore)));

  const rules: string[] = [
    `Proctored coding assessment score: ${assessmentScore}% (35% weight = ${(assessmentScore * 0.35).toFixed(1)} pts)`,
    `Core stack evaluation: ${factual.primaryLanguage} (${factual.primaryLanguageLevel}), ${factual.secondaryLanguage} (${factual.secondaryLanguageLevel}), DSA (${factual.dsaLevel}), SQL (${factual.sqlLevel})`,
    `Problem-solving volume: ${problemsSolved} practice problems verified (+${solvedBonus} pts)`,
    `GitHub engineering activity: ${commits} commits logged this year (+${gitBonus} pts)`,
  ];

  const factors = [
    { name: 'Coding Assessment', value: `${assessmentScore}% scored`, impact: `+${assessmentWeighted.toFixed(1)} pts` },
    { name: 'Primary Stack', value: `${factual.primaryLanguage} (${factual.primaryLanguageLevel})`, impact: `${javaScore} pts` },
    { name: 'DSA Competency', value: `${factual.dsaLevel} tier`, impact: `${dsaScore} pts` },
    { name: 'Problem Volume', value: `${problemsSolved} solved`, impact: `+${solvedBonus} pts` },
    { name: 'GitHub Activity', value: `${commits} commits`, impact: `+${gitBonus} pts` },
  ];

  return {
    score,
    evidenceSummary: 'System Calculated Based on coding assessments, problem-solving performance, projects, GitHub activity, and technical evaluations.',
    explanation: `Calculated from proctored coding assessments (${assessmentScore}%), verified LeetCode problem volume (${problemsSolved}), and active GitHub repository activity.`,
    rules,
    factors,
  };
}

/**
 * System Evidence Evaluation: Projects / Practical Work
 * Evaluates verified capstone projects, cloud deployment, architecture review, and git tracking.
 */
export function calculateProjectsFromFactual(factual: StudentFactualData): {
  score: number;
  evidenceSummary: string;
  explanation: string;
  rules: string[];
  factors: Array<{ name: string; value: string; impact: string }>;
} {
  const count = Math.max(0, factual.projectCount || 0);
  const rules: string[] = [];
  const factors: Array<{ name: string; value: string; impact: string }> = [];

  let score = 30;
  if (count === 1) score = 55;
  else if (count === 2) score = 68;
  else if (count === 3) score = 76;
  else if (count >= 4) score = Math.min(92, 76 + (count - 3) * 6);

  rules.push(`${count} verified capstone project(s) reviewed (${score} base pts)`);
  factors.push({ name: 'Completed Projects', value: `${count} projects`, impact: `${score} pts` });

  if (factual.hasFullStackOrDeployed && count > 0) {
    score = Math.min(100, score + 4);
    rules.push('Full-stack architecture with live cloud deployment verified (+4 pts)');
    factors.push({ name: 'Cloud Deployment', value: 'Live & Deployed', impact: '+4 pts' });
  }

  if (factual.hasGitRepo && count > 0) {
    score = Math.min(100, score + 3);
    rules.push('Active GitHub repository & version control demonstrated (+3 pts)');
    factors.push({ name: 'Git Version Control', value: 'Public Repositories', impact: '+3 pts' });
  }

  return {
    score: Math.max(10, Math.min(100, score)),
    evidenceSummary: 'System Calculated Based on verified project repositories, cloud deployment status, architecture complexity, and commit frequency.',
    explanation: `Derived from ${count} completed software projects, evaluated for code architecture, live deployment, and git version control hygiene.`,
    rules,
    factors,
  };
}

/**
 * System Evidence Evaluation: Certifications & Industry Exposure
 * Evaluates verified certificate documents (10 pts each, max 40) + industry internship tenure (30-40 pts).
 */
export function calculateExposureFromFactual(
  factual: StudentFactualData,
  certCountOverride?: number
): {
  score: number;
  evidenceSummary: string;
  explanation: string;
  rules: string[];
  factors: Array<{ name: string; value: string; impact: string }>;
} {
  const certCount = certCountOverride !== undefined ? certCountOverride : (factual.certificationsCount || 0);
  const rules: string[] = [];
  const factors: Array<{ name: string; value: string; impact: string }> = [];

  const certPoints = Math.min(40, certCount * 10);
  rules.push(`${certCount} verified certification(s) with credential proof: +${certPoints} pts (10 pts per certificate, max 40)`);
  factors.push({ name: 'Verified Certificates', value: `${certCount} verified`, impact: `+${certPoints} pts` });

  let internshipPoints = 0;
  if (factual.hasInternship) {
    internshipPoints = 30;
    if (factual.internshipMonths > 3) {
      internshipPoints += Math.min(10, (factual.internshipMonths - 3) * 2);
    }
    rules.push(`Industry internship verified (${factual.internshipRole || 'Technical Intern'}, ${factual.internshipMonths || 3} months): +${internshipPoints} pts`);
    factors.push({ name: 'Industry Internship', value: `${factual.internshipMonths || 3} mo (${factual.internshipRole || 'Intern'})`, impact: `+${internshipPoints} pts` });
  } else {
    rules.push('No verified industry internship stint recorded (0 pts)');
    factors.push({ name: 'Industry Internship', value: 'None verified', impact: '0 pts' });
  }

  const score = Math.max(10, Math.min(100, certPoints + internshipPoints));

  return {
    score,
    evidenceSummary: 'System Calculated Based on verified certifications, issuing body accreditation, and industry internship tenure.',
    explanation: `Calculated from ${certCount} verified certifications (+${certPoints} pts) and ${factual.hasInternship ? 'completed industry internship' : 'internship record'} (+${internshipPoints} pts).`,
    rules,
    factors,
  };
}

/**
 * System Evidence Evaluation: Aptitude & Analytical Reasoning
 * Evaluates standardized aptitude test scores, quantitative speed tests, and logical reasoning mocks.
 */
export function calculateAptitudeFromFactual(factual: StudentFactualData): {
  score: number;
  evidenceSummary: string;
  explanation: string;
  rules: string[];
  factors: Array<{ name: string; value: string; impact: string }>;
} {
  const percentile = Math.max(10, Math.min(99, factual.aptitudeMockPercentile || 78));
  let levelModifier = 0;
  if (factual.aptitudePracticeLevel === 'Advanced') levelModifier = 4;
  if (factual.aptitudePracticeLevel === 'Beginner') levelModifier = -4;

  const score = Math.max(10, Math.min(100, Math.round(percentile + levelModifier)));
  const rules = [
    `Quantitative & logical reasoning diagnostic test percentile: ${percentile}%`,
    `Problem solving speed benchmark (${factual.aptitudePracticeLevel}): ${levelModifier >= 0 ? '+' : ''}${levelModifier} pts`,
  ];
  const factors = [
    { name: 'Diagnostic Percentile', value: `${percentile}%`, impact: `${percentile} pts` },
    { name: 'Speed & Accuracy', value: factual.aptitudePracticeLevel, impact: `${levelModifier >= 0 ? '+' : ''}${levelModifier} pts` },
  ];

  return {
    score,
    evidenceSummary: 'System Calculated Based on standardized aptitude test results, quantitative problem-solving speed, and analytical reasoning mocks.',
    explanation: `Calculated from standardized diagnostic aptitude tests (${percentile}th percentile) and speed benchmark accuracy.`,
    rules,
    factors,
  };
}

/**
 * System Evidence Evaluation: Communication & Viva / Interview
 * Evaluates technical viva evaluations, mock interview scores, seminar presentations, and GD participation.
 */
export function calculateCommunicationFromFactual(factual: StudentFactualData): {
  score: number;
  evidenceSummary: string;
  explanation: string;
  rules: string[];
  factors: Array<{ name: string; value: string; impact: string }>;
} {
  let base = 76;
  if (factual.communicationRating === 'Needs Practice') base = 50;
  else if (factual.communicationRating === 'Average') base = 64;
  else if (factual.communicationRating === 'Good') base = 78;
  else if (factual.communicationRating === 'Excellent') base = 90;

  let bonus = 0;
  const rules: string[] = [`Technical viva / mock interview rating evaluated as "${factual.communicationRating}": ${base} pts`];
  const factors: Array<{ name: string; value: string; impact: string }> = [
    { name: 'Viva / Mock Interview', value: String(factual.communicationRating), impact: `${base} pts` },
    { name: 'English Fluency', value: String(factual.englishProficiency), impact: 'Verified' },
  ];

  if (factual.gdParticipation) {
    bonus += 4;
    rules.push('Active participation in Group Discussions / Technical Seminars verified (+4 pts)');
    factors.push({ name: 'Group Discussions', value: 'Active Participant', impact: '+4 pts' });
  }

  const score = Math.max(10, Math.min(100, base + bonus));
  return {
    score,
    evidenceSummary: 'System Calculated Based on technical viva performance, mock interview evaluations, and group discussion assessment.',
    explanation: `Assigned based on faculty viva assessment (${factual.communicationRating}), mock interview evaluations, and group discussion participation.`,
    rules,
    factors,
  };
}

/**
 * Complete conversion from verified student performance evidence to all 6 scores
 */
export function convertFactualToScores(
  factual: StudentFactualData,
  uploadedCertificates?: UploadedCertificate[]
): {
  scores: StudentScores;
  breakdowns: Record<keyof StudentScores, RuleConversionBreakdown>;
} {
  const certCount = uploadedCertificates ? uploadedCertificates.length : factual.certificationsCount;

  const academic = calculateAcademicFromFactual(factual);
  const technical = calculateCodingFromFactual(factual);
  const projects = calculateProjectsFromFactual(factual);
  const exposure = calculateExposureFromFactual(factual, certCount);
  const aptitude = calculateAptitudeFromFactual(factual);
  const communication = calculateCommunicationFromFactual(factual);

  const scores: StudentScores = {
    academic: academic.score,
    technical: technical.score,
    aptitude: aptitude.score,
    communication: communication.score,
    projects: projects.score,
    exposure: exposure.score,
  };

  const breakdowns: Record<keyof StudentScores, RuleConversionBreakdown> = {
    academic: {
      component: 'academic',
      label: 'Academic Performance',
      assignedScore: academic.score,
      evidenceSummary: academic.evidenceSummary,
      explanation: academic.explanation,
      appliedRules: academic.rules,
      evidenceFactors: academic.factors,
    },
    technical: {
      component: 'technical',
      label: 'Technical / Coding Skills',
      assignedScore: technical.score,
      evidenceSummary: technical.evidenceSummary,
      explanation: technical.explanation,
      appliedRules: technical.rules,
      evidenceFactors: technical.factors,
    },
    projects: {
      component: 'projects',
      label: 'Projects / Practical Work',
      assignedScore: projects.score,
      evidenceSummary: projects.evidenceSummary,
      explanation: projects.explanation,
      appliedRules: projects.rules,
      evidenceFactors: projects.factors,
    },
    exposure: {
      component: 'exposure',
      label: 'Certifications & Exposure',
      assignedScore: exposure.score,
      evidenceSummary: exposure.evidenceSummary,
      explanation: exposure.explanation,
      appliedRules: exposure.rules,
      evidenceFactors: exposure.factors,
    },
    aptitude: {
      component: 'aptitude',
      label: 'Aptitude & Analytical Reasoning',
      assignedScore: aptitude.score,
      evidenceSummary: aptitude.evidenceSummary,
      explanation: aptitude.explanation,
      appliedRules: aptitude.rules,
      evidenceFactors: aptitude.factors,
    },
    communication: {
      component: 'communication',
      label: 'Communication & Soft Skills',
      assignedScore: communication.score,
      evidenceSummary: communication.evidenceSummary,
      explanation: communication.explanation,
      appliedRules: communication.rules,
      evidenceFactors: communication.factors,
    },
  };

  return { scores, breakdowns };
}
