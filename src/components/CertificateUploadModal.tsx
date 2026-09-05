import React, { useState, useRef } from 'react';
import {
  Award,
  Upload,
  FileText,
  Trash2,
  Download,
  X,
  Plus,
  Calendar,
  Building,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { UploadedCertificate } from '../types';

interface CertificateUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificates: UploadedCertificate[];
  onAddCertificate: (cert: UploadedCertificate) => void;
  onDeleteCertificate: (id: string) => void;
}

export const CertificateUploadModal: React.FC<CertificateUploadModalProps> = ({
  isOpen,
  onClose,
  certificates,
  onAddCertificate,
  onDeleteCertificate,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<UploadedCertificate['category']>('technical');
  const [credentialId, setCredentialId] = useState('');
  const [selectedFile, setSelectedFile] = useState<{
    dataUrl?: string;
    name: string;
    size: number;
    type: string;
  } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewCert, setPreviewCert] = useState<UploadedCertificate | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile({
        dataUrl: reader.result as string,
        name: file.name,
        size: file.size,
        type: file.type,
      });
      if (!name) {
        // Pre-fill name from file name without extension
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setName(cleanName);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !issuer.trim()) {
      alert('Please provide Certificate Name and Issuing Organization.');
      return;
    }

    const newCert: UploadedCertificate = {
      id: `cert_${Date.now()}`,
      name: name.trim(),
      issuer: issuer.trim(),
      issueDate: issueDate || new Date().toISOString().split('T')[0],
      category,
      credentialId: credentialId.trim() || undefined,
      fileDataUrl: selectedFile?.dataUrl,
      fileName: selectedFile?.name || 'certificate.pdf',
      fileSize: selectedFile?.size || 150000,
      uploadedAt: new Date().toISOString(),
    };

    onAddCertificate(newCert);

    // Reset form
    setName('');
    setIssuer('');
    setCredentialId('');
    setSelectedFile(null);
    setIsAdding(false);
  };

  const handleDownload = (cert: UploadedCertificate) => {
    if (!cert.fileDataUrl) {
      alert('No binary attachment found for this credential record.');
      return;
    }
    const a = document.createElement('a');
    a.href = cert.fileDataUrl;
    a.download = cert.fileName || `${cert.name.replace(/\s+/g, '_')}_certificate`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200/60 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Verified Certificates Vault
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload & manage credentials evaluated by the Placement Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Rules info banner */}
          <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-800/60 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div className="text-xs text-purple-900 dark:text-purple-200 leading-relaxed">
              <span className="font-semibold">Placement Rules Integration:</span> Every uploaded certificate contributes <span className="font-bold">+10 points</span> to your <span className="font-semibold">Certifications & Exposure Score</span> (capped at 40 points). Currently <span className="font-bold">{certificates.length} certificate(s)</span> are verified.
            </div>
          </div>

          {/* Add Certificate Toggle / Form */}
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-3 px-4 border-2 border-dashed border-indigo-300 dark:border-indigo-800/80 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Upload New Certificate
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/10 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-100 dark:border-indigo-950">
                <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  Upload Certificate Document
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400"
                >
                  Cancel
                </button>
              </div>

              {/* Drag & Drop File Upload Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileChange(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`p-5 rounded-xl border-2 border-dashed text-center cursor-pointer transition-colors ${
                  dragOver
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50'
                    : selectedFile
                    ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30'
                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-white dark:bg-slate-800'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-xs">
                        {selectedFile.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {(selectedFile.size / 1024).toFixed(1)} KB • Click or drag to change
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-7 h-7 text-indigo-500 dark:text-indigo-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Click to upload certificate or drag and drop
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supports PDF, PNG, JPG, or JPEG (Max 8MB)
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Certificate Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oracle Certified Associate: Java SE 11"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oracle, Coursera, HackerRank, AWS"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as UploadedCertificate['category'])}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="technical">Technical / Coding</option>
                    <option value="cloud">Cloud & DevOps</option>
                    <option value="soft_skills">Soft Skills & Communication</option>
                    <option value="internship">Internship Completion</option>
                    <option value="academic">Academic Honor</option>
                    <option value="other">Other Credential</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Credential ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ORCL-88219"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Save & Evaluate Certificate
                </button>
              </div>
            </form>
          )}

          {/* Certificates List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Uploaded Certificates ({certificates.length})
              </span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                +{Math.min(40, certificates.length * 10)} pts to Exposure
              </span>
            </div>

            {certificates.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  No certificates uploaded yet.
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Upload certifications to increase your placement readiness score.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-purple-300 dark:hover:border-purple-800/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {cert.name}
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize">
                            {cert.category.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3 text-slate-400" />
                            {cert.issuer}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {cert.issueDate}
                          </span>
                          {cert.credentialId && (
                            <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.2 rounded">
                              ID: {cert.credentialId}
                            </span>
                          )}
                          {cert.fileName && (
                            <span className="text-slate-400 text-[10px]">
                              📎 {cert.fileName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      {cert.fileDataUrl && (
                        <>
                          <button
                            onClick={() => setPreviewCert(cert)}
                            title="Preview Certificate"
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(cert)}
                            title="Download Certificate"
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`Remove certificate "${cert.name}"?`)) {
                            onDeleteCertificate(cert.id);
                          }
                        }}
                        title="Delete Certificate"
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{certificates.length} certificate(s) recorded in profile</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>

      {/* Preview Modal if user clicks Eye on an image/pdf */}
      {previewCert && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {previewCert.name}
                </h4>
                <p className="text-xs text-slate-500">{previewCert.issuer} • {previewCert.issueDate}</p>
              </div>
              <button
                onClick={() => setPreviewCert(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full max-h-[60vh] overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 p-2 flex items-center justify-center bg-slate-100 dark:bg-slate-950">
              {previewCert.fileDataUrl?.startsWith('data:image/') ? (
                <img
                  src={previewCert.fileDataUrl}
                  alt={previewCert.name}
                  className="max-h-[55vh] object-contain rounded"
                />
              ) : (
                <div className="text-center py-12 space-y-3">
                  <FileText className="w-16 h-16 text-indigo-500 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {previewCert.fileName}
                  </p>
                  <button
                    onClick={() => handleDownload(previewCert)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download Certificate Document
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
