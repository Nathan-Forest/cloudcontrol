'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  Activity, Target, FolderKanban,
  BookOpen, CheckCircle2, Circle,
  Plus, ChevronRight
} from 'lucide-react';

interface LifeOSStats {
  habitsToday: number;
  activeHabits: number;
  activeGoals: number;
  openTasks: number;
  activeProjects: number;
  studyMinutesToday: number;
}

interface Habit {
  id: number;
  name: string;
  color: string;
  targetCount: number;
  completedToday: number;
  isDone: boolean;
}

interface Goal {
  id: number;
  title: string;
  category: string;
  progress: number;
  status: string;
}

interface Task {
  id: number;
  title: string;
  priority: string;
  notes: string;
  isComplete: boolean;
  project: { title: string };
}

function StatCard({
  icon,
  label,
  value,
  href,
  color
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-gray-900/60 border border-green-900/30 rounded-xl p-4 hover:border-green-700/50 transition-all group">
        <div className="flex items-center justify-between mb-2">
          <div className={`${color} opacity-80 group-hover:opacity-100 transition-opacity`}>
            {icon}
          </div>
          <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-green-600 transition-colors" />
        </div>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <div className="text-gray-500 text-sm mt-0.5">{label}</div>
      </div>
    </Link>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate() {
  return new Date().toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
}

function priorityColor(priority: string) {
  switch (priority) {
    case 'high': return 'text-red-400 bg-red-900/20 border-red-800/30';
    case 'medium': return 'text-amber-400 bg-amber-900/20 border-amber-800/30';
    default: return 'text-green-400 bg-green-900/20 border-green-800/30';
  }
}

export default function Dashboard() {
  const { token, user, isAuthenticated, authLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<LifeOSStats | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingHabit, setCompletingHabit] = useState<number | null>(null);
  const [completingTask, setCompletingTask] = useState<number | null>(null);
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const handleCompleteHabit = async (id: number) => {
const handleCompleteHabit = async (id: number) => {
  // Optimistically mark as done immediately
  setHabits(prev => prev.map(h =>
    h.id === id ? { ...h, isDone: true, completedToday: h.completedToday + 1 } : h
  ));
  setCompletingHabit(id);
  try {
    await fetch(`/api/lifeos/habits/${id}/complete`, {
      method: 'POST',
      headers,
    });
    const [statsRes, habitsRes] = await Promise.all([
      fetch('/api/lifeos', { headers }),
      fetch('/api/lifeos/habits/today', { headers }),
    ]);
    if (statsRes.ok) {
      const json = await statsRes.json();
      setStats(json.success ? json.data : null);
    }
    if (habitsRes.ok) setHabits((await habitsRes.json()).data);
  } finally {
    setCompletingHabit(null);
  }
};
    try {
      await fetch(`/api/lifeos/habits/${id}/complete`, {
        method: 'POST',
        headers,
      });
      // Refresh habits and stats
      const [statsRes, habitsRes] = await Promise.all([
        fetch('/api/lifeos', { headers }),
        fetch('/api/lifeos/habits/today', { headers }),
      ]);
      if (statsRes.ok) {
        const json = await statsRes.json();
        setStats(json.success ? json.data : null);
      }
      if (habitsRes.ok) setHabits((await habitsRes.json()).data);
    } finally {
      setCompletingHabit(null);
    }
  };

  const handleCompleteTask = async (task: Task) => {
    setCompletingTask(task.id);
    try {
      await fetch(`/api/lifeos/projects/tasks/${task.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ ...task, isComplete: true }),
      });
      const tasksRes = await fetch('/api/lifeos/tasks/open', { headers });
      if (tasksRes.ok) setTasks((await tasksRes.json()).data?.slice(0, 5));
    } finally {
      setCompletingTask(null);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/lifeos/login');
      return;
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch all dashboard data
  useEffect(() => {
    if (!token) return;


    const fetchAll = async () => {
      try {
        const [statsRes, habitsRes, goalsRes, tasksRes] = await Promise.all([
          fetch('/api/lifeos', { headers }),
          fetch('/api/lifeos/habits/today', { headers }),
          fetch('/api/lifeos/goals/active', { headers }),
          fetch('/api/lifeos/tasks/open', { headers }),
        ]);

        if (statsRes.ok) {
          const json = await statsRes.json();
          setStats(json.success ? json.data : null);
        }
        if (habitsRes.ok) setHabits((await habitsRes.json()).data);
        if (goalsRes.ok) setGoals((await goalsRes.json()).data?.slice(0, 4));
        if (tasksRes.ok) setTasks((await tasksRes.json()).data?.slice(0, 5));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0f0a] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {getGreeting()}, {user?.name ?? 'Nathan'} 🌲
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">{formatDate()}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-500 text-sm">LifeOS Live</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Activity className="h-5 w-5" />}
            label="Habits today"
            value={stats ? `${stats.habitsToday}/${stats.activeHabits}` : '—'}
            href="/lifeos/habits"
            color="text-green-400"
          />
          <StatCard
            icon={<Target className="h-5 w-5" />}
            label="Active goals"
            value={stats ? `${stats.activeGoals}` : '—'}
            href="/lifeos/goals"
            color="text-purple-400"
          />
          <StatCard
            icon={<FolderKanban className="h-5 w-5" />}
            label="Open tasks"
            value={stats ? `${stats.openTasks}` : '—'}
            href="/lifeos/projects"
            color="text-amber-400"
          />
          <StatCard
            icon={<BookOpen className="h-5 w-5" />}
            label="Study today"
            value={stats ? `${stats.studyMinutesToday}m` : '—'}
            href="/lifeos/study"
            color="text-teal-400"
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Today's habits - takes 2 cols */}
          <div className="lg:col-span-2 bg-gray-900/60 border border-green-900/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Today's habits</h2>
              <Link
                href="/lifeos/habits"
                className="flex items-center gap-1 text-green-600 hover:text-green-400 text-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add habit
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse h-12 bg-gray-800 rounded-lg" />
                ))}
              </div>
            ) : habits.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-3">No habits yet</p>
                <Link
                  href="/lifeos/habits"
                  className="inline-flex items-center gap-2 bg-green-800/40 hover:bg-green-700/40 text-green-400 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create your first habit
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {habits.map(habit => (
                  <div
                    key={habit.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/40 border border-gray-700/30"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className={`flex-1 text-sm ${habit.isDone ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                      {habit.name}
                    </span>
                    <span className="text-xs text-gray-600">
                      {habit.completedToday}/{habit.targetCount}
                    </span>
                    <button
                      onClick={() => !habit.isDone && handleCompleteHabit(habit.id)}
                      disabled={completingHabit === habit.id || habit.isDone}
                      className="transition-colors disabled:opacity-50"
                    >
                      {habit.isDone
                        ? <CheckCircle2 className="h-5 w-5 text-green-500" />
                        : <Circle className="h-5 w-5 text-gray-600 hover:text-green-500" />
                      }
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column — goals + tasks */}
          <div className="space-y-6">

            {/* Active goals */}
            <div className="bg-gray-900/60 border border-green-900/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold">Active goals</h2>
                <Link href="/lifeos/goals" className="text-green-600 hover:text-green-400 text-sm transition-colors">
                  View all
                </Link>
              </div>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2].map(i => (
                    <div key={i} className="animate-pulse h-10 bg-gray-800 rounded-lg" />
                  ))}
                </div>
              ) : goals.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-4">No active goals</p>
              ) : (
                <div className="space-y-3">
                  {goals.map(goal => (
                    <div key={goal.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-300 text-sm truncate flex-1">{goal.title}</span>
                        <span className="text-purple-400 text-xs ml-2">{goal.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full transition-all"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Open tasks */}
            <div className="bg-gray-900/60 border border-green-900/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold">Open tasks</h2>
                <Link href="/lifeos/projects" className="text-green-600 hover:text-green-400 text-sm transition-colors">
                  View all
                </Link>
              </div>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse h-8 bg-gray-800 rounded-lg" />
                  ))}
                </div>
              ) : tasks.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-4">No open tasks</p>
              ) : (
                <div className="space-y-2">
                  {tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-2">
                      <button
                        onClick={() => handleCompleteTask(task)}
                        disabled={completingTask === task.id}
                        className="flex-shrink-0 transition-colors disabled:opacity-50"
                      >
                        <Circle className="h-3.5 w-3.5 text-gray-600 hover:text-green-500" />
                      </button>
                      <span className="text-gray-300 text-sm flex-1 truncate">{task.title}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded border ${priorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}