import {
  StudentProfile,
  StudentScores,
  AppSettings,
  HistorySnapshot,
  RoadmapTask,
} from '../types';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_SCORES,
  DEFAULT_WEIGHTS,
} from '../data/constants';

const STORAGE_KEY = 'skilltrack_student_system_v1';

export interface PersistedAppState {
  profile: StudentProfile;
  scores: StudentScores;
  settings: AppSettings;
  history: HistorySnapshot[];
  roadmapTasks: RoadmapTask[];
  lastSavedAt: string;
}

export const DEFAULT_ROADMAP_TASKS: RoadmapTask[] = [
  // 30 Days Phase (Immediate Gaps)
  {
    id: 'task_30_1',
    phase: '30_day',
    title: 'Spring Boot Fundamentals & REST APIs',
    description: 'Build 3 CRUD microservices with Spring Data JPA, H2/MySQL and Postman integration.',
    targetSkill: 'Spring Boot',
    priority: 'high',
    completed: false,
  },
  {
    id: 'task_30_2',
    phase: '30_day',
    title: 'DSA: Trees, Graphs & Dynamic Programming',
    description: 'Solve 40 targeted LeetCode Medium problems covering BFS/DFS, Binary Search & Memoization.',
    targetSkill: 'DSA',
    priority: 'high',
    completed: true,
  },
  {
    id: 'task_30_3',
    phase: '30_day',
    title: 'SQL Complex Queries & Indexing Drills',
    description: 'Practice multi-table JOINs, subqueries, GROUP BY HAVING, and analyze EXPLAIN query plans.',
    targetSkill: 'SQL',
    priority: 'medium',
    completed: false,
  },
  // 60 Days Phase (Applied Projects & Aptitude)
  {
    id: 'task_60_1',
    phase: '60_day',
    title: 'Full Stack End-to-End Capstone Deployment',
    description: 'Integrate React frontend with Spring Boot backend, containerize with Docker and push to GitHub.',
    targetSkill: 'Projects',
    priority: 'high',
    completed: false,
  },
  {
    id: 'task_60_2',
    phase: '60_day',
    title: 'Daily Quantitative & Logical Aptitude Mock Tests',
    description: 'Complete 15 timed sectional speed tests (Time & Work, Permutations, Syllogisms).',
    targetSkill: 'Aptitude',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'task_60_3',
    phase: '60_day',
    title: 'Git Collaboration & Clean PR Workflow',
    description: 'Master interactive rebasing, branch protection rules, squash merging, and semantic commit tagging.',
    targetSkill: 'Git',
    priority: 'medium',
    completed: true,
  },
  // 90 Days Phase (Interview Polish & Certification)
  {
    id: 'task_90_1',
    phase: '90_day',
    title: 'Technical Viva & Mock Interview Drills',
    description: 'Simulate 5 peer-to-peer technical rounds focusing on OOP patterns, threading, and system trade-offs.',
    targetSkill: 'Communication',
    priority: 'high',
    completed: false,
  },
  {
    id: 'task_90_2',
    phase: '90_day',
    title: 'Verified Industry Certification Assessment',
    description: 'Complete Oracle Certified Java Associate exam or AWS Certified Cloud Practitioner prep.',
    targetSkill: 'Exposure',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'task_90_3',
    phase: '90_day',
    title: 'Resume & Portfolio Audit with Placement Cell',
    description: 'Incorporate ATS-friendly keywords, quantifiable project metrics, and live demo URLs.',
    targetSkill: 'Career Match',
    priority: 'medium',
    completed: false,
  },
];

export const INITIAL_APP_STATE: PersistedAppState = {
  profile: INITIAL_STUDENT_PROFILE,
  scores: INITIAL_SCORES,
  settings: {
    darkMode: false,
    hapticFeedback: true,
    autoSave: true,
    weights: DEFAULT_WEIGHTS,
  },
  history: [
    {
      id: 'snap_initial',
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      label: 'Initial Mid-Semester Assessment',
      scores: {
        academic: 80,
        technical: 58,
        aptitude: 65,
        communication: 52,
        projects: 70,
        exposure: 40,
      },
      readinessScore: 63.3,
      category: 'Needs Improvement',
      targetRole: 'Java Developer',
      notes: 'Initial evaluation conducted during Java lab orientation.',
    },
    {
      id: 'snap_second',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      label: 'Post-Mini Project Sprint Review',
      scores: {
        academic: 82,
        technical: 65,
        aptitude: 72,
        communication: 58,
        projects: 80,
        exposure: 50,
      },
      readinessScore: 68.65,
      category: 'Needs Improvement',
      targetRole: 'Java Developer',
      notes: 'Updated after submitting SkillTrack project and completing SQL certification.',
    },
  ],
  roadmapTasks: DEFAULT_ROADMAP_TASKS,
  lastSavedAt: new Date().toISOString(),
};

export function loadAppState(): PersistedAppState {
  if (typeof window === 'undefined') return INITIAL_APP_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check system color scheme preference for dark mode
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
      const initial = {
        ...INITIAL_APP_STATE,
        settings: {
          ...INITIAL_APP_STATE.settings,
          darkMode: prefersDark,
        },
      };
      saveAppState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as Partial<PersistedAppState>;
    const mergedProfile: StudentProfile = {
      ...INITIAL_STUDENT_PROFILE,
      ...(parsed.profile || {}),
      factualData: {
        ...INITIAL_STUDENT_PROFILE.factualData,
        ...(parsed.profile?.factualData || {}),
      },
      uploadedCertificates: Array.isArray(parsed.profile?.uploadedCertificates)
        ? parsed.profile!.uploadedCertificates
        : INITIAL_STUDENT_PROFILE.uploadedCertificates,
    };

    return {
      profile: mergedProfile,
      scores: { ...INITIAL_SCORES, ...(parsed.scores || {}) },
      settings: {
        ...INITIAL_APP_STATE.settings,
        ...(parsed.settings || {}),
        weights: { ...DEFAULT_WEIGHTS, ...(parsed.settings?.weights || {}) },
      },
      history: Array.isArray(parsed.history) ? parsed.history : INITIAL_APP_STATE.history,
      roadmapTasks: Array.isArray(parsed.roadmapTasks) ? parsed.roadmapTasks : DEFAULT_ROADMAP_TASKS,
      lastSavedAt: parsed.lastSavedAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error reading localStorage for SkillTrack:', error);
    return INITIAL_APP_STATE;
  }
}

export function saveAppState(state: PersistedAppState): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify({
      ...state,
      lastSavedAt: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save SkillTrack state:', error);
  }
}

export function exportStateAsJson(state: PersistedAppState): void {
  const jsonStr = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `skilltrack_${state.profile.name.toLowerCase().replace(/\s+/g, '_')}_data.json`;
  a.click();
  URL.revokeObjectURL(url);
}
