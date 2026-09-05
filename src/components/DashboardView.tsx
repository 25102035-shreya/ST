import React, { useState } from 'react';
import {
  StudentProfile,
  StudentScores,
  ScoringWeights,
  ReadinessResult,
  CareerRole,
  SkillGapItem,
  RoadmapTask,
} from '../types';
import { CAREER_ROLES, PRESETS } from '../data/constants';
import { SystemScoreCard } from './SystemScoreCard';
import { calculateWhatIfDelta } from '../utils/calculations';
import { triggerHaptic } from '../utils/haptics';
import { convertFactualToScores } from '../utils/ruleEngine';
import {
  Sparkles,
  Award,
  AlertTriangle,
  TrendingUp,
  Target,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  FileText,
  BookmarkCheck,
  CheckSquare,
  Square,
  HelpCircle,
  ShieldCheck,
  Cpu,
  FileCheck2,
} from 'lucide-react';
import { ActiveTab } from './Header';
import { StudentDataInputCard } from './StudentDataInputCard';
import { StudentFactualData } from '../types';

interface DashboardViewProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  scores: StudentScores;
  setScores: React.Dispatch<React.SetStateAction<StudentScores>>;
  weights: ScoringWeights;
  readiness: ReadinessResult;
  currentRole: CareerRole;
  skillGaps: SkillGapItem[];
  roadmapTasks: RoadmapTask[];
  onToggleTask: (taskId: string) => void;
  onSaveSnapshot: (label?: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  hapticEnabled: boolean;
  onOpenCertificateModal: () => void;
  onUpdateFactualData: (updated: StudentFactualData) => void;
  onApplyPresetExample: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  setProfile,
  scores,
  setScores,
  weights,
  readiness,
  currentRole,
  skillGaps,
  roadmapTasks,
  onToggleTask,
  onSaveSnapshot,
  setActiveTab,
  hapticEnabled,
  onOpenCertificateModal,
  onUpdateFactualData,
  onApplyPresetExample,
}) => {
  const [presetNotice, setPresetNotice] = useState<string | null>(null);

  // Compute live transparent rule engine breakdowns for each component
  const { breakdowns } = convertFactualToScores(
    profile.factualData,
    profile.uploadedCertificates || []
  );

  // Mini What-If slider local state
  const [whatIfKey, setWhatIfKey] = useState<keyof StudentScores>('technical');
  const [whatIfSimulatedVal, setWhatIfSimulatedVal] = useState<number>(
    Math.min(100, scores.technical + 15)
  );

  const whatIfDeltaResult = calculateWhatIfDelta(
    scores,
    whatIfKey,
    whatIfSimulatedVal,
    weights
  );

  const handleApplyPreset = (presetId: string) => {
    const found = PRESETS.find((p) => p.id === presetId);
    if (!found) return;

    triggerHaptic('success', hapticEnabled);
    const preservedName = profile.name; // STRICT REQUIREMENT: Presets won't overwrite name

    setProfile((prev) => ({
      ...prev,
      name: preservedName, // Keep user's name
      branch: found.branch,
      targetRole: found.targetRole,
      customSkillLevels: {
        ...prev.customSkillLevels,
        ...found.skillLevels,
      },
    }));

    setScores({ ...found.scores });
    setWhatIfSimulatedVal(Math.min(100, found.scores[whatIfKey] + 15));

    setPresetNotice(`Preset applied! Kept your name: "${preservedName}"`);
    setTimeout(() => {
      setPresetNotice(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Editable Student Core Header (Name, Branch, Role) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
              Student Profile Card
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <span>{profile.name || 'Student Name'}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                {profile.rollNo}
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {profile.branch} • {profile.semester}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                triggerHaptic('light', hapticEnabled);
                onSaveSnapshot('Manual Dashboard Snapshot');
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
              title="Save current score state to history log"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-indigo-500" />
              Save Snapshot
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs shadow-indigo-500/20 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Audit Report
            </button>
          </div>
        </div>

        {/* Quick Edit Fields: Name, Branch, Target Role */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
          <div>
            <label htmlFor="student-name-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Student Name
            </label>
            <input
              id="student-name-input"
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter student full name"
            />
          </div>

          <div>
            <label htmlFor="student-branch-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Academic Branch
            </label>
            <input
              id="student-branch-input"
              type="text"
              value={profile.branch}
              onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. Computer Science & Engineering"
            />
          </div>

          <div>
            <label htmlFor="target-role-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Career Role
            </label>
            <select
              id="target-role-select"
              value={profile.targetRole}
              onChange={(e) => {
                triggerHaptic('medium', hapticEnabled);
                setProfile({ ...profile, targetRole: e.target.value as any });
              }}
              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {CAREER_ROLES.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title} ({role.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preset Selector with explicit "Won't overwrite name" indicator */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick Presets
              <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                (Won't overwrite your custom name: <strong className="text-slate-700 dark:text-slate-200">{profile.name}</strong>)
              </span>
            </span>
          </div>

          {presetNotice && (
            <div className="mb-2.5 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{presetNotice}</span>
            </div>
          )}

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset.id)}
                className="shrink-0 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 text-left transition-all text-xs"
                title={preset.subtitle}
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  {preset.title.split('(')[0].trim()}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate max-w-[170px]">
                  {preset.subtitle}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Hero Placement Readiness Analysis & Verdict Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Score Gauge */}
          <div className="lg:col-span-5 flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Overall Placement Readiness
            </span>
            <div className="relative my-2 flex items-center justify-center">
              <div className="w-36 h-36 rounded-full border-8 border-indigo-100 dark:border-slate-700 flex flex-col items-center justify-center relative">
                <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {readiness.overallScore}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                  / 100 PTS
                </span>
              </div>
            </div>

            {/* Category Verdict Badge */}
            <div className={`mt-2 px-3.5 py-1 rounded-full border text-xs font-bold ${readiness.categoryBadgeColor}`}>
              {readiness.category}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed">
              {readiness.categoryDesc}
            </p>
          </div>

          {/* Formula Breakdown & Benchmarks */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Transparent Scoring Formula
                </span>
                <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                  Normalized 0-100
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-100/70 dark:bg-slate-800/60 text-[11px] font-mono text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200/50 dark:border-slate-700/50">
                Overall = (Academic × 0.25) + (Tech × 0.25) + (Apt × 0.15) + (Comm × 0.15) + (Projects × 0.10) + (Exposure × 0.10)
                <div className="mt-1 text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-700 pt-1 font-sans text-[11px]">
                  = ({scores.academic}×0.25) + ({scores.technical}×0.25) + ({scores.aptitude}×0.15) + ({scores.communication}×0.15) + ({scores.projects}×0.10) + ({scores.exposure}×0.10)
                  = <strong className="text-indigo-600 dark:text-indigo-400">{readiness.overallScore}</strong>
                </div>
              </div>
            </div>

            {/* Strengths and Improvement Areas Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl border border-emerald-100 dark:border-emerald-950 bg-emerald-50/40 dark:bg-emerald-950/20">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  Top Strengths
                </div>
                <ul className="space-y-1.5">
                  {readiness.topStrengths.map((item, idx) => (
                    <li key={item.key} className="text-xs flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span className="truncate max-w-[140px] font-medium">
                        {idx + 1}. {item.shortLabel}
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {item.score}/100
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl border border-rose-100 dark:border-rose-950 bg-rose-50/40 dark:bg-rose-950/20">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Priority Improvement Areas
                </div>
                <ul className="space-y-1.5">
                  {readiness.topImprovementAreas.map((item, idx) => (
                    <li key={item.key} className="text-xs flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span className="truncate max-w-[140px] font-medium">
                        {idx + 1}. {item.shortLabel}
                      </span>
                      <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">
                        {item.score}/100
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Predefined Evidence Assessment Engine & Factual Data Input */}
      <StudentDataInputCard
        factualData={profile.factualData}
        uploadedCertificates={profile.uploadedCertificates || []}
        onUpdateFactualData={onUpdateFactualData}
        onOpenCertificateModal={onOpenCertificateModal}
        onApplyPresetExample={onApplyPresetExample}
      />

      {/* 4. All 6 System-Calculated Assessment Scores (Read-only / Evidence-Based) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Read-Only • System-Calculated Marks
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <span>Automated Assessment Scores</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                (Based on Verified Evidence)
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manual score manipulation is disabled. Marks are automatically derived from test results, coding assessments, projects, GitHub commits, certifications, and viva evaluations.
            </p>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light', hapticEnabled);
              document.getElementById('verified-evidence-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="self-start sm:self-auto text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shrink-0"
            title="Update factual credentials to re-calculate scores"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Update Verified Evidence</span>
          </button>
        </div>

        {/* Responsive Grid for the 6 System-Calculated Read-Only Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SystemScoreCard
            id="academic"
            label="Academic Performance"
            shortLabel="Academics"
            weight={weights.academic}
            value={scores.academic}
            color="#3b82f6"
            description="Coursework, degree CGPA, theory tests & syllabus grasp"
            breakdown={breakdowns.academic}
            hapticEnabled={hapticEnabled}
            onNavigateToEvidence={() => {
              document.getElementById('verified-evidence-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          <SystemScoreCard
            id="technical"
            label="Technical / Coding Skills"
            shortLabel="Tech / Coding"
            weight={weights.technical}
            value={scores.technical}
            color="#6366f1"
            description="Algorithms, Java/Python, DSA test score & GitHub commits"
            breakdown={breakdowns.technical}
            hapticEnabled={hapticEnabled}
            onNavigateToEvidence={() => {
              document.getElementById('verified-evidence-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          <SystemScoreCard
            id="projects"
            label="Projects / Practical Work"
            shortLabel="Projects"
            weight={weights.projects}
            value={scores.projects}
            color="#f59e0b"
            description="Completed software projects, live deployments & Git repository"
            breakdown={breakdowns.projects}
            hapticEnabled={hapticEnabled}
            onNavigateToEvidence={() => {
              document.getElementById('verified-evidence-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          <SystemScoreCard
            id="exposure"
            label="Certifications / Exposure"
            shortLabel="Exposure"
            weight={weights.exposure}
            value={scores.exposure}
            color="#8b5cf6"
            description="Verified certificates, industry internships & practical experience"
            breakdown={breakdowns.exposure}
            hapticEnabled={hapticEnabled}
            onNavigateToEvidence={onOpenCertificateModal}
          />

          <SystemScoreCard
            id="aptitude"
            label="Aptitude"
            shortLabel="Aptitude"
            weight={weights.aptitude}
            value={scores.aptitude}
            color="#0ea5e9"
            description="Diagnostic test percentile, speed & quantitative reasoning"
            breakdown={breakdowns.aptitude}
            hapticEnabled={hapticEnabled}
            onNavigateToEvidence={() => {
              document.getElementById('verified-evidence-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          <SystemScoreCard
            id="communication"
            label="Communication"
            shortLabel="Communication"
            weight={weights.communication}
            value={scores.communication}
            color="#10b981"
            description="Faculty viva evaluation, mock interview & discussion participation"
            breakdown={breakdowns.communication}
            hapticEnabled={hapticEnabled}
            onNavigateToEvidence={() => {
              document.getElementById('verified-evidence-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      </div>

      {/* 4. Career Skill Gap & What-If Quick Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Career Skill Gap Quick Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Career Skill Gap Preview
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                {currentRole.title}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Compares requirements with your assessed skills. Formula: <code className="text-indigo-600 dark:text-indigo-400 font-mono">Gap = Required - Current</code>.
            </p>

            {/* Top 3 Gaps */}
            <div className="space-y-2 mb-4">
              {skillGaps.slice(0, 3).map((gap) => (
                <div
                  key={gap.skillName}
                  className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {gap.skillName}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      Target: {gap.required} | Current: {gap.current}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        gap.status === 'High Priority'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : gap.status === 'Needs Improvement'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {gap.gap > 0 ? `-${gap.gap} pts` : 'Good'}
                    </span>
                    <span className="block text-[10px] font-medium text-slate-400">
                      {gap.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('career_gap')}
            className="w-full py-2 px-3 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open Detailed Skill Gap Matrix ({skillGaps.length} skills)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* What-If Simulator Quick Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                What-If Simulator Quick Widget
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 font-mono">
                Hypothetical Test
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Explore hypothetical score changes without permanently modifying your profile.
            </p>

            {/* Select score component to simulate */}
            <div className="space-y-3 mb-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 shrink-0">
                  Target:
                </label>
                <select
                  value={whatIfKey}
                  onChange={(e) => {
                    const nextKey = e.target.value as keyof StudentScores;
                    setWhatIfKey(nextKey);
                    setWhatIfSimulatedVal(Math.min(100, scores[nextKey] + 15));
                  }}
                  className="w-full text-xs font-medium py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="technical">Technical / Coding Skills (Weight: 25%)</option>
                  <option value="academic">Academic Performance (Weight: 25%)</option>
                  <option value="aptitude">Aptitude (Weight: 15%)</option>
                  <option value="communication">Communication (Weight: 15%)</option>
                  <option value="projects">Projects / Practical Work (Weight: 10%)</option>
                  <option value="exposure">Exposure / Certifications (Weight: 10%)</option>
                </select>
              </div>

              {/* Slider for simulated value */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    Current: <strong className="text-slate-900 dark:text-slate-100">{scores[whatIfKey]}</strong>
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">
                    Simulated: {whatIfSimulatedVal}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={whatIfSimulatedVal}
                  onChange={(e) => {
                    triggerHaptic('light', hapticEnabled);
                    setWhatIfSimulatedVal(Number(e.target.value));
                  }}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 accent-amber-500"
                />
              </div>

              {/* Real-time Delta Impact Banner */}
              <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium block">
                    Readiness impact:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {whatIfDeltaResult.oldReadiness} → {whatIfDeltaResult.newReadiness} pts
                  </span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded font-bold text-xs font-mono bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                    {whatIfDeltaResult.delta >= 0 ? `+${whatIfDeltaResult.delta}` : whatIfDeltaResult.delta} pts
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic('light', hapticEnabled);
                setActiveTab('what_if');
              }}
              className="flex-1 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              title="Open full scenario modeling simulator"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Full What-If Analysis</span>
            </button>
            <button
              onClick={() => {
                triggerHaptic('light', hapticEnabled);
                document.getElementById('verified-evidence-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors shrink-0"
              title="Add verified test results or certificates to qualify"
            >
              Log Evidence
            </button>
          </div>
        </div>
      </div>

      {/* 5. Action Roadmap Quick Checklist */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Personalized Action Roadmap (30-60-90 Days)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immediate milestones recommended to bridge prioritized skill gaps.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('roadmap')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({roadmapTasks.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {roadmapTasks.slice(0, 3).map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all text-xs flex flex-col justify-between ${
                task.completed
                  ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 opacity-80'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {task.title}
                  </span>
                  {task.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {task.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                <span className="font-mono px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {task.targetSkill}
                </span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {task.phase.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Quick Launch Strip for Lab Viva Guide & OOP Audit */}
      <div>
        <div
          onClick={() => setActiveTab('audit')}
          className="cursor-pointer p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors group shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                Lab Viva Q&A & Sign-Off Documentation
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">
                Core Java OOP principles, calculation transparency & placement evaluation guide
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
        </div>
      </div>
    </div>
  );
};
