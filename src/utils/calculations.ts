import {
  StudentScores,
  ScoringWeights,
  ReadinessResult,
  ScoreComponentInfo,
  ReadinessCategory,
  CareerRole,
  SkillGapItem,
} from '../types';

export const COMPONENT_METADATA: Record<
  keyof StudentScores,
  { label: string; shortLabel: string; description: string; color: string }
> = {
  academic: {
    label: 'Academic Performance',
    shortLabel: 'Academics',
    description: 'Degree percentage, CGPA, coursework & core syllabus grasp',
    color: '#3b82f6', // blue
  },
  technical: {
    label: 'Technical / Coding Skills',
    shortLabel: 'Tech / Coding',
    description: 'Data structures, algorithms, system architecture & problem solving',
    color: '#6366f1', // indigo
  },
  aptitude: {
    label: 'Aptitude',
    shortLabel: 'Aptitude',
    description: 'Quantitative problem solving, logical reasoning & verbal agility',
    color: '#0ea5e9', // sky
  },
  communication: {
    label: 'Communication',
    shortLabel: 'Communication',
    description: 'Technical articulation, active listening & interview presence',
    color: '#10b981', // emerald
  },
  projects: {
    label: 'Projects / Practical Work',
    shortLabel: 'Projects',
    description: 'Applied implementations, GitHub repositories & system design artifacts',
    color: '#f59e0b', // amber
  },
  exposure: {
    label: 'Certifications / Exposure',
    shortLabel: 'Exposure',
    description: 'Internship stints, competitive badges & verified industry credentials',
    color: '#8b5cf6', // purple
  },
};

export function calculateReadiness(
  scores: StudentScores,
  weights: ScoringWeights
): ReadinessResult {
  const keys: (keyof StudentScores)[] = [
    'academic',
    'technical',
    'aptitude',
    'communication',
    'projects',
    'exposure',
  ];

  let rawTotal = 0;
  const components: ScoreComponentInfo[] = [];

  for (const key of keys) {
    const score = Math.max(0, Math.min(100, scores[key] ?? 0));
    const weight = weights[key] ?? 0;
    const contribution = score * weight;
    rawTotal += contribution;

    components.push({
      key,
      label: COMPONENT_METADATA[key].label,
      shortLabel: COMPONENT_METADATA[key].shortLabel,
      description: COMPONENT_METADATA[key].description,
      color: COMPONENT_METADATA[key].color,
      score,
      weight,
      contribution: Number(contribution.toFixed(2)),
    });
  }

  const overallScore = Number(rawTotal.toFixed(2));

  let category: ReadinessCategory = 'Needs Attention';
  let categoryBadgeColor = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60';
  let categoryDesc = 'Significant gaps identified across key criteria. Requires immediate structured remediation.';

  if (overallScore >= 85) {
    category = 'Highly Prepared';
    categoryBadgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60';
    categoryDesc = 'Exceptional multi-factor readiness. Strong candidate for product engineering and high-tier placement roles.';
  } else if (overallScore >= 70) {
    category = 'Placement Ready';
    categoryBadgeColor = 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/60';
    categoryDesc = 'Good baseline alignment with placement eligibility criteria. Polishing specific technical areas will maximize offer conversion.';
  } else if (overallScore >= 50) {
    category = 'Needs Improvement';
    categoryBadgeColor = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60';
    categoryDesc = 'Moderate foundations present, but key competency gaps exist that may impede initial screening rounds.';
  }

  // Calculate estimated percentile based on normal distribution approximation
  const percentile = Math.min(99, Math.max(1, Math.round(overallScore * 0.95 + (overallScore > 75 ? 4 : 0))));

  // Sort strengths (highest score) and improvement areas (lowest score)
  const sortedByScore = [...components].sort((a, b) => b.score - a.score);
  const topStrengths = sortedByScore.slice(0, 3);
  const topImprovementAreas = [...components].sort((a, b) => a.score - b.score).slice(0, 3);

  return {
    overallScore,
    category,
    categoryBadgeColor,
    categoryDesc,
    percentile,
    components,
    topStrengths,
    topImprovementAreas,
  };
}

export function computeSkillGaps(
  careerRole: CareerRole,
  customSkillLevels: Record<string, number>,
  fallbackTechnicalScore: number
): SkillGapItem[] {
  return careerRole.skills.map((skill) => {
    // Current level is either explicitly assessed in customSkillLevels or inferred from fallbackTechnicalScore
    const current = customSkillLevels[skill.name] ?? Math.max(10, Math.min(100, Math.round(fallbackTechnicalScore * 0.9)));
    const required = skill.required;
    const gap = required - current;

    let status: 'Good' | 'Needs Improvement' | 'High Priority' = 'Good';
    if (gap > 20) {
      status = 'High Priority';
    } else if (gap > 0) {
      status = 'Needs Improvement';
    }

    return {
      skillName: skill.name,
      required,
      current,
      gap,
      status,
      category: skill.category,
      description: skill.description,
    };
  }).sort((a, b) => b.gap - a.gap); // largest gap first
}

export function calculateWhatIfDelta(
  currentScores: StudentScores,
  targetKey: keyof StudentScores,
  hypotheticalScore: number,
  weights: ScoringWeights
): {
  simulatedScore: number;
  delta: number;
  newReadiness: number;
  oldReadiness: number;
} {
  const currentReadiness = calculateReadiness(currentScores, weights).overallScore;
  const simulatedScores: StudentScores = {
    ...currentScores,
    [targetKey]: hypotheticalScore,
  };
  const simulatedReadiness = calculateReadiness(simulatedScores, weights).overallScore;
  const delta = Number((simulatedReadiness - currentReadiness).toFixed(2));

  return {
    simulatedScore: hypotheticalScore,
    delta,
    newReadiness: simulatedReadiness,
    oldReadiness: currentReadiness,
  };
}
