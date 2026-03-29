'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Plus, CheckCircle2, Circle, X,
  Flame, Edit2
} from 'lucide-react';

interface Habit {
  id: number;
  name: string;
  color: string;
  frequency: string;
  targetCount: number;
  isActive: boolean;
  completions: Completion[];
}

interface Completion {
  id: number;
  completedAt: string;
}

interface TodayHabit {
  id: number;
  name: string;
  color: string;
  targetCount: number;
  completedToday: number;
  isDone: boolean;
}

const COLORS = [
  '#10b981', '#6366f1', '#f59e0b',
  '#ef4444', '#8b5cf6', '#06b6d4',
  '#ec4899', '#84cc16',
];

function getStreakCount(completions: Completion[]): number {
  if (!completions?.length) return 0;
  const dates = completions
    .map(c => new Date(c.completedAt).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  let current = new Date();
  current.setHours(0, 0, 0, 0);

  for (const dateStr of dates) {
    const date = new Date(dateStr);
    const diff = Math.floor((current.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === streak) streak++;
    else break;
  }
  return streak;
}

export default function HabitsPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayHabits, setTodayHabits] = useState<TodayHabit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [completing, setCompleting] = useState<number | null>(null);

  // New habit form state
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [targetCount, setTargetCount] = useState(1);
  const [color, setColor] = useState(COLORS[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.push('/lifeos/login');
  }, [isAuthenticated, router]);

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const fetchHabits = async () => {
    try {
      const [habitsRes, todayRes] = await Promise.all([
        fetch('/api/lifeos/habits', { headers: authHeaders }),
        fetch('/api/lifeos/habits/today', { headers: authHeaders }),
      ]);
      if (habitsRes.ok) setHabits((await habitsRes.json()).data || []);
      if (todayRes.ok) setTodayHabits((await todayRes.json()).data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchHabits();
  }, [token]);

  const handleComplete = async (id: number) => {
    setCompleting(id);
    try {
      await fetch(`/api/lifeos/habits/${id}/complete`, {
        method: 'POST',
        headers: authHeaders,
      });
      await fetchHabits();
    } finally {
      setCompleting(null);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/lifeos/habits', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ name, frequency, targetCount, color, isActive: true }),
      });
      setName('');
      setFrequency('daily');
      setTargetCount(1);
      setColor(COLORS[0]);
      setShowForm(false);
      await fetchHabits();
    } finally {
      setSaving(false);
    }
  };

  const completedCount = todayHabits.filter(h => h.isDone).length;

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0f0a] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Habits</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {completedCount} of {todayHabits.length} completed today
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {showForm ? <X className="h-4 w-4"/> : <Plus className="h-4 w-4"/>}
            {showForm ? 'Cancel' : 'New habit'}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="bg-gray-900/60 border border-green-900/40 rounded-xl p-6 mb-6"
          >
            <h2 className="text-white font-semibold mb-4">Create a new habit</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="md:col-span-2">
                <label className="block text-sm text-green-400/80 mb-1.5">Habit name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="e.g. Morning run, Read 20 pages..."
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-green-400/80 mb-1.5">Frequency</label>
                <select
                  value={frequency}
                  onChange={e => setFrequency(e.target.value)}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-600 transition-colors"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-green-400/80 mb-1.5">Times per day</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={targetCount}
                  onChange={e => setTargetCount(Number(e.target.value))}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-600 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-green-400/80 mb-1.5">Colour</label>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-white/30' : 'hover:scale-110'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-green-700 hover:bg-green-600 disabled:bg-green-900 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {saving ? 'Creating...' : 'Create habit'}
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

        {/* Today's habits */}
        <div className="bg-gray-900/60 border border-green-900/30 rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Today</h2>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse h-14 bg-gray-800 rounded-lg"/>
              ))}
            </div>
          ) : todayHabits.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-3">No habits yet — create your first one above</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayHabits.map(habit => {
                const full = habits.find(h => h.id === habit.id);
                const streak = full ? getStreakCount(full.completions) : 0;
                return (
                  <div
                    key={habit.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      habit.isDone
                        ? 'bg-green-900/10 border-green-900/30'
                        : 'bg-gray-800/40 border-gray-700/30 hover:border-gray-600/50'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: habit.color }}
                    />
                    <div className="flex-1">
                      <span className={`font-medium ${habit.isDone ? 'text-gray-500 line-through' : 'text-white'}`}>
                        {habit.name}
                      </span>
                      {streak > 1 && (
                        <span className="ml-2 inline-flex items-center gap-0.5 text-xs text-amber-400">
                          <Flame className="h-3 w-3"/>
                          {streak} day streak
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-600">
                      {habit.completedToday}/{habit.targetCount}
                    </span>
                    <button
                      onClick={() => handleComplete(habit.id)}
                      disabled={completing === habit.id || habit.isDone}
                      className="transition-colors disabled:opacity-50"
                    >
                      {habit.isDone
                        ? <CheckCircle2 className="h-6 w-6 text-green-500"/>
                        : <Circle className="h-6 w-6 text-gray-600 hover:text-green-500"/>
                      }
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* All habits summary */}
        {habits.length > 0 && (
          <div className="bg-gray-900/60 border border-green-900/30 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">All habits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {habits.map(habit => (
                <div
                  key={habit.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/40 border border-gray-700/30"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: habit.color }}
                  />
                  <div className="flex-1">
                    <p className="text-white text-sm">{habit.name}</p>
                    <p className="text-gray-600 text-xs capitalize">
                      {habit.frequency} · {habit.targetCount}x · {habit.completions?.length ?? 0} total completions
                    </p>
                  </div>
                  <button className="text-gray-600 hover:text-green-400 transition-colors">
                    <Edit2 className="h-4 w-4"/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}