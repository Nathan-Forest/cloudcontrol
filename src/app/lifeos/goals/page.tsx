'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Plus, X, Edit2, Target, ChevronDown,
  ChevronUp, CheckCircle2, Circle, Archive,
  Flag, Calendar
} from 'lucide-react';

interface Milestone {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
  dueDate?: string;
  goalId: number;
}

interface Goal {
  id: number;
  title: string;
  description?: string;
  category: string;
  status: string;
  progress: number;
  targetDate?: string;
  createdAt: string;
  milestones: Milestone[];
}

const CATEGORIES = ['health', 'career', 'learning', 'finance', 'personal', 'other'];
const STATUSES = ['active', 'paused', 'completed', 'archived'];

function statusColor(status: string) {
  switch (status) {
    case 'active': return 'text-green-400 bg-green-900/20 border-green-800/30';
    case 'paused': return 'text-amber-400 bg-amber-900/20 border-amber-800/30';
    case 'completed': return 'text-blue-400 bg-blue-900/20 border-blue-800/30';
    default: return 'text-gray-400 bg-gray-800/20 border-gray-700/30';
  }
}

function categoryColor(category: string) {
  switch (category) {
    case 'health': return 'text-emerald-400';
    case 'career': return 'text-blue-400';
    case 'learning': return 'text-purple-400';
    case 'finance': return 'text-amber-400';
    case 'personal': return 'text-pink-400';
    default: return 'text-gray-400';
  }
}

function progressBarColor(progress: number) {
  if (progress >= 100) return 'bg-green-500';
  if (progress >= 60) return 'bg-blue-500';
  if (progress >= 30) return 'bg-amber-500';
  return 'bg-purple-500';
}

