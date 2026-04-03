'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Plus, X, Edit2, BookOpen, Play, Square,
  Clock, Target, TrendingUp
} from 'lucide-react';

interface StudySession {
  id: number;
  topicId: number;
  startTime: string;
  endTime: string;
  notes: string;
  durationMinutes: number;
}

interface StudyTopic {
  id: number;
  title: string;
  category: string;
  description: string;
  targetMinutes: number;
  sessions: StudySession[];
}

interface TopicSummary {
  id: number;
  title: string;
  category: string;
  targetMinutes: number;
  totalMinutes: number;
  minutesToday: number;
  minutesThisWeek: number;
  sessionCount: number;
}

const CATEGORIES = ['programming', 'devops', 'soft-skills', 'other'];

function categoryColor(category: string) {
  switch (category) {
    case 'programming': return 'text-blue-400 bg-blue-900/20 border-blue-800/30';
    case 'devops': return 'text-green-400 bg-green-900/20 border-green-800/30';
    case 'soft-skills': return 'text-pink-400 bg-pink-900/20 border-pink-800/30';
    default: return 'text-gray-400 bg-gray-800/20 border-gray-700/30';
  }
}

function formatMinutes(mins: number) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatTimer(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function StudyPage() {
  const { token, isAuthenticated, authLoading } = useAuth();
  const router = useRouter();

  const [topics, setTopics] = useState<StudyTopic[]>([]);
  const [summary, setSummary] = useState<TopicSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState<StudyTopic | null>(null);
  const [saving, setSaving] = useState(false);

  // Timer state
  const [activeTimer, setActiveTimer] = useState<number | null>(null); // topicId
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [sessionNotes, setSessionNotes] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Create form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('programming');
  const [description, setDescription] = useState('');
  const [targetMinutes, setTargetMinutes] = useState(60);

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/lifeos/login');
      return;
    }
    fetchAll();
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (token) fetchAll();
  }, [token]);

  // Timer tick
  useEffect(() => {
    if (activeTimer !== null) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimerSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTimer]);

  const fetchAll = async () => {
    try {
      const [topicsRes, summaryRes] = await Promise.all([
        fetch('/api/lifeos/study', { headers: authHeaders }),
        fetch('/api/lifeos/study/summary', { headers: authHeaders }),
      ]);
      if (topicsRes.ok) {
        const json = await topicsRes.json();
        setTopics(json.data || json || []);
      }
      if (summaryRes.ok) {
        const json = await summaryRes.json();
        setSummary(json.data || json || []);
      }
    } catch (err) {
      console.error('fetchAll error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/lifeos/study', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ title, category, description, targetMinutes }),
      });
      if (res.ok) {
        setTitle('');
        setCategory('programming');
        setDescription('');
        setTargetMinutes(60);
        setShowForm(false);
        await fetchAll();
      }
    } catch (err) {
      console.error('Create topic error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (topic: StudyTopic) => {
    try {
      await fetch(`/api/lifeos/study/${topic.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(topic),
      });
      setEditingTopic(null);
      await fetchAll();
    } catch (err) {
      console.error('Update topic error:', err);
    }
  };

  const handleStartTimer = (topicId: number) => {
    setActiveTimer(topicId);
    setStartTime(new Date());
    setSessionNotes('');
  };

  const handleStopTimer = async () => {
    if (!activeTimer || !startTime) return;

    const endTime = new Date();

    try {
      await fetch(`/api/lifeos/study/${activeTimer}/sessions`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          notes: sessionNotes,
        }),
      });
      await fetchAll();
    } catch (err) {
      console.error('Stop timer error:', err);
    } finally {
      setActiveTimer(null);
      setStartTime(null);
      setSessionNotes('');
    }
  };

  // Total minutes today across all topics
  const totalToday = summary.reduce((acc, t) => acc + t.minutesToday, 0);
  const totalThisWeek = summary.reduce((acc, t) => acc + t.minutesThisWeek, 0);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0f0a] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Study</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {formatMinutes(totalToday)} today · {formatMinutes(totalThisWeek)} this week
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Cancel' : 'New topic'}
          </button>
        </div>

        {/* Active timer banner */}
        {activeTimer !== null && (
          <div className="bg-teal-900/40 border border-teal-700/50 rounded-xl p-4 mb-6 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-teal-400 text-sm font-medium">
                Studying: {topics.find(t => t.id === activeTimer)?.title}
              </p>
              <p className="text-white text-3xl font-mono font-bold mt-1">
                {formatTimer(timerSeconds)}
              </p>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <input
                type="text"
                value={sessionNotes}
                onChange={e => setSessionNotes(e.target.value)}
                placeholder="Session notes (optional)..."
                className="bg-gray-800/60 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-teal-600 transition-colors"
              />
              <button
                onClick={handleStopTimer}
                className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Square className="h-4 w-4" />
                Stop & Save Session
              </button>
            </div>
          </div>
        )}

        {/* Create form */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="bg-gray-900/60 border border-teal-900/40 rounded-xl p-6 mb-6"
          >
            <h2 className="text-white font-semibold mb-4">Create a new topic</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="md:col-span-2">
                <label className="block text-sm text-teal-400/80 mb-1.5">Topic title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  placeholder="e.g. TypeScript, Docker, System Design..."
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-teal-400/80 mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="What are you studying and why?"
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-teal-600 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-teal-400/80 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-600 transition-colors capitalize"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-teal-400/80 mb-1.5">
                  Weekly target (minutes)
                </label>
                <input
                  type="number"
                  min={0}
                  step={15}
                  value={targetMinutes}
                  onChange={e => setTargetMinutes(Number(e.target.value))}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-600 transition-colors"
                />
              </div>

            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-teal-700 hover:bg-teal-600 disabled:bg-teal-900 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {saving ? 'Creating...' : 'Create topic'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Topics list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse h-32 bg-gray-900/60 rounded-xl" />
            ))}
          </div>
        ) : topics.length === 0 ? (
          <div className="bg-gray-900/60 border border-teal-900/30 rounded-xl p-12 text-center">
            <BookOpen className="h-10 w-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-600 mb-3">No study topics yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-teal-800/40 hover:bg-teal-700/40 text-teal-400 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create your first topic
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map(topic => {
              const topicSummary = summary.find(s => s.id === topic.id);
              const weeklyProgress = topicSummary && topic.targetMinutes > 0
                ? Math.min(Math.round((topicSummary.minutesThisWeek / topic.targetMinutes) * 100), 100)
                : 0;
              const isRunning = activeTimer === topic.id;

              return (
                <div
                  key={topic.id}
                  className={`bg-gray-900/60 border rounded-xl p-5 transition-all ${
                    isRunning
                      ? 'border-teal-600/50 shadow-lg shadow-teal-900/20'
                      : 'border-teal-900/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">

                      {/* Title + category */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-white font-semibold">{topic.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${categoryColor(topic.category)}`}>
                          {topic.category}
                        </span>
                      </div>

                      {topic.description && (
                        <p className="text-gray-500 text-sm mb-3">{topic.description}</p>
                      )}

                      {/* Stats row */}
                      <div className="flex items-center gap-4 flex-wrap mb-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>Today: <span className="text-teal-400">{formatMinutes(topicSummary?.minutesToday ?? 0)}</span></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <TrendingUp className="h-3 w-3" />
                          <span>This week: <span className="text-teal-400">{formatMinutes(topicSummary?.minutesThisWeek ?? 0)}</span></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <BookOpen className="h-3 w-3" />
                          <span>{topicSummary?.sessionCount ?? 0} sessions total</span>
                        </div>
                      </div>

                      {/* Weekly target progress */}
                      {topic.targetMinutes > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">
                              Weekly target: {formatMinutes(topicSummary?.minutesThisWeek ?? 0)} / {formatMinutes(topic.targetMinutes)}
                            </span>
                            <span className="text-xs text-teal-500">{weeklyProgress}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-teal-500 rounded-full transition-all"
                              style={{ width: `${weeklyProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {activeTimer === null && (
                        <button
                          onClick={() => handleStartTimer(topic.id)}
                          className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                        >
                          <Play className="h-3.5 w-3.5" />
                          Start
                        </button>
                      )}
                      <button
                        onClick={() => setEditingTopic(topic)}
                        className="text-gray-600 hover:text-teal-400 p-1.5 rounded transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Edit Modal */}
      {editingTopic && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-teal-900/40 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold text-lg">Edit Topic</h2>
              <button
                onClick={() => setEditingTopic(null)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">

              <div>
                <label className="block text-sm text-teal-400/80 mb-1.5">Title</label>
                <input
                  type="text"
                  value={editingTopic.title}
                  onChange={e => setEditingTopic({ ...editingTopic, title: e.target.value })}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-teal-400/80 mb-1.5">Description</label>
                <textarea
                  value={editingTopic.description || ''}
                  onChange={e => setEditingTopic({ ...editingTopic, description: e.target.value })}
                  rows={2}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-600 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-teal-400/80 mb-1.5">Category</label>
                <select
                  value={editingTopic.category}
                  onChange={e => setEditingTopic({ ...editingTopic, category: e.target.value })}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-600 transition-colors"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-teal-400/80 mb-1.5">
                  Weekly target (minutes)
                </label>
                <input
                  type="number"
                  min={0}
                  step={15}
                  value={editingTopic.targetMinutes}
                  onChange={e => setEditingTopic({ ...editingTopic, targetMinutes: Number(e.target.value) })}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-600 transition-colors"
                />
              </div>

            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleUpdate(editingTopic)}
                className="flex-1 bg-teal-700 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Save changes
              </button>
              <button
                onClick={() => setEditingTopic(null)}
                className="px-4 py-2 text-gray-400 hover:text-white rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}