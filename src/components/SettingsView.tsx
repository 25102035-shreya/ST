import React, { useState } from 'react';
import { AppSettings, ScoringWeights } from '../types';
import { DEFAULT_WEIGHTS } from '../data/constants';
import { triggerHaptic } from '../utils/haptics';
import {
  Settings,
  Sliders,
  Moon,
  Sun,
  Vibrate,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onExportData: () => void;
  onImportData: (data: any) => void;
  onResetAllData: () => void;
  hapticEnabled: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  setSettings,
  onExportData,
  onImportData,
  onResetAllData,
  hapticEnabled,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleWeightChange = (key: keyof ScoringWeights, percentageVal: number) => {
    triggerHaptic('light', hapticEnabled);
    const weightVal = Number((percentageVal / 100).toFixed(2));
    setSettings((prev) => ({
      ...prev,
      weights: {
        ...prev.weights,
        [key]: weightVal,
      },
    }));
  };

  const handleResetWeights = () => {
    triggerHaptic('medium', hapticEnabled);
    setSettings((prev) => ({
      ...prev,
      weights: { ...DEFAULT_WEIGHTS },
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        onImportData(parsed);
        setImportStatus('Data imported successfully!');
        setTimeout(() => setImportStatus(null), 3000);
      } catch (err) {
        setImportStatus('Invalid JSON data format.');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  // Calculate current total of weights
  const totalWeightPercent = Math.round(
    (settings.weights.academic +
      settings.weights.technical +
      settings.weights.aptitude +
      settings.weights.communication +
      settings.weights.projects +
      settings.weights.exposure) *
      100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            System & Calculation Settings
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Customize weighted scoring models, mobile haptics, theme appearance, and backup parameters.
        </p>
      </div>

      {/* 1. Transparent Scoring Weights Model */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Scoring Weights Configuration</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adjust how each category contributes to the overall readiness calculation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                totalWeightPercent === 100
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
              }`}
            >
              Total Sum: {totalWeightPercent}% {totalWeightPercent === 100 ? '(Valid)' : '(Must equal 100%)'}
            </span>

            <button
              onClick={handleResetWeights}
              className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 flex items-center gap-1"
              title="Reset weights to default 25/25/15/15/10/10"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Benchmark
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              { key: 'academic', label: 'Academic Performance', defaultPct: 25 },
              { key: 'technical', label: 'Technical / Coding Skills', defaultPct: 25 },
              { key: 'aptitude', label: 'Aptitude Reasoning', defaultPct: 15 },
              { key: 'communication', label: 'Communication', defaultPct: 15 },
              { key: 'projects', label: 'Projects / Practical Work', defaultPct: 10 },
              { key: 'exposure', label: 'Certifications / Exposure', defaultPct: 10 },
            ] as const
          ).map((item) => {
            const currentPct = Math.round(settings.weights[item.key] * 100);
            return (
              <div
                key={item.key}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
              >
                <div className="flex justify-between items-center text-xs mb-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <span>{item.label}</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    {currentPct}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={5}
                  value={currentPct}
                  onChange={(e) =>
                    handleWeightChange(item.key, Number(e.target.value))
                  }
                  className="w-full h-2 rounded-lg accent-indigo-600 cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Interface Preferences (Dark Mode & Haptic Feedback) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          Interaction & Accessibility Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Dark Mode Toggle */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                {settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Dark Mode Theme
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Low-light contrast styling for night-time review
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                triggerHaptic('medium', hapticEnabled);
                setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
              }}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                settings.darkMode ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
              aria-label="Toggle dark mode"
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Haptic Feedback Toggle */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Vibrate className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Haptic Feedback (Mobile)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Subtle tactile vibrations on slider and button taps
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const next = !settings.hapticFeedback;
                triggerHaptic('success', next);
                setSettings((prev) => ({ ...prev, hapticFeedback: next }));
              }}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                settings.hapticFeedback ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
              aria-label="Toggle haptic feedback"
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  settings.hapticFeedback ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Data Backup, Import & Reset */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          Data Management & State Persistence
        </h3>

        {importStatus && (
          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onExportData}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors flex flex-col justify-between"
          >
            <div>
              <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Export Profile JSON
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                Download student records and assessments
              </span>
            </div>
          </button>

          <label className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors flex flex-col justify-between cursor-pointer">
            <div>
              <Upload className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Import Profile JSON
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                Restore data from an exported file
              </span>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all data to the default benchmark?')) {
                onResetAllData();
              }
            }}
            className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 text-left transition-colors flex flex-col justify-between"
          >
            <div>
              <AlertTriangle className="w-5 h-5 text-rose-600 mb-2" />
              <span className="text-xs font-bold text-rose-700 dark:text-rose-300 block">
                Reset All Records
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                Revert to initial benchmark profile
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
