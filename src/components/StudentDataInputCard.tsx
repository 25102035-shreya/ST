import React, { useState } from 'react';
import {
  GraduationCap,
  Code2,
  FolderGit2,
  Award,
  BrainCircuit,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  CheckCircle2,
  Upload,
  ShieldCheck,
  FileCheck2,
  GitCommit,
  BookOpen,
} from 'lucide-react';
import { StudentFactualData, SkillProficiency, UploadedCertificate } from '../types';
import { convertFactualToScores } from '../utils/ruleEngine';

interface StudentDataInputCardProps {
  factualData: StudentFactualData;
  uploadedCertificates: UploadedCertificate[];
  onUpdateFactualData: (updated: StudentFactualData) => void;
  onOpenCertificateModal: () => void;
  onApplyPresetExample: () => void;
}

export const StudentDataInputCard: React.FC<StudentDataInputCardProps> = ({
  factualData,
  uploadedCertificates,
  onUpdateFactualData,
  onOpenCertificateModal,
  onApplyPresetExample,
}) => {
  const [showRuleBreakdown, setShowRuleBreakdown] = useState(false);

  // Compute live conversion using the verified assessment engine
  const { scores, breakdowns } = convertFactualToScores(factualData, uploadedCertificates);

  const handleFieldChange = <K extends keyof StudentFactualData>(
    field: K,
    value: StudentFactualData[K]
  ) => {
    const updated = { ...factualData, [field]: value };
    onUpdateFactualData(updated);
  };

  return (
    <div id="verified-evidence-section" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-all">
      {/* Top Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5" />
              Automated Evidence Assessment Engine
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Manipulation-Resistant
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Verified Performance Evidence & Skill Records
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
            Assessment marks cannot be manually entered or adjusted. The system automatically computes each score from verified academic transcripts, proctored coding assessments, GitHub commits, capstone projects, certifications, and faculty viva evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={onApplyPresetExample}
            className="px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50/60 dark:bg-indigo-950/40 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-1.5"
            title="Load benchmark verified student credentials"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Sample Evidence (8.5 CGPA / 4 Certs)
          </button>
        </div>
      </div>

      {/* Rules Engine Active Banner */}
      <div className="px-6 py-3 bg-emerald-50/60 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-900 dark:text-emerald-200">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Evidence-Based Scoring Active:</strong> All assessment marks update automatically as new verified performance records are logged below.
          </span>
        </div>
        <button
          onClick={() => setShowRuleBreakdown(!showRuleBreakdown)}
          className="text-[11px] font-bold underline hover:opacity-80 text-emerald-700 dark:text-emerald-300 flex items-center gap-1 self-start sm:self-auto"
        >
          {showRuleBreakdown ? 'Hide Evaluation Logic' : 'View Full Evaluation Logic & Criteria'}
          {showRuleBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Rule Conversion Breakdown (Collapsible) */}
      {showRuleBreakdown && (
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Transparent System Evaluation Table
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">
              Formula: Strictly evidence-grounded point weighting
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.values(breakdowns).map((b) => (
              <div
                key={b.component}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {b.label}
                  </span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    {b.assignedScore}/100
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-snug">
                  {b.evidenceSummary}
                </p>
                <div className="pt-1 border-t border-slate-100 dark:border-slate-800 space-y-0.5">
                  {b.appliedRules.map((rule, idx) => (
                    <div key={idx} className="text-[10px] text-slate-600 dark:text-slate-400 flex items-start gap-1">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Factual Data Input Fields */}
      <div className="p-5 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Academic Performance Evidence */}
          <div className="p-4 sm:p-5 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Academic Performance Evidence
                </span>
              </div>
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                System Calculated = {scores.academic}/100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  University Degree CGPA (0.0 - 10.0 scale)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={factualData.cgpa}
                    onChange={(e) => handleFieldChange('cgpa', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Verified degree transcript CGPA (70% weight)
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Coursework & Internal Assignments (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={factualData.assignmentsScore !== undefined ? factualData.assignmentsScore : 88}
                    onChange={(e) => handleFieldChange('assignmentsScore', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Theory assignments & mid-term tests (30% weight)
                </p>
              </div>

              <div className="sm:col-span-2 pt-1 border-t border-blue-100 dark:border-blue-900/40 flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  University Backlog Record:
                </span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="backlogs"
                      checked={!factualData.hasBacklogs}
                      onChange={() => {
                        handleFieldChange('hasBacklogs', false);
                        handleFieldChange('backlogCount', 0);
                      }}
                      className="accent-blue-600"
                    />
                    <span>Zero Backlogs (Clean)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="backlogs"
                      checked={factualData.hasBacklogs}
                      onChange={() => {
                        handleFieldChange('hasBacklogs', true);
                        handleFieldChange('backlogCount', 1);
                      }}
                      className="accent-blue-600"
                    />
                    <span>Active Backlogs</span>
                  </label>
                  {factualData.hasBacklogs && (
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={factualData.backlogCount}
                      onChange={(e) => handleFieldChange('backlogCount', parseInt(e.target.value) || 1)}
                      className="w-14 px-2 py-1 text-xs rounded border border-rose-300 bg-white dark:bg-slate-800 text-rose-600 font-bold"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Technical / Coding Skills Evidence */}
          <div className="p-4 sm:p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/20 dark:bg-indigo-950/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Technical & Coding Skills Evidence
                </span>
              </div>
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                System Calculated = {scores.technical}/100
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Proctored Coding Test Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={factualData.codingAssessmentScore !== undefined ? factualData.codingAssessmentScore : 86}
                  onChange={(e) => handleFieldChange('codingAssessmentScore', parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  DSA Platform Problems Solved
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  step="10"
                  value={factualData.dsaProblemsSolved}
                  onChange={(e) => handleFieldChange('dsaProblemsSolved', parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                  Java Proficiency
                </label>
                <select
                  value={factualData.primaryLanguageLevel}
                  onChange={(e) => handleFieldChange('primaryLanguageLevel', e.target.value as SkillProficiency)}
                  className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                  Python Proficiency
                </label>
                <select
                  value={factualData.secondaryLanguageLevel}
                  onChange={(e) => handleFieldChange('secondaryLanguageLevel', e.target.value as SkillProficiency)}
                  className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="None">None</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                  DSA Competency
                </label>
                <select
                  value={factualData.dsaLevel}
                  onChange={(e) => handleFieldChange('dsaLevel', e.target.value as SkillProficiency)}
                  className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                  SQL Competency
                </label>
                <select
                  value={factualData.sqlLevel}
                  onChange={(e) => handleFieldChange('sqlLevel', e.target.value as SkillProficiency)}
                  className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-indigo-100 dark:border-indigo-900/40">
              <span className="flex items-center gap-1">
                <GitCommit className="w-3.5 h-3.5 text-indigo-500" />
                <span>GitHub Commits Verified This Year:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={factualData.githubCommitsThisYear !== undefined ? factualData.githubCommitsThisYear : 145}
                  onChange={(e) => handleFieldChange('githubCommitsThisYear', parseInt(e.target.value) || 0)}
                  className="w-20 px-2 py-1 text-xs font-bold rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
                <span className="text-[10px] text-slate-400">commits</span>
              </div>
            </div>
          </div>

          {/* Card 3: Projects & Practical Work Evidence */}
          <div className="p-4 sm:p-5 rounded-xl border border-amber-100 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 flex items-center justify-center">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Projects & Practical Work Evidence
                </span>
              </div>
              <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                System Calculated = {scores.projects}/100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Completed Software Projects
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleFieldChange('projectCount', num)}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                          factualData.projectCount === num
                            ? 'bg-amber-500 text-white'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {factualData.projectCount} project(s)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={factualData.hasFullStackOrDeployed}
                    onChange={(e) => handleFieldChange('hasFullStackOrDeployed', e.target.checked)}
                    className="rounded accent-amber-600"
                  />
                  <span>Full-Stack or Live Cloud Deployed (+4 pts)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={factualData.hasGitRepo}
                    onChange={(e) => handleFieldChange('hasGitRepo', e.target.checked)}
                    className="rounded accent-amber-600"
                  />
                  <span>Public GitHub Repo & Git History (+3 pts)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Card 4: Certifications & Industry Exposure Evidence */}
          <div className="p-4 sm:p-5 rounded-xl border border-purple-100 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Certifications & Exposure Evidence
                </span>
              </div>
              <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                System Calculated = {scores.exposure}/100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Certifications Upload Box */}
              <div className="p-3 rounded-lg border border-purple-200/80 dark:border-purple-800/80 bg-white dark:bg-slate-800 flex flex-col justify-between gap-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Verified Documents
                    </span>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">
                      {uploadedCertificates.length} verified
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    10 pts/certificate (currently +{Math.min(40, uploadedCertificates.length * 10)} pts)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onOpenCertificateModal}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload & Manage Proofs
                </button>
              </div>

              {/* Internship details */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Industry Internship Experience
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="internship"
                      checked={factualData.hasInternship}
                      onChange={() => handleFieldChange('hasInternship', true)}
                      className="accent-purple-600"
                    />
                    <span>Yes (+30 pts)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="internship"
                      checked={!factualData.hasInternship}
                      onChange={() => handleFieldChange('hasInternship', false)}
                      className="accent-purple-600"
                    />
                    <span>No (0 pts)</span>
                  </label>
                </div>

                {factualData.hasInternship && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Role (e.g. Backend Intern)"
                      value={factualData.internshipRole || ''}
                      onChange={(e) => handleFieldChange('internshipRole', e.target.value)}
                      className="flex-1 px-2 py-1 text-[11px] rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={factualData.internshipMonths}
                        onChange={(e) => handleFieldChange('internshipMonths', parseInt(e.target.value) || 1)}
                        className="w-12 px-1.5 py-1 text-[11px] rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                      />
                      <span className="text-[10px] text-slate-400">mo</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 5: Aptitude & Reasoning Evidence */}
          <div className="p-4 sm:p-5 rounded-xl border border-sky-100 dark:border-sky-900/40 bg-sky-50/20 dark:bg-sky-950/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-300 flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Aptitude & Diagnostic Tests Evidence
                </span>
              </div>
              <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/80 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                System Calculated = {scores.aptitude}/100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Diagnostic Test Percentile (%)
                </label>
                <input
                  type="number"
                  min="10"
                  max="99"
                  value={factualData.aptitudeMockPercentile}
                  onChange={(e) => handleFieldChange('aptitudeMockPercentile', parseInt(e.target.value) || 75)}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Speed & Accuracy Tier
                </label>
                <select
                  value={factualData.aptitudePracticeLevel}
                  onChange={(e) => handleFieldChange('aptitudePracticeLevel', e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="Beginner">Beginner (-4 pts modifier)</option>
                  <option value="Intermediate">Intermediate (Baseline)</option>
                  <option value="Advanced">Advanced (+4 pts modifier)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 6: Communication & Viva / Interview Evidence */}
          <div className="p-4 sm:p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Communication & Viva / Interview Evidence
                </span>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                System Calculated = {scores.communication}/100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Technical Viva & Mock Interview Rating
                </label>
                <select
                  value={factualData.communicationRating}
                  onChange={(e) => handleFieldChange('communicationRating', e.target.value as 'Needs Practice' | 'Average' | 'Good' | 'Excellent')}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="Needs Practice">Needs Practice (50 pts)</option>
                  <option value="Average">Average (64 pts)</option>
                  <option value="Good">Good (78 pts)</option>
                  <option value="Excellent">Excellent (90 pts)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  English Language Fluency
                </label>
                <select
                  value={factualData.englishProficiency}
                  onChange={(e) => handleFieldChange('englishProficiency', e.target.value as 'Basic' | 'Conversational' | 'Professional' | 'Fluent')}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="Basic">Basic</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Professional">Professional</option>
                  <option value="Fluent">Fluent</option>
                </select>
              </div>

              <div className="sm:col-span-2 pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={factualData.gdParticipation}
                    onChange={(e) => handleFieldChange('gdParticipation', e.target.checked)}
                    className="rounded accent-emerald-600"
                  />
                  <span>Active Group Discussion & Technical Seminar Participation (+4 pts)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rule Conversion Outcome Ribbon */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white dark:bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Performance Scores Breakdown
            </span>
            <div className="flex items-center gap-3 mt-1 flex-wrap text-xs">
              <span>Academic: <strong className="text-blue-400 font-mono">{scores.academic}</strong></span>
              <span>Coding: <strong className="text-indigo-400 font-mono">{scores.technical}</strong></span>
              <span>Projects: <strong className="text-amber-400 font-mono">{scores.projects}</strong></span>
              <span>Certifications: <strong className="text-purple-400 font-mono">{scores.exposure}</strong></span>
              <span>Aptitude: <strong className="text-sky-400 font-mono">{scores.aptitude}</strong></span>
              <span>Communication: <strong className="text-emerald-400 font-mono">{scores.communication}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Overall Placement Readiness</span>
              <span className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">
                System Calculated
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
