import React, { useState } from 'react';
import { StudentScores, ScoringWeights, ReadinessResult } from '../types';
import { calculateReadiness } from '../utils/calculations';
import { triggerHaptic } from '../utils/haptics';
import {
  Sparkles,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Zap,
  Info,
} from 'lucide-react';

interface WhatIfSimulatorViewProps {
  currentScores: StudentScores;
  weights: ScoringWeights;
  currentReadiness: ReadinessResult;
  hapticEnabled: boolean;
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({
  currentScores,
  weights,
  currentReadiness,
  hapticEnabled,
}) => {
  // Local simulated copy of the 6 scores
  const [simulatedScores, setSimulatedScores] = useState<StudentScores>({
    ...currentScores,
    technical: Math.min(100, currentScores.technical + 15),
  });

  const simulatedReadiness = calculateReadiness(simulatedScores, weights);
  const delta = Number(
    (simulatedReadiness.overallScore - currentReadiness.overallScore).toFixed(2)
  );

  const handleSimulatedChange = (key: keyof StudentScores, val: number) => {
    triggerHaptic('light', hapticEnabled);
    setSimulatedScores((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(100, val)),
    }));
  };

  const handleReset = () => {
    triggerHaptic('medium', hapticEnabled);
    setSimulatedScores({ ...currentScores });
  };

  // ROI / Biggest Lever Analysis: Impact of +10 points in each category
  const levers = (
    [
      'technical',
      'academic',
      'aptitude',
      'communication',
      'projects',
      'exposure',
    ] as (keyof StudentScores)[]
  ).map((key) => {
    const weight = weights[key];
    const gainPer10Pts = Number((10 * weight).toFixed(2));
    const currentVal = currentScores[key];
    const maxHeadroom = 100 - currentVal;
    const maxPotentialGain = Number((maxHeadroom * weight).toFixed(2));

    let label = 'Technical Coding';
    if (key === 'academic') label = 'Academic Performance';
    if (key === 'aptitude') label = 'Aptitude Tests';
    if (key === 'communication') label = 'Communication';
    if (key === 'projects') label = 'Capstone Projects';
    if (key === 'exposure') label = 'Certifications / Exposure';

    return {
      key,
      label,
      weight,
      gainPer10Pts,
      currentVal,
      maxHeadroom,
      maxPotentialGain,
    };
  }).sort((a, b) => b.gainPer10Pts - a.gainPer10Pts);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              What-If Decision Support Simulator
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Hypothetical Improvement Modeler
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              "Changes the question from <em>'What is my score?'</em> to <em>'Which improvement could make the biggest difference?'</em>"
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to Actual
            </button>
            <div className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Hypothetical Modeling
            </div>
          </div>
        </div>

        {/* Real-time Outcome Comparison Banner */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-indigo-50/80 via-slate-50 to-amber-50/80 dark:from-indigo-950/40 dark:via-slate-900 dark:to-amber-950/40 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Actual Current Readiness
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono block mt-0.5">
              {currentReadiness.overallScore}
            </span>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
              {currentReadiness.category}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-center items-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Projected Net Gain
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-2xl sm:text-3xl font-black font-mono ${
                  delta > 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : delta < 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-500'
                }`}
              >
                {delta > 0 ? `+${delta}` : delta}
              </span>
              <span className="text-xs font-bold text-slate-400">PTS</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Transparent weighted delta
            </span>
          </div>

          <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              Simulated Readiness
            </span>
            <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono block mt-0.5">
              {simulatedReadiness.overallScore}
            </span>
            <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
              {simulatedReadiness.category}
            </span>
          </div>
        </div>
      </div>

      {/* Simulated Sliders Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Adjust Hypothetical Values
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Slide any indicator to explore what happens when you practice or obtain new certifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(
            [
              { key: 'technical', label: 'Technical / Coding Skills', weight: weights.technical, desc: 'Algorithms, LeetCode practice, OOP projects' },
              { key: 'academic', label: 'Academic Performance', weight: weights.academic, desc: 'University CGPA, semester theory exams' },
              { key: 'aptitude', label: 'Aptitude Tests', weight: weights.aptitude, desc: 'Quantitative speed tests, logical reasoning drills' },
              { key: 'communication', label: 'Communication', weight: weights.communication, desc: 'Technical storytelling, mock interview speaking' },
              { key: 'projects', label: 'Projects / Practical Work', weight: weights.projects, desc: 'End-to-end full stack deployments, GitHub stars' },
              { key: 'exposure', label: 'Certifications / Exposure', weight: weights.exposure, desc: 'AWS/Oracle exams, hackathon participation' },
            ] as const
          ).map((item) => {
            const actualVal = currentScores[item.key];
            const simVal = simulatedScores[item.key];
            const scoreDelta = simVal - actualVal;

            return (
              <div
                key={item.key}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-normal">
                      Weight: {Math.round(item.weight * 100)}%
                    </span>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Actual: {actualVal} →{' '}
                    </span>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                      Simulated: {simVal}
                    </span>
                    <span
                      className={`block text-[10px] font-bold ${
                        scoreDelta > 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : scoreDelta < 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} pts
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={simVal}
                  onChange={(e) =>
                    handleSimulatedChange(item.key, Number(e.target.value))
                  }
                  className="w-full h-2 rounded-lg accent-indigo-600 cursor-pointer"
                />

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1">
                  <span>0 min</span>
                  <span>Contribution: {(simVal * item.weight).toFixed(1)} pts</span>
                  <span>100 max</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. ROI / Biggest Lever Analysis ("Which improvement could make the biggest difference?") */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Effort-to-Readiness ROI (Biggest Levers)
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Mathematically ranked by how much your overall readiness score increases for every 10 points of improvement.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {levers.map((lever, idx) => (
            <div
              key={lever.key}
              className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold font-mono uppercase px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Rank #{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    Weight: {Math.round(lever.weight * 100)}%
                  </span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                  {lever.label}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Current score: {lever.currentVal}/100 ({lever.maxHeadroom} pts headroom)
                </span>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium text-[11px]">
                  +10 pts boost yields:
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  +{lever.gainPer10Pts} readiness
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
