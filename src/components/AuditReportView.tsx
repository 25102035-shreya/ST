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
import { VIVA_QUESTIONS } from '../data/constants';
import { triggerHaptic } from '../utils/haptics';
import {
  Printer,
  HelpCircle,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  Download,
  Calendar,
  Building2,
  UserCheck,
} from 'lucide-react';

interface AuditReportViewProps {
  profile: StudentProfile;
  scores: StudentScores;
  weights: ScoringWeights;
  readiness: ReadinessResult;
  currentRole: CareerRole;
  skillGaps: SkillGapItem[];
  roadmapTasks: RoadmapTask[];
  hapticEnabled: boolean;
}

export const AuditReportView: React.FC<AuditReportViewProps> = ({
  profile,
  scores,
  weights,
  readiness,
  currentRole,
  skillGaps,
  roadmapTasks,
  hapticEnabled,
}) => {
  const [openVivaIndex, setOpenVivaIndex] = useState<number | null>(0);

  const handlePrint = () => {
    triggerHaptic('medium', hapticEnabled);
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden on print) */}
      <div className="no-print bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5" />
            Academic Audit & Viva Evaluation
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Official Placement Readiness Audit Report
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generated academic dossier formatted for laboratory review, viva voce, and career guidance files.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs shadow-indigo-500/20 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Save Report
          </button>
        </div>
      </div>

      {/* Printable Formal Academic Audit Report Container */}
      <div
        id="academic-audit-document"
        className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 rounded-2xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8"
      >
        {/* Document Header & Abstract */}
        <div className="text-center border-b-2 border-slate-900 dark:border-slate-100 pb-6">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Department of Computer Science & Engineering
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase mt-1">
            SKILLTRACK
          </h1>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Smart Student Success & Placement Readiness Audit Report
          </p>
          <p className="text-xs text-slate-500 italic mt-1">
            "From marks and skills to a clear improvement roadmap." — Java Laboratory Academic Mini Project
          </p>
        </div>

        {/* Student & Project Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Student Name:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{profile.name}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Roll / Registration No:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{profile.rollNo}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Branch / Semester:</span>
            <span className="font-bold text-slate-900 dark:text-white">{profile.branch} ({profile.semester})</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Target Role Track:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{currentRole.title}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">College / Institution:</span>
            <span className="font-bold text-slate-900 dark:text-white">{profile.college}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Assessment Date:</span>
            <span className="font-bold text-slate-900 dark:text-white">{currentDate}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Primary Technology:</span>
            <span className="font-bold text-slate-900 dark:text-white">Core Java / OOP</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Audit Status:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Verified Completed</span>
          </div>
        </div>

        {/* Section A: Multi-Factor Weighted Scoring Table */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-2 border-b border-slate-200 dark:border-slate-800 pb-1">
            Section A: 6-Factor Placement Performance Evaluation
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase">
                <tr>
                  <th className="p-2.5">Indicator Component</th>
                  <th className="p-2.5 text-center">Score (0-100)</th>
                  <th className="p-2.5 text-center">Weight</th>
                  <th className="p-2.5 text-center">Weighted Points</th>
                  <th className="p-2.5">Benchmark Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {readiness.components.map((c) => (
                  <tr key={c.key} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="p-2.5 font-sans font-semibold text-slate-900 dark:text-slate-100">
                      {c.label}
                    </td>
                    <td className="p-2.5 text-center font-bold">{c.score}</td>
                    <td className="p-2.5 text-center text-slate-500">
                      {Math.round(c.weight * 100)}%
                    </td>
                    <td className="p-2.5 text-center font-bold text-indigo-600 dark:text-indigo-400">
                      +{c.contribution}
                    </td>
                    <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400 text-[11px]">
                      {c.score >= 75
                        ? 'Strong asset for initial recruitment screening'
                        : c.score >= 60
                        ? 'Moderate alignment; targeted polish suggested'
                        : 'Significant deficit; prioritized remediation needed'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 dark:bg-slate-800/60 font-mono font-bold text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700">
                <tr>
                  <td className="p-2.5 font-sans">Overall Placement Readiness Total</td>
                  <td className="p-2.5 text-center">—</td>
                  <td className="p-2.5 text-center">100%</td>
                  <td className="p-2.5 text-center text-indigo-600 dark:text-indigo-400 text-sm">
                    {readiness.overallScore}
                  </td>
                  <td className="p-2.5 font-sans">
                    <span className={`px-2 py-0.5 rounded-full border text-[11px] ${readiness.categoryBadgeColor}`}>
                      {readiness.category}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Section B: Career Role Skill-Gap Matrix */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-2 border-b border-slate-200 dark:border-slate-800 pb-1">
            Section B: Career Skill-Gap Matrix for {currentRole.title}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase">
                <tr>
                  <th className="p-2">Required Skill</th>
                  <th className="p-2 text-center">Benchmark</th>
                  <th className="p-2 text-center">Student Level</th>
                  <th className="p-2 text-center">Deficit / Gap</th>
                  <th className="p-2">Evaluation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {skillGaps.map((item) => (
                  <tr key={item.skillName}>
                    <td className="p-2 font-sans font-semibold text-slate-900 dark:text-slate-100">
                      {item.skillName}
                    </td>
                    <td className="p-2 text-center">{item.required}</td>
                    <td className="p-2 text-center font-bold">{item.current}</td>
                    <td className="p-2 text-center">
                      {item.gap > 0 ? (
                        <span className="text-rose-600 dark:text-rose-400">-{item.gap}</span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">0 (Met)</span>
                      )}
                    </td>
                    <td className="p-2 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'High Priority'
                            ? 'bg-rose-100 text-rose-800'
                            : item.status === 'Needs Improvement'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section C: Improvement Trajectory & Roadmap Summary */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-2 border-b border-slate-200 dark:border-slate-800 pb-1">
            Section C: Prescribed Action Trajectory
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                Phase 1: Immediate 30 Days
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Prioritize top deficit areas: Spring Boot microservices, high-frequency LeetCode DSA patterns, and complex SQL indexing queries.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                Phase 2: Applied 60 Days
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Complete end-to-end full stack deployment, conduct timed quantitative aptitude mocks, and optimize GitHub code reviews.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                Phase 3: Interview 90 Days
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Conduct structured technical viva voce simulations, complete industry certifications (Oracle/AWS), and refine resume metrics.
              </p>
            </div>
          </div>
        </div>

        {/* Academic Laboratory Sign-Off Verification */}
        <div className="pt-6 border-t-2 border-slate-300 dark:border-slate-700">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-8 text-center">
            Laboratory Evaluation Signatures & Departmental Endorsement
          </h3>

          <div className="grid grid-cols-3 gap-6 text-center text-xs">
            <div className="space-y-1">
              <div className="h-12 border-b border-dashed border-slate-400 dark:border-slate-600 flex items-end justify-center pb-1">
                <span className="font-mono text-[11px] text-slate-400 italic">
                  {profile.name}
                </span>
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Candidate Signature
              </span>
              <span className="text-[10px] text-slate-500">Student Sign-off</span>
            </div>

            <div className="space-y-1">
              <div className="h-12 border-b border-dashed border-slate-400 dark:border-slate-600 flex items-end justify-center pb-1">
                <span className="font-mono text-[11px] text-slate-400 italic">
                  Prof. R. V. Kulkarni
                </span>
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Internal Project Guide
              </span>
              <span className="text-[10px] text-slate-500">Dept. of Computer Engineering</span>
            </div>

            <div className="space-y-1">
              <div className="h-12 border-b border-dashed border-slate-400 dark:border-slate-600 flex items-end justify-center pb-1">
                <span className="font-mono text-[11px] text-slate-400 italic">
                  Dr. S. M. Deshmukh
                </span>
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Head of Department (HOD)
              </span>
              <span className="text-[10px] text-slate-500">Academic Laboratory In-Charge</span>
            </div>
          </div>
        </div>
      </div>

      {/* Viva / Presentation Q&A Study Guide - Hidden on print */}
      <div className="no-print bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Viva Voce & Technical Defense Prep
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Master the rationale, OOP design patterns, and architectural justifications for your mini-project laboratory viva examination.
        </p>

        <div className="space-y-2.5">
          {VIVA_QUESTIONS.map((item, idx) => {
            const isOpen = openVivaIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/30"
              >
                <button
                  onClick={() => {
                    triggerHaptic('light', hapticEnabled);
                    setOpenVivaIndex(isOpen ? null : idx);
                  }}
                  className="w-full text-left p-3.5 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono flex items-center justify-center shrink-0">
                      Q{idx + 1}
                    </span>
                    <span>{item.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-3.5 pt-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 leading-relaxed font-sans">
                    <strong className="text-indigo-600 dark:text-indigo-400 font-semibold block mb-1">
                      Model Answer:
                    </strong>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
