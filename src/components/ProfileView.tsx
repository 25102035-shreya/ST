import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { CAREER_ROLES } from '../data/constants';
import { triggerHaptic } from '../utils/haptics';
import {
  User,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  ExternalLink,
  Upload,
  FileCheck,
} from 'lucide-react';

interface ProfileViewProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  hapticEnabled: boolean;
  onOpenCertificateModal: () => void;
  onDeleteCertificate: (id: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  setProfile,
  hapticEnabled,
  onOpenCertificateModal,
  onDeleteCertificate,
}) => {
  const [newCert, setNewCert] = useState('');
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjTech, setNewProjTech] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [showAddProject, setShowAddProject] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleInputChange = (field: keyof StudentProfile, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.trim()) return;
    triggerHaptic('success', hapticEnabled);
    setProfile((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCert.trim()],
    }));
    setNewCert('');
  };

  const handleRemoveCertification = (index: number) => {
    triggerHaptic('light', hapticEnabled);
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;
    triggerHaptic('success', hapticEnabled);
    setProfile((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: newProjTitle.trim(),
          tech: newProjTech.trim() || 'Java, OOP',
          description: newProjDesc.trim() || 'Software engineering portfolio project.',
        },
      ],
    }));
    setNewProjTitle('');
    setNewProjTech('');
    setNewProjDesc('');
    setShowAddProject(false);
  };

  const handleRemoveProject = (index: number) => {
    triggerHaptic('light', hapticEnabled);
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const triggerSaveNotification = () => {
    triggerHaptic('success', hapticEnabled);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            Student Identity & Portfolio
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Academic Profile Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Maintain your student credentials, GitHub repositories, and verified credentials.
          </p>
        </div>

        {savedFeedback && (
          <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle className="w-3.5 h-3.5" />
            Profile Auto-Saved!
          </div>
        )}
      </div>

      {/* Main Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Academic Credentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                College Roll / Registration No.
              </label>
              <input
                type="text"
                value={profile.rollNo}
                onChange={(e) => handleInputChange('rollNo', e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Engineering Branch / Department
              </label>
              <input
                type="text"
                value={profile.branch}
                onChange={(e) => handleInputChange('branch', e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Academic Semester
              </label>
              <input
                type="text"
                value={profile.semester}
                onChange={(e) => handleInputChange('semester', e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                College / Institution Name
              </label>
              <input
                type="text"
                value={profile.college}
                onChange={(e) => handleInputChange('college', e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Placement Track
              </label>
              <select
                value={profile.targetRole}
                onChange={(e) => handleInputChange('targetRole', e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {CAREER_ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.category})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Contact & Professional Links</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GitHub Profile URL
              </label>
              <input
                type="text"
                value={profile.github}
                onChange={(e) => handleInputChange('github', e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={profile.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Candidate Executive Summary / Bio
            </label>
            <textarea
              rows={2}
              value={profile.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Capstone Projects Portfolio */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Capstone Projects ({profile.projects.length})</span>
            </h3>

            <button
              onClick={() => setShowAddProject(!showAddProject)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Project
            </button>
          </div>

          {showAddProject && (
            <form onSubmit={handleAddProject} className="p-4 mb-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Project Title</label>
                  <input
                    type="text"
                    value={newProjTitle}
                    onChange={(e) => setNewProjTitle(e.target.value)}
                    placeholder="e.g. Distributed Task Scheduler"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tech Stack</label>
                  <input
                    type="text"
                    value={newProjTech}
                    onChange={(e) => setNewProjTech(e.target.value)}
                    placeholder="e.g. Java, Spring Boot, Redis, Docker"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Brief Description</label>
                <textarea
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="Key features, architectural patterns and outcomes..."
                  rows={2}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-3 py-1 rounded-lg border border-slate-300 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 rounded-lg bg-indigo-600 text-white font-semibold"
                >
                  Save Project
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.projects.map((proj, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                      {proj.title}
                    </span>
                    <button
                      onClick={() => handleRemoveProject(idx)}
                      className="text-slate-400 hover:text-rose-500 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold block mt-0.5">
                    {proj.tech}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Exposure */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Verified Credentials & Uploaded Certificates</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upload your certificates or diplomas. Each verified certificate adds +10 points to your score.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenCertificateModal}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Certificate
            </button>
          </div>

          {/* Uploaded Certificates List */}
          {profile.uploadedCertificates && profile.uploadedCertificates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {profile.uploadedCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-start justify-between gap-2"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                      <FileCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                        {cert.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {cert.issuer} • {cert.issueDate}
                      </p>
                      {cert.credentialId && (
                        <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1 py-0.2 rounded inline-block mt-1">
                          ID: {cert.credentialId}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteCertificate(cert.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                    title="Delete certificate"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
              <p className="text-xs text-slate-500">No certificates uploaded yet.</p>
              <button
                type="button"
                onClick={onOpenCertificateModal}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
              >
                <Upload className="w-3.5 h-3.5" /> Upload your first certificate
              </button>
            </div>
          )}

          {/* Quick Add Custom Text Credential */}
          <form onSubmit={handleAddCertification} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newCert}
              onChange={(e) => setNewCert(e.target.value)}
              placeholder="Or add credential title (e.g. AWS Certified Cloud Practitioner)..."
              className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
