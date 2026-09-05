import React, { useState } from 'react';
import { HistorySnapshot, StudentScores } from '../types';
import { triggerHaptic } from '../utils/haptics';
import {
  History,
  BookmarkCheck,
  Calendar,
  ArrowRight,
  RotateCcw,
  Trash2,
  GitCompare,
  TrendingUp,
} from 'lucide-react';

interface HistoryLogsViewProps {
  history: HistorySnapshot[];
  setHistory: React.Dispatch<React.SetStateAction<HistorySnapshot[]>>;
  currentScores: StudentScores;
  currentReadiness: number;
  currentCategory: string;
  targetRole: string;
  onRestoreSnapshot: (snapshot: HistorySnapshot) => void;
  hapticEnabled: boolean;
}

export const HistoryLogsView: React.FC<HistoryLogsViewProps> = ({
  history,
  setHistory,
  currentScores,
  currentReadiness,
  currentCategory,
  targetRole,
  onRestoreSnapshot,
  hapticEnabled,
}) => {
  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [snapshotNotes, setSnapshotNotes] = useState('');
  const [compareIdA, setCompareIdA] = useState<string>(history[0]?.id || '');
  const [compareIdB, setCompareIdB] = useState<string>(history[1]?.id || '');

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('success', hapticEnabled);

    const newSnap: HistorySnapshot = {
      id: `snap_${Date.now()}`,
      timestamp: new Date().toISOString(),
      label: snapshotLabel.trim() || `Assessment Checkpoint #${history.length + 1}`,
      scores: { ...currentScores },
      readinessScore: currentReadiness,
      category: currentCategory as any,
      targetRole: targetRole,
      notes: snapshotNotes.trim() || 'Recorded from student dashboard.',
    };

    setHistory([newSnap, ...history]);
    setSnapshotLabel('');
    setSnapshotNotes('');
  };

  const handleDeleteSnapshot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('heavy', hapticEnabled);
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const snapA = history.find((h) => h.id === compareIdA);
  const snapB = history.find((h) => h.id === compareIdB);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              Progress Logs & Timeline
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Evaluation History & Milestone Snapshots
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              "Tracks development over time instead of showing only one static result."
            </p>
          </div>
        </div>

        {/* Quick Snapshot Creator Form */}
        <form onSubmit={handleCreateSnapshot} className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Snapshot Label / Milestone
            </label>
            <input
              type="text"
              value={snapshotLabel}
              onChange={(e) => setSnapshotLabel(e.target.value)}
              placeholder="e.g. Post-DSA Marathon Sprint"
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assessment Reflection / Notes
            </label>
            <input
              type="text"
              value={snapshotNotes}
              onChange={(e) => setSnapshotNotes(e.target.value)}
              placeholder="e.g. Cleared 20 tree problems; improved mock rating"
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs shadow-indigo-500/20 transition-colors"
            >
              <BookmarkCheck className="w-4 h-4" />
              Record Current State ({currentReadiness} pts)
            </button>
          </div>
        </form>
      </div>

      {/* Snapshot Comparison Tool */}
      {history.length >= 2 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <GitCompare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Historical Snapshot Comparator
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Base Checkpoint (Past):
              </label>
              <select
                value={compareIdA}
                onChange={(e) => setCompareIdA(e.target.value)}
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
              >
                {history.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.label} ({h.readinessScore} pts)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Comparative Checkpoint (Recent):
              </label>
              <select
                value={compareIdB}
                onChange={(e) => setCompareIdB(e.target.value)}
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
              >
                {history.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.label} ({h.readinessScore} pts)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {snapA && snapB && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Readiness Delta</span>
                <span
                  className={`text-lg font-black font-mono ${
                    snapB.readinessScore >= snapA.readinessScore
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600'
                  }`}
                >
                  {snapB.readinessScore >= snapA.readinessScore ? '+' : ''}
                  {(snapB.readinessScore - snapA.readinessScore).toFixed(2)} pts
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Tech Skills Delta</span>
                <span className="text-lg font-black font-mono text-slate-800 dark:text-slate-200">
                  {snapB.scores.technical >= snapA.scores.technical ? '+' : ''}
                  {snapB.scores.technical - snapA.scores.technical}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Academics Delta</span>
                <span className="text-lg font-black font-mono text-slate-800 dark:text-slate-200">
                  {snapB.scores.academic >= snapA.scores.academic ? '+' : ''}
                  {snapB.scores.academic - snapA.scores.academic}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Projects Delta</span>
                <span className="text-lg font-black font-mono text-slate-800 dark:text-slate-200">
                  {snapB.scores.projects >= snapA.scores.projects ? '+' : ''}
                  {snapB.scores.projects - snapA.scores.projects}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Snapshot Timeline List */}
      <div className="space-y-3">
        {history.map((item, idx) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {item.label}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                  {item.category}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">{item.notes}</p>

              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-600 dark:text-slate-400 pt-1">
                <span>Acad: {item.scores.academic}</span>
                <span>Tech: {item.scores.technical}</span>
                <span>Apt: {item.scores.aptitude}</span>
                <span>Comm: {item.scores.communication}</span>
                <span>Proj: {item.scores.projects}</span>
                <span>Exp: {item.scores.exposure}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Readiness</span>
                <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                  {item.readinessScore}
                </span>
              </div>

              <button
                onClick={() => {
                  triggerHaptic('medium', hapticEnabled);
                  onRestoreSnapshot(item);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Restore this snapshot to active profile"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore</span>
              </button>

              <button
                onClick={(e) => handleDeleteSnapshot(item.id, e)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Delete snapshot"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