export default function GoalsPage() {
  const { token, isAuthenticated, authLoading } = useAuth();
  const router = useRouter();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGoal, setExpandedGoal] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [addingMilestoneTo, setAddingMilestoneTo] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Create form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('personal');
  const [targetDate, setTargetDate] = useState('');

  // Milestone form state
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDueDate, setMilestoneDueDate] = useState('');

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
    fetchGoals();
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (token) fetchGoals();
  }, [token]);

  const fetchGoals = async () => {
    try {
      const res = await fetch('/api/lifeos/goals', { headers: authHeaders });
      if (res.ok) {
        const json = await res.json();
        setGoals(json.data || json || []);
      }
    } catch (err) {
      console.error('fetchGoals error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/lifeos/goals', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          title,
          description,
          category,
          status: 'active',
          targetDate: targetDate || null,
        }),
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        setCategory('personal');
        setTargetDate('');
        setShowForm(false);
        await fetchGoals();
      }
    } catch (err) {
      console.error('Create goal error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (goal: Goal) => {
    try {
      await fetch(`/api/lifeos/goals/${goal.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(goal),
      });
      setEditingGoal(null);
      await fetchGoals();
    } catch (err) {
      console.error('Update goal error:', err);
    }
  };

  const handleArchive = async (id: number) => {
    if (!confirm('Archive this goal?')) return;
    try {
      await fetch(`/api/lifeos/goals/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      await fetchGoals();
    } catch (err) {
      console.error('Archive goal error:', err);
    }
  };

  const handleAddMilestone = async (goalId: number) => {
    if (!milestoneTitle.trim()) return;
    try {
      await fetch(`/api/lifeos/goals/${goalId}/milestones`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          title: milestoneTitle,
          dueDate: milestoneDueDate || null,
          isComplete: false,
        }),
      });
      setMilestoneTitle('');
      setMilestoneDueDate('');
      setAddingMilestoneTo(null);
      await fetchGoals();
    } catch (err) {
      console.error('Add milestone error:', err);
    }
  };

  const handleToggleMilestone = async (milestone: Milestone) => {
    try {
      await fetch(`/api/lifeos/goals/milestones/${milestone.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ ...milestone, isComplete: !milestone.isComplete }),
      });
      await fetchGoals();
    } catch (err) {
      console.error('Toggle milestone error:', err);
    }
  };

  const activeGoals = goals.filter(g => g.status === 'active' || g.status === 'paused');
  const completedGoals = goals.filter(g => g.status === 'completed');

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0f0a] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Goals</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {activeGoals.length} active · {completedGoals.length} completed
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Cancel' : 'New goal'}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="bg-gray-900/60 border border-purple-900/40 rounded-xl p-6 mb-6"
          >
            <h2 className="text-white font-semibold mb-4">Create a new goal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="md:col-span-2">
                <label className="block text-sm text-purple-400/80 mb-1.5">Goal title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Get a junior dev job, Run a 5K..."
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-purple-400/80 mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="What does success look like?"
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-purple-400/80 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors capitalize"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-purple-400/80 mb-1.5">Target date (optional)</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={e => setTargetDate(e.target.value)}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>

            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-purple-700 hover:bg-purple-600 disabled:bg-purple-900 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {saving ? 'Creating...' : 'Create goal'}
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

        {/* Active goals */}
        <div className="space-y-4 mb-8">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="animate-pulse h-28 bg-gray-900/60 rounded-xl" />
            ))
          ) : activeGoals.length === 0 ? (
            <div className="bg-gray-900/60 border border-purple-900/30 rounded-xl p-12 text-center">
              <Target className="h-10 w-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-600 mb-3">No active goals yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-purple-800/40 hover:bg-purple-700/40 text-purple-400 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create your first goal
              </button>
            </div>
          ) : (
            activeGoals.map(goal => (
              <div
                key={goal.id}
                className="bg-gray-900/60 border border-purple-900/30 rounded-xl overflow-hidden"
              >
                {/* Goal header */}
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-white font-semibold">{goal.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${statusColor(goal.status)}`}>
                          {goal.status}
                        </span>
                        <span className={`text-xs capitalize font-medium ${categoryColor(goal.category)}`}>
                          {goal.category}
                        </span>
                      </div>
                      {goal.description && (
                        <p className="text-gray-500 text-sm mb-3">{goal.description}</p>
                      )}

                      {/* Progress bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${progressBarColor(goal.progress)}`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400 w-10 text-right">{goal.progress}%</span>
                      </div>

                      {/* Target date */}
                      {goal.targetDate && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>Target: {new Date(goal.targetDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
                        className="text-gray-600 hover:text-purple-400 p-1.5 rounded transition-colors"
                        title="View milestones"
                      >
                        {expandedGoal === goal.id
                          ? <ChevronUp className="h-4 w-4" />
                          : <ChevronDown className="h-4 w-4" />
                        }
                      </button>
                      <button
                        onClick={() => setEditingGoal(goal)}
                        className="text-gray-600 hover:text-purple-400 p-1.5 rounded transition-colors"
                        title="Edit goal"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleArchive(goal.id)}
                        className="text-gray-600 hover:text-amber-400 p-1.5 rounded transition-colors"
                        title="Archive goal"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Milestones panel */}
                {expandedGoal === goal.id && (
                  <div className="border-t border-gray-800 px-5 py-4 bg-gray-950/40">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm text-gray-400 font-medium">
                        Milestones ({goal.milestones?.filter(m => m.isComplete).length ?? 0}/{goal.milestones?.length ?? 0})
                      </h4>
                      <button
                        onClick={() => setAddingMilestoneTo(addingMilestoneTo === goal.id ? null : goal.id)}
                        className="flex items-center gap-1 text-xs text-purple-500 hover:text-purple-400 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        Add milestone
                      </button>
                    </div>

                    {/* Milestone list */}
                    <div className="space-y-2 mb-3">
                      {goal.milestones?.length === 0 ? (
                        <p className="text-gray-700 text-xs text-center py-2">No milestones yet</p>
                      ) : (
                        goal.milestones?.map(milestone => (
                          <div
                            key={milestone.id}
                            className="flex items-center gap-2.5 group"
                          >
                            <button
                              onClick={() => handleToggleMilestone(milestone)}
                              className="flex-shrink-0 transition-colors"
                            >
                              {milestone.isComplete
                                ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                                : <Circle className="h-4 w-4 text-gray-600 hover:text-purple-400" />
                              }
                            </button>
                            <span className={`text-sm flex-1 ${milestone.isComplete ? 'text-gray-600 line-through' : 'text-gray-300'}`}>
                              {milestone.title}
                            </span>
                            {milestone.dueDate && (
                              <span className="text-xs text-gray-700 flex items-center gap-1">
                                <Flag className="h-3 w-3" />
                                {new Date(milestone.dueDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add milestone form */}
                    {addingMilestoneTo === goal.id && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-800">
                        <input
                          type="text"
                          value={milestoneTitle}
                          onChange={e => setMilestoneTitle(e.target.value)}
                          placeholder="Milestone title..."
                          className="flex-1 bg-gray-800/60 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-600 transition-colors"
                        />
                        <input
                          type="date"
                          value={milestoneDueDate}
                          onChange={e => setMilestoneDueDate(e.target.value)}
                          className="bg-gray-800/60 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-600 transition-colors"
                        />
                        <button
                          onClick={() => handleAddMilestone(goal.id)}
                          className="bg-purple-700 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setAddingMilestoneTo(null)}
                          className="text-gray-600 hover:text-white px-2 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Completed goals */}
        {completedGoals.length > 0 && (
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
            <h2 className="text-gray-500 font-semibold mb-4">Completed</h2>
            <div className="space-y-2">
              {completedGoals.map(goal => (
                <div key={goal.id} className="flex items-center gap-3 py-2 border-b border-gray-800/50 last:border-0">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-600 text-sm flex-1">{goal.title}</span>
                  <span className={`text-xs capitalize ${categoryColor(goal.category)}`}>{goal.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Edit Modal */}
      {editingGoal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-purple-900/40 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold text-lg">Edit Goal</h2>
              <button
                onClick={() => setEditingGoal(null)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">

              <div>
                <label className="block text-sm text-purple-400/80 mb-1.5">Title</label>
                <input
                  type="text"
                  value={editingGoal.title}
                  onChange={e => setEditingGoal({ ...editingGoal, title: e.target.value })}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-purple-400/80 mb-1.5">Description</label>
                <textarea
                  value={editingGoal.description || ''}
                  onChange={e => setEditingGoal({ ...editingGoal, description: e.target.value })}
                  rows={2}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-purple-400/80 mb-1.5">Category</label>
                <select
                  value={editingGoal.category}
                  onChange={e => setEditingGoal({ ...editingGoal, category: e.target.value })}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-purple-400/80 mb-1.5">Status</label>
                <select
                  value={editingGoal.status}
                  onChange={e => setEditingGoal({ ...editingGoal, status: e.target.value })}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-purple-400/80 mb-1.5">Progress ({editingGoal.progress}%)</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={editingGoal.progress}
                  onChange={e => setEditingGoal({ ...editingGoal, progress: Number(e.target.value) })}
                  className="w-full accent-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm text-purple-400/80 mb-1.5">Target date</label>
                <input
                  type="date"
                  value={editingGoal.targetDate ? editingGoal.targetDate.split('T')[0] : ''}
                  onChange={e => setEditingGoal({ ...editingGoal, targetDate: e.target.value })}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-600 transition-colors"
                />
              </div>

            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleUpdate(editingGoal)}
                className="flex-1 bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Save changes
              </button>
              <button
                onClick={() => setEditingGoal(null)}
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