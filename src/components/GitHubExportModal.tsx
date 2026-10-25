import React, { useState, useEffect } from 'react';
import {
  Github,
  CheckCircle2,
  AlertCircle,
  Download,
  UploadCloud,
  ExternalLink,
  X,
  RefreshCw,
  Key,
  ShieldAlert,
  FolderGit2,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GitHubStatus {
  configured: boolean;
  authenticated?: boolean;
  username?: string;
  repo?: string;
  repoUrl?: string;
  hasWriteAccess?: boolean;
  needsContentsPermission?: boolean;
  message?: string;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useCreator();
  const [loading, setLoading] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [status, setStatus] = useState<GitHubStatus | null>(null);
  const [customToken, setCustomToken] = useState('');
  const [customRepo, setCustomRepo] = useState('my-applet-');
  const [customUser, setCustomUser] = useState('shiv-st');
  const [pushResult, setPushResult] = useState<{ success: boolean; message: string; details?: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch status on modal open
  useEffect(() => {
    if (isOpen) {
      checkGitHubStatus();
    }
  }, [isOpen]);

  const checkGitHubStatus = async () => {
    setLoading(true);
    setPushResult(null);
    try {
      const res = await fetch('/api/github/status');
      const data = await res.json();
      setStatus(data);
      if (data.username) setCustomUser(data.username);
      if (data.repo && data.repo.includes('/')) {
        setCustomRepo(data.repo.split('/')[1]);
      }
    } catch (e: any) {
      setStatus({
        configured: false,
        message: 'Could not connect to local server'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePush = async () => {
    setPushing(true);
    setPushResult(null);
    try {
      const res = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: customToken || undefined,
          username: customUser,
          repo: customRepo
        })
      });

      const data = await res.json();
      setPushResult({
        success: data.success,
        message: data.message,
        details: data.details || data.output
      });

      if (data.success) {
        showToast('Successfully pushed all code to your GitHub repository!', 'success');
        checkGitHubStatus();
      } else {
        showToast(data.message || 'Push failed', 'warning');
      }
    } catch (err: any) {
      setPushResult({
        success: false,
        message: err.message || 'Network error during push'
      });
    } finally {
      setPushing(false);
    }
  };

  const handleDownloadArchive = () => {
    window.location.href = '/api/export/download';
    showToast('Starting project download (.tar.gz archive)...', 'info');
  };

  const copyRepoUrl = () => {
    const url = `https://github.com/${customUser}/${customRepo}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0f111a] border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                GitHub Sync & Code Export
              </h2>
              <p className="text-xs text-slate-400">
                Push your applet code directly to GitHub or download full project archive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Target Repository Info */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FolderGit2 className="w-6 h-6 text-purple-400 shrink-0" />
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Target GitHub Repository
                </span>
                <div className="font-mono text-sm text-white font-medium flex items-center gap-2">
                  <span>github.com/{customUser}/{customRepo}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyRepoUrl}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copied' : 'Copy'}
              </button>
              <a
                href={`https://github.com/${customUser}/${customRepo}`}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs flex items-center gap-1.5 transition border border-purple-500/30"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open
              </a>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2.5">
              {loading ? (
                <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />
              ) : status?.hasWriteAccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : status?.authenticated ? (
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span className="text-xs text-slate-300">
                {loading
                  ? 'Verifying GitHub credentials & permissions...'
                  : status?.hasWriteAccess
                  ? 'Authenticated: Ready to push directly to GitHub'
                  : status?.authenticated
                  ? 'Authenticated as shiv-st: Token lacks write permission (HTTP 403)'
                  : 'Token check: ' + (status?.message || 'Not configured')}
              </span>
            </div>
            <button
              onClick={checkGitHubStatus}
              disabled={loading}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Step-by-Step Instructions if 403 or write permission missing */}
          {status?.authenticated && !status.hasWriteAccess && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-600/40 text-amber-200 space-y-3">
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>One-Time Step to Enable Write / Push Access on GitHub</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                GitHub Fine-Grained tokens (like your token <code className="bg-amber-900/50 px-1 py-0.5 rounded font-mono">hx</code>) default to Read-Only. You just need to grant it repository write access:
              </p>
              <ol className="text-xs space-y-2 list-decimal list-inside text-amber-100 bg-black/20 p-3 rounded-lg border border-amber-500/20 font-mono">
                <li>Go to <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noreferrer" className="underline font-bold text-amber-300 hover:text-white inline-flex items-center gap-1">GitHub Fine-grained Tokens <ExternalLink className="w-3 h-3 inline" /></a></li>
                <li>Click on your token <strong>hx</strong> to edit it</li>
                <li>Scroll to <strong>Repository permissions</strong> &rarr; find <strong>Contents</strong></li>
                <li>Change Access from <em>No access</em> to <strong>Read and write</strong></li>
                <li>Click <strong>Update token</strong> at the bottom</li>
              </ol>
              <p className="text-xs text-amber-300/80">
                💡 <em>Tip: Once updated on GitHub, simply click the <strong>Push Now to GitHub</strong> button below without needing to re-copy anything!</em>
              </p>
            </div>
          )}

          {/* Custom Token Input (Optional override) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-400" />
                Personal Access Token (Configured)
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                Stored safely in backend server
              </span>
            </label>
            <input
              type="password"
              placeholder="Paste updated token here (optional if already configured)"
              value={customToken}
              onChange={(e) => setCustomToken(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/60 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 font-mono"
            />
          </div>

          {/* Push Result Banner */}
          {pushResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs ${
                pushResult.success
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : 'bg-red-950/30 border-red-500/40 text-red-200'
              }`}
            >
              <div className="flex items-center gap-2 font-medium">
                {pushResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{pushResult.message}</span>
              </div>
              {pushResult.details && (
                <pre className="mt-2 text-[11px] font-mono p-2 bg-black/40 rounded overflow-x-auto text-slate-300 max-h-24">
                  {pushResult.details}
                </pre>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePush}
              disabled={pushing}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition disabled:opacity-50"
            >
              {pushing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Pushing Code to GitHub...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  Push Now to GitHub
                </>
              )}
            </button>

            <button
              onClick={handleDownloadArchive}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-2 transition"
              title="Download entire codebase as .tar.gz"
            >
              <Download className="w-4 h-4 text-slate-400" />
              Download Archive (.tar.gz)
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-500">
            Pushing exports all 49 source files, Vite setup, full Express backend, and assets to <code className="text-slate-400 font-mono">shiv-st/my-applet-</code> on branch <code className="text-slate-400 font-mono">main</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
