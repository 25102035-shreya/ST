import React, { useState } from 'react';
import { CareerRole, StudentProfile } from '../types';
import { CAREER_ROLES } from '../data/constants';
import { triggerHaptic } from '../utils/haptics';
import { computeSkillGaps } from '../utils/calculations';
import {
  Target,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  Layers,
  Sparkles,
  Plus,
  ArrowUpDown,
} from 'lucide-react';

interface CareerGapViewProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  technicalScore: number;
  hapticEnabled: boolean;
}

export const CareerGapView: React.FC<CareerGapViewProps> = ({
  profile,
  setProfile,
  technicalScore,
  hapticEnabled,
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(profile.targetRole);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillReq, setNewSkillReq] = useState(70);
  const [showAddCustom, setShowAddCustom] = useState(false);

  const selectedRole =
    CAREER_ROLES.find((r) => r.id === selectedRoleId) || CAREER_ROLES[0];

  const skillGaps = computeSkillGaps(
    selectedRole,
    profile.customSkillLevels,
    technicalScore
  );

  const handleRoleSelect = (roleId: string) => {
    triggerHaptic('medium', hapticEnabled);
    setSelectedRoleId(roleId);
    setProfile((prev) => ({
      ...prev,
      targetRole: roleId as any,
    }));
  };

  const handleUpdateSkillLevel = (skillName: string, value: number) => {
    triggerHaptic('light', hapticEnabled);
    const clamped = Math.max(0, Math.min(100, value));
    setProfile((prev) => ({
      ...prev,
      customSkillLevels: {
        ...prev.customSkillLevels,
        [skillName]: clamped,
      },
    }));
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    triggerHaptic('success', hapticEnabled);

    // Add to student's skill levels
    setProfile((prev) => ({
      ...prev,
      customSkillLevels: {
        ...prev.customSkillLevels,
        [newSkillName.trim()]: Math.round(newSkillReq * 0.7),
      },
    }));

    // Add to role's skills dynamically if not already present
    if (!selectedRole.skills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      selectedRole.skills.push({
        name: newSkillName.trim(),
        required: newSkillReq,
        category: 'core',
        description: 'Custom evaluated requirement for targeted placement profile',
      });
    }

    setNewSkillName('');
    setShowAddCustom(false);
  };

  const highPriorityCount = skillGaps.filter((g) => g.status === 'High Priority').length;
  const needsImpCount = skillGaps.filter((g) => g.status === 'Needs Improvement').length;
  const goodCount = skillGaps.filter((g) => g.status === 'Good').length;

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
              Skill Gap Analyzer
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <span>Career Requirements vs. Your Skills</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Formula: <code className="font-mono text-indigo-600 dark:text-indigo-400">Skill Gap = Required Level − Current Level</code>. Larger positive gaps receive higher priority.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Target Package: {selectedRole.targetPackage}
            </span>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="pt-4">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Select Target Career Track:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {CAREER_ROLES.map((role) => {
              const isSelected = role.id === selectedRoleId;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`p-3 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className={`font-bold block ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>
                      {role.title}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                      {role.category}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-2 block">
                    {role.skills.length} skills required
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gap Summary Statistics Pill Bar */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 text-center">
            <span className="text-xl font-black text-rose-700 dark:text-rose-300 font-mono block">
              {highPriorityCount}
            </span>
            <span className="text-[11px] font-semibold text-rose-800 dark:text-rose-400">
              High Priority Gaps
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-center">
            <span className="text-xl font-black text-amber-700 dark:text-amber-300 font-mono block">
              {needsImpCount}
            </span>
            <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-400">
              Needs Improvement
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-center">
            <span className="text-xl font-black text-emerald-700 dark:text-emerald-300 font-mono block">
              {goodCount}
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
              Well Aligned (Good)
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Skill Gap Matrix Table / Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {selectedRole.title} Competency Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adjust your self-evaluated score slider to test realignment against industry benchmarks.
            </p>
          </div>

          <button
            onClick={() => setShowAddCustom(!showAddCustom)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Skill Requirement
          </button>
        </div>

        {/* Add Custom Skill Form Modal/Box */}
        {showAddCustom && (
          <form
            onSubmit={handleAddCustomSkill}
            className="p-4 mb-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Skill Name
              </label>
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="e.g. Microservices, Redis, Kafka"
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Required Benchmark (0-100): {newSkillReq}
              </label>
              <input
                type="range"
                min={50}
                max={100}
                value={newSkillReq}
                onChange={(e) => setNewSkillReq(Number(e.target.value))}
                className="w-full h-2 rounded-lg accent-indigo-600 mt-2"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
              >
                Save Skill
              </button>
              <button
                type="button"
                onClick={() => setShowAddCustom(false)}
                className="py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Skill Gap Items */}
        <div className="space-y-3">
          {skillGaps.map((item) => {
            let statusBadge = (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" /> Good
              </span>
            );

            if (item.status === 'High Priority') {
              statusBadge = (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                  <AlertCircle className="w-3.5 h-3.5" /> High Priority
                </span>
              );
            } else if (item.status === 'Needs Improvement') {
              statusBadge = (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5" /> Needs Improvement
                </span>
              );
            }

            return (
              <div
                key={item.skillName}
                className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {item.skillName}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                        Required: {item.required} | You: {item.current}
                      </span>
                      <div className="text-[11px] font-semibold text-slate-500">
                        {item.gap > 0 ? (
                          <span className="text-rose-600 dark:text-rose-400 font-mono">
                            Gap: -{item.gap} pts
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                            Target Met (+{Math.abs(item.gap)})
                          </span>
                        )}
                      </div>
                    </div>
                    <div>{statusBadge}</div>
                  </div>
                </div>

                {/* Comparative Visual Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                    {/* Required Level Mark */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-slate-900 dark:bg-white z-10 opacity-70"
                      style={{ left: `${item.required}%` }}
                      title={`Target benchmark: ${item.required}%`}
                    />
                    {/* Current Student Fill */}
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.status === 'High Priority'
                          ? 'bg-rose-500'
                          : item.status === 'Needs Improvement'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${item.current}%` }}
                    />
                  </div>

                  {/* Interactive In-place Adjustment */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Target line at {item.required}%
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 dark:text-slate-400 text-xs">
                        Adjust self-rating:
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={item.current}
                        onChange={(e) =>
                          handleUpdateSkillLevel(item.skillName, Number(e.target.value))
                        }
                        className="w-28 h-1.5 rounded appearance-none bg-slate-300 dark:bg-slate-600 accent-indigo-600 cursor-pointer"
                      />
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 w-7 text-right">
                        {item.current}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
