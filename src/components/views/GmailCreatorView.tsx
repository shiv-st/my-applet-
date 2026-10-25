import React, { useState, useEffect } from 'react';
import { useCreator } from '../../context/CreatorContext';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken
} from '../../services/gmailAuth';
import {
  listGmailMessages,
  getMessageDetails,
  sendGmailMessage,
  deleteGmailMessage,
  GmailMessageItem,
  fetchUserProfile
} from '../../services/gmailService';
import { User } from 'firebase/auth';
import {
  Mail,
  Send,
  Trash2,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  Inbox,
  CheckCircle2,
  FileEdit,
  ExternalLink,
  Search,
  UserCheck,
  AlertTriangle,
  X,
  Loader2,
  Lock
} from 'lucide-react';

const SPONSOR_TEMPLATES = [
  {
    id: 'sponsor_pitch',
    title: 'Brand Sponsorship Pitch',
    subject: 'Collaboration & Sponsorship Inquiry — ViperX Gaming',
    body: `Hi Team,\n\nI hope you're having a great week! My name is Alex, and I run ViperX Gaming on YouTube (28K+ subscribers, ~150K monthly views focusing on Minecraft & competitive gaming).\n\nWe have an upcoming challenge series scheduled for next month that reaches our core 18-34 gaming audience. We would love to feature your brand with an integrated 60-second mid-roll segment and dedicated description link.\n\nCould we explore a quick partnership? I've attached our media kit overview and would be happy to share custom rate cards.\n\nBest regards,\nAlex (ViperX Gaming)\nhttps://youtube.com/@ViperXGames`
  },
  {
    id: 'game_key',
    title: 'Publisher Early Access Key Request',
    subject: 'Coverage Request & Review Key — ViperX Gaming',
    body: `Hello PR Team,\n\nI am a gaming YouTuber covering challenge runs, tutorials, and early impressions. I am writing to request a preview key or early access code for your upcoming title.\n\nOur channel consistently delivers high viewer retention (>50%) and we are planning a dedicated premiere video on launch week.\n\nSteam Profile / Creator ID: ViperX_Official\nChannel: https://youtube.com/@ViperXGames\n\nThank you for your time and congratulations on the upcoming launch!\n\nCheers,\nAlex`
  },
  {
    id: 'collab_invite',
    title: 'Creator Collaboration Invite',
    subject: 'Video Collaboration Idea — 100 Days Hardcore Survival',
    body: `Hey there!\n\nBig fan of your recent videos! I was checking out your challenge content and had an idea for a joint 2-player hardcore survival challenge video next week.\n\nWe can cross-promote each other's channel perspectives and test an escape room map. Let me know if you're down to hop on Discord to brainstorm!\n\nBest,\nAlex | ViperX Gaming\nDiscord: ViperX#1337`
  }
];

