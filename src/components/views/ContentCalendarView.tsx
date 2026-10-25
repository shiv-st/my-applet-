import React, { useState } from 'react';
import { useCreator } from '../../context/CreatorContext';
import { ContentCalendarItem, ContentStatus, VideoFormat } from '../../types';
import {
  Calendar as CalendarIcon,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Bell,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

const STATUS_OPTIONS: ContentStatus[] = [
  'Idea',
  'Scripting',
  'Recording',
  'Editing',
  'Scheduled',
  'Published'
];

const STATUS_COLORS: Record<ContentStatus, { bg: string; text: string; border: string }> = {
  Idea: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30' },
  Scripting: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
  Recording: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30' },
  Editing: { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  Scheduled: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
  Published: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30' }
};

export const ContentCalendarView: React.FC = () => {
  const { calendarItems, addCalendarItem, updateCalendarItem, deleteCalendarItem, showToast } = useCreator();

  const [activeTab, setActiveTab] = useState<'month' | 'list'>('month');
  const [filterGame, setFilterGame] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // New Event Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newGame, setNewGame] = useState<string>('Minecraft');
  const [newFormat, setNewFormat] = useState<VideoFormat>('Long-form (16:9)');
  const [newStatus, setNewStatus] = useState<ContentStatus>('Idea');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState<string>('15:00');
  const [newNotes, setNewNotes] = useState<string>('');
  const [newReminder, setNewReminder] = useState<boolean>(true);

  // Month navigation (current year and month)
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filter items
  const filteredItems = calendarItems.filter(item => {
    const matchesGame = filterGame === 'All' || item.game.toLowerCase() === filterGame.toLowerCase();
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    return matchesGame && matchesStatus;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCalendarItem({
      title: newTitle,
      game: newGame,
      contentType: newFormat,
      status: newStatus,
      scheduledDate: newDate,
      targetTime: newTime,
      notes: newNotes,
      reminderSet: newReminder,
      tasks: [
        { name: 'Plan Concept & Hook', completed: true },
        { name: 'Record Footage', completed: false },
        { name: 'Edit Video & Audio', completed: false },
        { name: 'Prepare Thumbnail & Title', completed: false }
      ]
    });

    setIsModalOpen(false);
    setNewTitle('');
    setNewNotes('');
  };

  // Build calendar matrix
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarCells = [];

  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  const uniqueGames = Array.from(new Set(calendarItems.map(i => i.game)));

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Publishing Strategy & Cadence</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
            YouTube Content Pipeline Calendar
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Schedule uploads, track video progress across 6 production stages, set publishing deadlines, and avoid channel publishing gaps.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-heading font-black text-xs shadow-xl shadow-purple-600/30 flex items-center gap-2 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Video</span>
        </button>
      </div>

      {/* Filter and View Switch Bar */}
      <div className="p-4 rounded-2xl bg-[#121422] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Game filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Game:</span>
            <select
              value={filterGame}
              onChange={e => setFilterGame(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none"
            >
              <option value="All">All Games</option>
              {uniqueGames.map(g => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Status:</span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none"
            >
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Switcher: Month / List */}
        <div className="flex p-1 rounded-xl bg-[#0e101b] border border-white/10">
          <button
            onClick={() => setActiveTab('month')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'month' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400'
            }`}
          >
            Month Grid
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'list' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400'
            }`}
          >
            List Pipeline
          </button>
        </div>
      </div>

      {activeTab === 'month' ? (
        /* Month Grid View */
        <div className="p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-2xl space-y-4">
          {/* Month Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h2 className="font-heading font-black text-xl text-white">
              {monthNames[month]} {year}
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-[#0e101a] hover:bg-[#1a1d30] text-slate-300 hover:text-white transition-colors"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-[#0e101a] hover:bg-[#1a1d30] text-slate-300 hover:text-white transition-colors"
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider py-1">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="min-h-[105px] rounded-2xl bg-white/[0.01]" />;
              }

              const formattedDay = day < 10 ? `0${day}` : `${day}`;
              const formattedMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
              const dateString = `${year}-${formattedMonth}-${formattedDay}`;

              const dayVideos = filteredItems.filter(item => item.scheduledDate === dateString);

              return (
                <div
                  key={`day-${day}`}
                  className="min-h-[105px] p-2 rounded-2xl bg-[#0e101a] border border-white/5 flex flex-col justify-between hover:border-purple-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-code font-bold text-slate-400 group-hover:text-white">
                      {day}
                    </span>
                    {dayVideos.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}
                  </div>

                  {/* Video tags */}
                  <div className="space-y-1 my-1 flex-1">
                    {dayVideos.map(video => {
                      const colors = STATUS_COLORS[video.status];
                      return (
                        <div
                          key={video.id}
                          onClick={() => {
                            const nextStatusIndex = (STATUS_OPTIONS.indexOf(video.status) + 1) % STATUS_OPTIONS.length;
                            updateCalendarItem(video.id, { status: STATUS_OPTIONS[nextStatusIndex] });
                          }}
                          className={`p-1 rounded-lg text-[10px] font-bold border truncate cursor-pointer transition-all ${colors.bg} ${colors.text} ${colors.border}`}
                          title={`${video.title} (${video.status}) - Click to advance status`}
                        >
                          {video.title}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      setNewDate(dateString);
                      setIsModalOpen(true);
                    }}
                    className="text-[10px] text-slate-600 hover:text-purple-400 text-left font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    + Add video
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List Pipeline View */
        <div className="space-y-3">
          {filteredItems.map(item => {
            const colors = STATUS_COLORS[item.status];
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#121422] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-purple-500/30 transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      {item.game}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {item.contentType}
                    </span>
                    {item.reminderSet && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-300">
                        <Bell className="w-3 h-3" />
                        <span>Reminder Active</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {item.title}
                  </h3>
                  {item.notes && (
                    <p className="text-xs text-slate-400 italic">"{item.notes}"</p>
                  )}
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upload Date: {item.scheduledDate} {item.targetTime ? `at ${item.targetTime}` : ''}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Status Dropdown */}
                  <select
                    value={item.status}
                    onChange={e => updateCalendarItem(item.id, { status: e.target.value as ContentStatus })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none ${colors.bg} ${colors.text} ${colors.border}`}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s} className="bg-[#121422] text-white">
                        {s}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => deleteCalendarItem(item.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Video Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0f111d] border border-purple-500/30 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-heading font-black text-lg text-white">
                Schedule Video on Pipeline
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
                aria-label="Close schedule modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Video Working Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. I Survived 100 Days In Hardcore Minecraft"
                  className="w-full px-3 py-2 rounded-xl bg-[#141624] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    Game
                  </label>
                  <input
                    type="text"
                    value={newGame}
                    onChange={e => setNewGame(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141624] border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    Format
                  </label>
                  <select
                    value={newFormat}
                    onChange={e => setNewFormat(e.target.value as VideoFormat)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141624] border border-white/10 text-xs text-white focus:outline-none"
                  >
                    <option value="Long-form (16:9)">Long-form (16:9)</option>
                    <option value="Short-form (9:16)">Short-form (9:16)</option>
                    <option value="Live Stream">Live Stream</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141624] border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    Target Time (Local)
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141624] border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Initial Status
                </label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as ContentStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141624] border border-white/10 text-xs text-white focus:outline-none"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Production Notes & Checklist
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="e.g. End cards linking to Ep 2, test 3 thumbnail colors"
                  className="w-full p-2.5 rounded-xl bg-[#141624] border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="reminderCheck"
                  checked={newReminder}
                  onChange={e => setNewReminder(e.target.checked)}
                  className="rounded accent-purple-500"
                />
                <label htmlFor="reminderCheck" className="text-xs text-slate-300">
                  Enable personal publishing reminder
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30"
                >
                  Schedule Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
