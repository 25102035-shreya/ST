import React, { useState } from 'react';
import { RoadmapTask } from '../types';
import { triggerHaptic } from '../utils/haptics';
import {
  CheckSquare,
  Square,
  Plus,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Filter,
} from 'lucide-react';

interface ActionRoadmapViewProps {
  tasks: RoadmapTask[];
  setTasks: React.Dispatch<React.SetStateAction<RoadmapTask[]>>;
  hapticEnabled: boolean;
}

export const ActionRoadmapView: React.FC<ActionRoadmapViewProps> = ({
  tasks,
  setTasks,
  hapticEnabled,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<'all' | '30_day' | '60_day' | '90_day'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskSkill, setNewTaskSkill] = useState('DSA');
  const [newTaskPhase, setNewTaskPhase] = useState<'30_day' | '60_day' | '90_day'>('30_day');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('high');

  const toggleTask = (taskId: string) => {
    triggerHaptic('medium', hapticEnabled);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('heavy', hapticEnabled);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    triggerHaptic('success', hapticEnabled);
    const newTask: RoadmapTask = {
      id: `task_custom_${Date.now()}`,
      phase: newTaskPhase,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || 'Targeted milestone for placement readiness.',
      targetSkill: newTaskSkill.trim() || 'General',
      priority: newTaskPriority,
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddModal(false);
  };

  const filteredTasks = tasks.filter((t) =>
    selectedPhase === 'all' ? true : t.phase === selectedPhase
  );

  const completedCount = tasks.filter((t) => t.completed).length;
  const completionPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Structured Milestone Execution
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Personalized 30-60-90 Day Action Roadmap
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Transforms skill gap analytics into an actionable, day-by-day learning trajectory.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs shadow-indigo-500/20 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Milestone
          </button>
        </div>

        {/* Completion Progress Bar */}
        <div className="pt-4">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-700 dark:text-slate-300">
              Overall Roadmap Progress: <strong className="text-indigo-600 dark:text-indigo-400">{completedCount} of {tasks.length}</strong> tasks completed
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
              {completionPercent}%
            </span>
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        {/* Phase Filter Tabs */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {(
            [
              { id: 'all', label: `All Tasks (${tasks.length})` },
              { id: '30_day', label: 'Phase 1: 30-Day Sprint (Immediate Gaps)' },
              { id: '60_day', label: 'Phase 2: 60-Day Sprint (Projects & Aptitude)' },
              { id: '90_day', label: 'Phase 3: 90-Day Sprint (Interviews & Certification)' },
            ] as const
          ).map((phase) => (
            <button
              key={phase.id}
              onClick={() => {
                triggerHaptic('light', hapticEnabled);
                setSelectedPhase(phase.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedPhase === phase.id
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {phase.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">
              Add New Roadmap Milestone
            </h3>
            <form onSubmit={handleAddTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Milestone Title
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Master Binary Tree Traversals on LeetCode"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Deliverable
                </label>
                <textarea
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="e.g. Solve 20 medium problems, document time complexities..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sprint Phase
                  </label>
                  <select
                    value={newTaskPhase}
                    onChange={(e) => setNewTaskPhase(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="30_day">30-Day Sprint</option>
                    <option value="60_day">60-Day Sprint</option>
                    <option value="90_day">90-Day Sprint</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Skill Area
                </label>
                <input
                  type="text"
                  value={newTaskSkill}
                  onChange={(e) => setNewTaskSkill(e.target.value)}
                  placeholder="e.g. Spring Boot, DSA, Aptitude, Mock Interview"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No tasks found in this phase.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const phaseLabel =
              task.phase === '30_day'
                ? 'Phase 1: 30-Day'
                : task.phase === '60_day'
                ? 'Phase 2: 60-Day'
                : 'Phase 3: 90-Day';

            return (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 flex items-start justify-between gap-4 ${
                  task.completed
                    ? 'border-emerald-200 dark:border-emerald-950 bg-emerald-50/40 dark:bg-emerald-950/20 opacity-80'
                    : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0 text-slate-400">
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5 hover:text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm font-bold ${
                          task.completed
                            ? 'line-through text-slate-500 dark:text-slate-400'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border border-slate-200/60 dark:border-slate-700">
                        {task.targetSkill}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          task.priority === 'high'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        task.completed
                          ? 'text-slate-400 line-through'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {task.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-semibold text-slate-500 font-mono hidden sm:inline-block">
                    {phaseLabel}
                  </span>
                  <button
                    onClick={(e) => deleteTask(task.id, e)}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