export const GmailCreatorView: React.FC = () => {
  const { showToast } = useCreator();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');

  // Messages state
  const [messages, setMessages] = useState<GmailMessageItem[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageItem | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Composer state
  const [composeTo, setComposeTo] = useState<string>('');
  const [composeSubject, setComposeSubject] = useState<string>('');
  const [composeBody, setComposeBody] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  // Mandatory Destructive Confirmation Modals
  const [confirmSendOpen, setConfirmSendOpen] = useState<boolean>(false);
  const [messageToDelete, setMessageToDelete] = useState<GmailMessageItem | null>(null);

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (authenticatedUser, accessToken) => {
        setUser(authenticatedUser);
        setToken(accessToken);
        setIsAuthLoading(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setIsAuthLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch messages when authenticated
  useEffect(() => {
    if (token) {
      loadMessages();
    }
  }, [token]);

  const loadMessages = async (query = '') => {
    setIsLoadingMessages(true);
    try {
      const data = await listGmailMessages(15, query);
      setMessages(data);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to load emails', 'warning');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleLogin = async () => {
    try {
      setIsAuthLoading(true);
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        showToast('Successfully connected to Gmail!');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to authenticate with Google', 'warning');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setMessages([]);
    setSelectedMessage(null);
    showToast('Signed out of Gmail.');
  };

  const handleSelectMessage = async (msg: GmailMessageItem) => {
    try {
      const full = await getMessageDetails(msg.id);
      setSelectedMessage(full);
    } catch (err) {
      setSelectedMessage(msg);
    }
  };

  const handleApplyTemplate = (template: typeof SPONSOR_TEMPLATES[0]) => {
    setComposeSubject(template.subject);
    setComposeBody(template.body);
    setActiveTab('compose');
    showToast(`Loaded "${template.title}" template!`);
  };

  // Trigger Send Confirmation
  const handleInitiateSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
      showToast('Please fill out all fields before sending.', 'warning');
      return;
    }
    // Show mandatory confirmation dialog
    setConfirmSendOpen(true);
  };

  // Perform Send upon confirmation
  const handleConfirmSend = async () => {
    setConfirmSendOpen(false);
    setIsSending(true);
    try {
      await sendGmailMessage({
        to: composeTo,
        subject: composeSubject,
        body: composeBody
      });
      showToast(`Email sent successfully to ${composeTo}!`, 'success');
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      setActiveTab('inbox');
      loadMessages();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to send email', 'warning');
    } finally {
      setIsSending(false);
    }
  };

  // Trigger Delete Confirmation
  const handleInitiateDelete = (msg: GmailMessageItem) => {
    setMessageToDelete(msg);
  };

  // Perform Delete upon confirmation
  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;
    const target = messageToDelete;
    setMessageToDelete(null);
    try {
      await deleteGmailMessage(target.id);
      setMessages(prev => prev.filter(m => m.id !== target.id));
      if (selectedMessage?.id === target.id) {
        setSelectedMessage(null);
      }
      showToast('Email moved to trash.', 'info');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to delete email', 'warning');
    }
  };

  if (isAuthLoading) {
    return (
      <div className="p-12 text-center rounded-3xl bg-[#121422] border border-white/10 space-y-3">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
        <p className="text-sm text-slate-300">Checking Google Workspace authorization...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>Official Google Workspace Integration</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
            Creator Gmail & Sponsorship Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Manage incoming brand deals, review code requests from game publishers, and send professional sponsorship pitches directly with your verified Gmail account.
          </p>
        </div>

        {/* Authentication Button & User Status */}
        {user ? (
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-[#121422] border border-white/10">
            <div className="flex items-center gap-2 px-2 text-xs">
              <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white text-xs">
                {user.email ? user.email[0].toUpperCase() : 'G'}
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-white max-w-[150px] truncate">{user.displayName || 'Creator'}</div>
                <div className="text-[10px] text-slate-400 max-w-[150px] truncate">{user.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
            >
              Disconnect
            </button>
          </div>
        ) : (
          /* Official Sign in with Google Button */
          <button
            onClick={handleLogin}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-xl shadow-white/10 transition-all active:scale-95 self-start sm:self-auto"
            aria-label="Sign in with Google"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google to Connect Gmail</span>
          </button>
        )}
      </div>

      {!user ? (
        /* Unauthenticated State */
        <div className="p-10 text-center rounded-3xl bg-[#121422] border border-white/10 space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
            <Mail className="w-7 h-7" />
          </div>
          <h2 className="font-heading font-black text-2xl text-white">
            Connect Your Creator Gmail
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Link your YouTube channel email to read brand collaboration proposals, review early access game keys, and send pitches without leaving GameCreator AI.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left text-xs text-slate-300 pt-2">
            <div className="p-3 rounded-xl bg-[#0e101a] border border-white/5 space-y-1">
              <span className="font-bold text-red-400">Brand Sponsorships</span>
              <p className="text-[11px] text-slate-400">Receive and reply to sponsor campaign offers.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0e101a] border border-white/5 space-y-1">
              <span className="font-bold text-cyan-400">Game Publisher Keys</span>
              <p className="text-[11px] text-slate-400">Pitch developers for Steam & console review keys.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0e101a] border border-white/5 space-y-1">
              <span className="font-bold text-emerald-400">Collaborations</span>
              <p className="text-[11px] text-slate-400">Coordinate videos with other gaming YouTubers.</p>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-heading font-black text-xs shadow-xl shadow-red-600/25 transition-all"
          >
            Authorize Gmail Access Now
          </button>
        </div>
      ) : (
        /* Authenticated Workspace */
        <div className="space-y-6">
          {/* Quick Creator Pitch Templates Ribbon */}
          <div className="p-5 rounded-2xl bg-[#121422] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>1-Click Gaming Outreach Templates</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SPONSOR_TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleApplyTemplate(t)}
                  className="p-3 rounded-xl bg-[#0e101a] hover:bg-[#16182c] border border-white/5 hover:border-purple-500/30 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-white group-hover:text-purple-300">
                    {t.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {t.subject}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Switcher & Refresh */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex p-1 rounded-xl bg-[#121422] border border-white/10 shrink-0">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'inbox' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Inbox ({messages.length})
              </button>
              <button
                onClick={() => setActiveTab('compose')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'compose' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Compose Pitch
              </button>
            </div>

            {activeTab === 'inbox' && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter inbox (e.g. sponsor, key)..."
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') loadMessages(searchFilter);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={() => loadMessages(searchFilter)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                  title="Refresh inbox"
                  aria-label="Refresh inbox"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                </button>
              </div>
            )}
          </div>

          {/* Inbox Tab Content */}
          {activeTab === 'inbox' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Message List (2 cols) */}
              <div className="lg:col-span-2 p-4 rounded-3xl bg-[#121422] border border-white/10 shadow-xl space-y-2 max-h-[600px] overflow-y-auto">
                {isLoadingMessages ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-400" />
                    <span>Loading your creator emails...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No emails found in this query.
                  </div>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        selectedMessage?.id === msg.id
                          ? 'bg-purple-950/30 border-purple-500/50'
                          : 'bg-[#0e101a] border-white/5 hover:border-purple-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-white truncate max-w-[140px]">
                          {msg.from?.replace(/<.*>/, '').trim()}
                        </span>
                        <span className="text-slate-500">{msg.date?.slice(0, 16)}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-200 truncate">
                        {msg.subject}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                        {msg.snippet}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Message Details Preview (3 cols) */}
              <div className="lg:col-span-3 p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-xl flex flex-col justify-between min-h-[400px]">
                {selectedMessage ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <h2 className="font-heading font-black text-lg text-white">
                          {selectedMessage.subject}
                        </h2>
                        <div className="text-xs text-slate-400 mt-1">
                          From: <strong className="text-purple-300">{selectedMessage.from}</strong>
                        </div>
                        <div className="text-[11px] text-slate-500">{selectedMessage.date}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setComposeTo(selectedMessage.from?.match(/<([^>]+)>/)?.[1] || selectedMessage.from || '');
                            setComposeSubject(`Re: ${selectedMessage.subject}`);
                            setComposeBody(`\n\n--- On ${selectedMessage.date}, ${selectedMessage.from} wrote:\n> ${selectedMessage.snippet}`);
                            setActiveTab('compose');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 text-xs font-bold"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => handleInitiateDelete(selectedMessage)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-white/5"
                          title="Trash Email"
                          aria-label="Trash Email"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0e101a] border border-white/5 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto font-sans">
                      {selectedMessage.bodyText || selectedMessage.snippet}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 p-8 text-center text-slate-500 space-y-2">
                    <Inbox className="w-10 h-10 text-slate-600" />
                    <p className="text-xs">Select any email on the left to read full correspondence.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compose Tab Content */}
          {activeTab === 'compose' && (
            <div className="p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-heading font-black text-lg text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-purple-400" />
                  <span>Compose Pitch / Sponsorship Email</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono-code">
                  From: {user.email}
                </span>
              </div>

              <form onSubmit={handleInitiateSend} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    Recipient Email (To)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sponsor@brand.com, pr@publisher.com"
                    value={composeTo}
                    onChange={e => setComposeTo(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brand Partnership Proposal — ViperX Gaming"
                    value={composeSubject}
                    onChange={e => setComposeSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    Email Message
                  </label>
                  <textarea
                    rows={10}
                    required
                    value={composeBody}
                    onChange={e => setComposeBody(e.target.value)}
                    placeholder="Write your pitch or proposal..."
                    className="w-full p-4 rounded-2xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400 leading-relaxed font-sans"
                  />
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Requires explicit confirmation before sending.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Review & Send Email</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Mandatory User Confirmation Dialog for Sending Email */}
      {confirmSendOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0f111d] border border-purple-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-heading font-black text-lg text-white">
                Confirm Email Dispatch
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to send this email on behalf of your connected Google account (<span className="text-white font-semibold">{user?.email}</span>)?
            </p>

            <div className="p-3 rounded-2xl bg-[#141624] border border-white/10 space-y-1 text-xs">
              <div>
                <span className="text-slate-400">To:</span> <strong className="text-cyan-300">{composeTo}</strong>
              </div>
              <div>
                <span className="text-slate-400">Subject:</span> <strong className="text-white">{composeSubject}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2.5">
              <button
                onClick={() => setConfirmSendOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSend}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30"
              >
                Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Dialog for Deleting / Trashing Email */}
      {messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0f111d] border border-red-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h3 className="font-heading font-black text-lg text-white">
                Move Email to Trash?
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to move this email message to Trash? This will remove it from your Gmail inbox.
            </p>

            <div className="p-3 rounded-2xl bg-[#141624] border border-white/10 space-y-1 text-xs">
              <div>
                <span className="text-slate-400">Subject:</span> <strong className="text-white">{messageToDelete.subject}</strong>
              </div>
              <div>
                <span className="text-slate-400">From:</span> <span className="text-slate-300">{messageToDelete.from}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2.5">
              <button
                onClick={() => setMessageToDelete(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg shadow-red-600/30"
              >
                Confirm & Move to Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
