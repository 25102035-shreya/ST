import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  StudentProfile,
  StudentScores,
  AppSettings,
  HistorySnapshot,
  RoadmapTask,
  CareerRole,
} from './types';
import { CAREER_ROLES } from './data/constants';
import {
  loadAppState,
  saveAppState,
  exportStateAsJson,
  INITIAL_APP_STATE,
} from './utils/storage';
import { calculateReadiness, computeSkillGaps } from './utils/calculations';
import { triggerHaptic } from './utils/haptics';
import { Header, ActiveTab } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CareerGapView } from './components/CareerGapView';
import { WhatIfSimulatorView } from './components/WhatIfSimulatorView';
import { ActionRoadmapView } from './components/ActionRoadmapView';
import { AuditReportView } from './components/AuditReportView';
import { ProfileView } from './components/ProfileView';
import { HistoryLogsView } from './components/HistoryLogsView';
import { SettingsView } from './components/SettingsView';
import { CertificateUploadModal } from './components/CertificateUploadModal';
import { convertFactualToScores } from './utils/ruleEngine';
import { StudentFactualData, UploadedCertificate } from './types';

export default function App() {
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Core App State
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_APP_STATE.profile);
  const [scores, setScores] = useState<StudentScores>(INITIAL_APP_STATE.scores);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_APP_STATE.settings);
  const [history, setHistory] = useState<HistorySnapshot[]>(INITIAL_APP_STATE.history);
  const [roadmapTasks, setRoadmapTasks] = useState<RoadmapTask[]>(INITIAL_APP_STATE.roadmapTasks);
  const [lastSavedAt, setLastSavedAt] = useState<string>(new Date().toISOString());
  const [isDirty, setIsDirty] = useState(false);

  // Active View Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Factual Data & Automatic Predefined Evidence Engine Handlers
  const handleUpdateFactualData = (updatedFactual: StudentFactualData) => {
    const { scores: calculated } = convertFactualToScores(
      updatedFactual,
      profile.uploadedCertificates || []
    );
    const updatedProfile: StudentProfile = {
      ...profile,
      factualData: updatedFactual,
    };
    setProfile(updatedProfile);
    setScores(calculated);
  };

  const handleAddCertificate = (newCert: UploadedCertificate) => {
    triggerHaptic('success', settings.hapticFeedback);
    const existingCerts = profile.uploadedCertificates || [];
    const updatedCerts = [newCert, ...existingCerts];
    const updatedFactual: StudentFactualData = {
      ...profile.factualData,
      certificationsCount: updatedCerts.length,
    };
    const { scores: calculated } = convertFactualToScores(updatedFactual, updatedCerts);
    const updatedProfile: StudentProfile = {
      ...profile,
      uploadedCertificates: updatedCerts,
      factualData: updatedFactual,
      certifications: [newCert.name, ...profile.certifications],
    };
    setProfile(updatedProfile);
    setScores(calculated);
  };

  const handleDeleteCertificate = (id: string) => {
    triggerHaptic('medium', settings.hapticFeedback);
    const existingCerts = profile.uploadedCertificates || [];
    const updatedCerts = existingCerts.filter((c) => c.id !== id);
    const updatedFactual: StudentFactualData = {
      ...profile.factualData,
      certificationsCount: updatedCerts.length,
    };
    const { scores: calculated } = convertFactualToScores(updatedFactual, updatedCerts);
    const updatedProfile: StudentProfile = {
      ...profile,
      uploadedCertificates: updatedCerts,
      factualData: updatedFactual,
    };
    setProfile(updatedProfile);
    setScores(calculated);
  };

  const handleApplyPresetExample = () => {
    triggerHaptic('success', settings.hapticFeedback);
    const exampleFactual: StudentFactualData = {
      cgpa: 8.5,
      assignmentsScore: 88,
      hasBacklogs: false,
      backlogCount: 0,
      primaryLanguage: 'Java',
      primaryLanguageLevel: 'Advanced',
      secondaryLanguage: 'Python',
      secondaryLanguageLevel: 'Intermediate',
      dsaLevel: 'Intermediate',
      sqlLevel: 'Intermediate',
      dsaProblemsSolved: 140,
      codingAssessmentScore: 86,
      githubCommitsThisYear: 145,
      projectCount: 3,
      hasFullStackOrDeployed: true,
      hasGitRepo: true,
      certificationsCount: 4,
      hasInternship: true,
      internshipMonths: 3,
      internshipRole: 'Backend Developer Intern',
      aptitudeMockPercentile: 78,
      aptitudePracticeLevel: 'Intermediate',
      communicationRating: 'Good',
      gdParticipation: true,
      englishProficiency: 'Professional',
    };
    const { scores: exampleScores } = convertFactualToScores(
      exampleFactual,
      profile.uploadedCertificates || []
    );
    setProfile((prev) => ({
      ...prev,
      factualData: exampleFactual,
    }));
    setScores(exampleScores);
  };

  // 1. Initial State Hydration from localStorage
  useEffect(() => {
    const loaded = loadAppState();
    setProfile(loaded.profile);
    setScores(loaded.scores);
    setSettings(loaded.settings);
    setHistory(loaded.history);
    setRoadmapTasks(loaded.roadmapTasks);
    setLastSavedAt(loaded.lastSavedAt);
    setInitialLoaded(true);
  }, []);

  // 2. Dark Mode DOM Class Sync
  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // 3. Auto-save Debounce
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!initialLoaded) return;

    setIsDirty(true);
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const now = new Date().toISOString();
      saveAppState({
        profile,
        scores,
        settings,
        history,
        roadmapTasks,
        lastSavedAt: now,
      });
      setLastSavedAt(now);
      setIsDirty(false);
    }, 600);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [profile, scores, settings, history, roadmapTasks, initialLoaded]);

  // 4. Derived Calculations
  const readiness = useMemo(() => {
    return calculateReadiness(scores, settings.weights);
  }, [scores, settings.weights]);

  const currentRole: CareerRole = useMemo(() => {
    return (
      CAREER_ROLES.find((r) => r.id === profile.targetRole) || CAREER_ROLES[0]
    );
  }, [profile.targetRole]);

  const skillGaps = useMemo(() => {
    return computeSkillGaps(
      currentRole,
      profile.customSkillLevels,
      scores.technical
    );
  }, [currentRole, profile.customSkillLevels, scores.technical]);

  // Handlers
  const handleToggleTask = (taskId: string) => {
    triggerHaptic('medium', settings.hapticFeedback);
    setRoadmapTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleSaveSnapshot = (customLabel?: string) => {
    triggerHaptic('success', settings.hapticFeedback);
    const newSnap: HistorySnapshot = {
      id: `snap_${Date.now()}`,
      timestamp: new Date().toISOString(),
      label: customLabel || `Manual Evaluation (${readiness.overallScore} pts)`,
      scores: { ...scores },
      readinessScore: readiness.overallScore,
      category: readiness.category,
      targetRole: currentRole.title,
      notes: `Recorded on ${new Date().toLocaleDateString()}`,
    };
    setHistory((prev) => [newSnap, ...prev]);
  };

  const handleRestoreSnapshot = (snapshot: HistorySnapshot) => {
    triggerHaptic('medium', settings.hapticFeedback);
    setScores({ ...snapshot.scores });
    setActiveTab('dashboard');
  };

  const handleExportData = () => {
    triggerHaptic('medium', settings.hapticFeedback);
    exportStateAsJson({
      profile,
      scores,
      settings,
      history,
      roadmapTasks,
      lastSavedAt,
    });
  };

  const handleImportData = (importedState: any) => {
    triggerHaptic('success', settings.hapticFeedback);
    if (importedState?.profile) setProfile(importedState.profile);
    if (importedState?.scores) setScores(importedState.scores);
    if (importedState?.settings) setSettings(importedState.settings);
    if (Array.isArray(importedState?.history)) setHistory(importedState.history);
    if (Array.isArray(importedState?.roadmapTasks)) setRoadmapTasks(importedState.roadmapTasks);
  };

  const handleResetAllData = () => {
    triggerHaptic('heavy', settings.hapticFeedback);
    setProfile(INITIAL_APP_STATE.profile);
    setScores(INITIAL_APP_STATE.scores);
    setSettings(INITIAL_APP_STATE.settings);
    setHistory(INITIAL_APP_STATE.history);
    setRoadmapTasks(INITIAL_APP_STATE.roadmapTasks);
    saveAppState(INITIAL_APP_STATE);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Centered Top Header with Sticky Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentName={profile.name}
        studentBranch={profile.branch}
        darkMode={settings.darkMode}
        setDarkMode={(val) => {
          if (typeof val === 'function') {
            setSettings((prev) => ({ ...prev, darkMode: val(prev.darkMode) }));
          } else {
            setSettings((prev) => ({ ...prev, darkMode: val }));
          }
        }}
        hapticEnabled={settings.hapticFeedback}
        lastSavedAt={lastSavedAt}
        isDirty={isDirty}
      />

      {/* Main Content Area - STRICTLY CENTERED */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            setProfile={setProfile}
            scores={scores}
            setScores={setScores}
            weights={settings.weights}
            readiness={readiness}
            currentRole={currentRole}
            skillGaps={skillGaps}
            roadmapTasks={roadmapTasks}
            onToggleTask={handleToggleTask}
            onSaveSnapshot={handleSaveSnapshot}
            setActiveTab={setActiveTab}
            hapticEnabled={settings.hapticFeedback}
            onOpenCertificateModal={() => setIsCertModalOpen(true)}
            onUpdateFactualData={handleUpdateFactualData}
            onApplyPresetExample={handleApplyPresetExample}
          />
        )}

        {activeTab === 'career_gap' && (
          <CareerGapView
            profile={profile}
            setProfile={setProfile}
            technicalScore={scores.technical}
            hapticEnabled={settings.hapticFeedback}
          />
        )}

        {activeTab === 'what_if' && (
          <WhatIfSimulatorView
            currentScores={scores}
            weights={settings.weights}
            currentReadiness={readiness}
            hapticEnabled={settings.hapticFeedback}
          />
        )}

        {activeTab === 'roadmap' && (
          <ActionRoadmapView
            tasks={roadmapTasks}
            setTasks={setRoadmapTasks}
            hapticEnabled={settings.hapticFeedback}
          />
        )}

        {activeTab === 'audit' && (
          <AuditReportView
            profile={profile}
            scores={scores}
            weights={settings.weights}
            readiness={readiness}
            currentRole={currentRole}
            skillGaps={skillGaps}
            roadmapTasks={roadmapTasks}
            hapticEnabled={settings.hapticFeedback}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            setProfile={setProfile}
            hapticEnabled={settings.hapticFeedback}
            onOpenCertificateModal={() => setIsCertModalOpen(true)}
            onDeleteCertificate={handleDeleteCertificate}
          />
        )}

        {activeTab === 'history' && (
          <HistoryLogsView
            history={history}
            setHistory={setHistory}
            currentScores={scores}
            currentReadiness={readiness.overallScore}
            currentCategory={readiness.category}
            targetRole={currentRole.title}
            onRestoreSnapshot={handleRestoreSnapshot}
            hapticEnabled={settings.hapticFeedback}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            setSettings={setSettings}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onResetAllData={handleResetAllData}
            hapticEnabled={settings.hapticFeedback}
          />
        )}
      </main>

      {/* Certificate Upload & Verification Modal */}
      <CertificateUploadModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        onAddCertificate={handleAddCertificate}
        onDeleteCertificate={handleDeleteCertificate}
        existingCertificates={profile.uploadedCertificates || []}
        hapticEnabled={settings.hapticFeedback}
      />

      {/* Centered Minimalist Footer */}
      <footer className="no-print w-full border-t border-slate-200/80 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-5xl mx-auto px-4">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            SKILLTRACK — Smart Student Success & Placement Analyzer
          </p>
          <p className="mt-1 text-[11px]">
            Placement Readiness Analytics • Skill Gap Evaluator • Action Roadmap & Decision Support
          </p>
        </div>
      </footer>
    </div>
  );
}
