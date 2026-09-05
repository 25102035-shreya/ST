import React, { useState } from 'react';
import {
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Cpu,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';
import { RuleConversionBreakdown } from '../utils/ruleEngine';
import { triggerHaptic } from '../utils/haptics';

interface SystemScoreCardProps {
  id: string;
  label: string;
  shortLabel?: string;
  weight: number; // e.g. 0.25
  value: number; // 0 - 100
  color?: string;
  description?: string;
  breakdown?: RuleConversionBreakdown;
  hapticEnabled?: boolean;
  onNavigateToEvidence?: () => void;
}

export const SystemScoreCard: React.FC<SystemScoreCardProps> = ({
  id,
  label,
  shortLabel: _shortLabel,
  weight,
  value,
  color = '#4f46e5',
  description,
  breakdown,
  hapticEnabled = true,
  onNavigateToEvidence,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const weightPercentage = Math.round(weight * 100);
  const contribution = (value * weight).toFixed(1);

  // Score color badge styling
  let scoreBadgeColor = 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60';
  if (value >= 80) {
    scoreBadgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60';
  } else if (value >= 60) {
    scoreBadgeColor = 'text-indigo-700 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/60';
  } else if (value < 45) {
    scoreBadgeColor = 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60';
  }

  const toggleDetails = () => {
    triggerHaptic('light', hapticEnabled);
    setShowDetails((prev) => !prev);
  };

  return (
    <div
      id={`system-score-card-${id}`}
      className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150 flex flex-col justify-between"
    >
      {/* Header Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base tracking-tight">
                {label}
              </span>
              <span
                className="text-[11px] px-2 py-0.5 rounded-full font-semibold border bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                title={`Contributes ${weightPercentage}% to overall readiness`}
              >
                Weight: {weightPercentage}%
              </span>
            </div>
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {description}
              </p>
            )}
          </div>

          {/* Read-Only Calculated Score Display */}
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                {value}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/100</span>
            </div>
            <div
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 mt-0.5 ${scoreBadgeColor}`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>System Calculated</span>
            </div>
          </div>
        </div>

        {/* Read-Only Visual Progress Track (No Sliders, No Steppers) */}
        <div className="relative w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden my-3 border border-slate-200/60 dark:border-slate-700/60">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.max(4, Math.min(100, value))}%`,
              backgroundColor: color,
            }}
          />
        </div>

        {/* System Evidence Summary (The exact wording requested by user) */}
        <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
          <div className="flex items-start gap-2">
            <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white">
                {breakdown?.evidenceSummary || `System Calculated Based on verified student evidence and assessments.`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Factor Breakdown Toggle & Actions */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Readiness Contribution:
          </span>
          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
            +{contribution} pts
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={toggleDetails}
            className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {showDetails ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Hide Factors</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>View Evidence Factors</span>
              </>
            )}
          </button>

          {onNavigateToEvidence && (
            <button
              type="button"
              onClick={onNavigateToEvidence}
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
              title="Update verified records to automatically adjust this score"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Update Evidence</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          )}
        </div>

        {/* Collapsible Factor Breakdown */}
        {showDetails && breakdown && (
          <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-[11px] animate-in fade-in duration-200">
            <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Verified Evidence Factors Used:</span>
            </div>

            {breakdown.evidenceFactors && breakdown.evidenceFactors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                {breakdown.evidenceFactors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
                  >
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      {factor.name}:
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 ml-1 truncate">
                      {factor.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="pt-1.5 border-t border-slate-200/70 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 block mb-1 font-semibold text-[10px]">
                Calculation Rules Applied:
              </span>
              <ul className="space-y-1">
                {breakdown.appliedRules.map((rule, idx) => (
                  <li
                    key={idx}
                    className="text-slate-700 dark:text-slate-300 font-mono text-[10px] flex items-start gap-1.5"
                  >
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
