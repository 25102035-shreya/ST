import React, { useState } from 'react';
import {
  LayoutDashboard,
  Target,
  Sparkles,
  GitBranch,
  FileCheck2,
  User,
  History,
  Settings,
  Moon,
  Sun,
  CheckCircle2,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export type ActiveTab =
  | 'dashboard'
  | 'career_gap'
  | 'what_if'
  | 'roadmap'
  | 'audit'
  | 'profile'
  | 'history'
  | 'settings';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  studentName: string;
  studentBranch: string;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  hapticEnabled: boolean;
  lastSavedAt: string;
  isDirty?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  studentName,
  studentBranch,
  darkMode,
  setDarkMode,
  hapticEnabled,
  lastSavedAt,
  isDirty = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'career_gap', label: 'Skill Gap', icon: Target },
    { id: 'what_if', label: 'What-If', icon: Sparkles },
    { id: 'roadmap', label: 'Roadmap', icon: GitBranch },
    { id: 'audit', label: 'Audit & Viva', icon: FileCheck2 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    triggerHaptic('light', hapticEnabled);
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleToggleDark = () => {
    triggerHaptic('medium', hapticEnabled);
    setDarkMode((prev) => !prev);
  };

  return (
    <header className="no-print sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTabClick('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-slate-100">
                    SKILLTRACK
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate max-w-xs font-normal">
                  Smart Student Success & Placement Analyzer
                </p>
              </div>
            </button>
          </div>

          {/* Student Capsule & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Auto-save Status Indicator */}
            <div
              className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-200/60 dark:border-slate-700"
              title={`Last auto-saved: ${new Date(lastSavedAt).toLocaleTimeString()}`}
            >
              {isDirty ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-amber-600 dark:text-amber-400">Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-medium text-slate-600 dark:text-slate-300">Saved</span>
                </>
              )}
            </div>

            {/* Active Student Pill */}
            <div
              onClick={() => handleTabClick('profile')}
              className="cursor-pointer hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              title="Click to edit profile"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center">
                {studentName ? studentName.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="text-left leading-none">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                  {studentName || 'Student'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px] mt-0.5">
                  {studentBranch || 'Engineering'}
                </p>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={handleToggleDark}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Toggle dark mode"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 border-t border-slate-100 dark:border-slate-800/80 py-1.5 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              {studentName} ({studentBranch})
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3" /> Auto-saved
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
