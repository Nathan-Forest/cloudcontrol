'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Plus, X, Edit2, Archive, ChevronDown, ChevronUp,
  CheckCircle2, Circle, FolderKanban, Calendar, Flag
} from 'lucide-react';

interface ProjectTask {
  id: number;
  projectId: number;
  title: string;
  notes: string;
  isComplete: boolean;
  priority: string;
  dueDate?: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate?: string;
  goalId?: number;
  createdAt: string;
  tasks: ProjectTask[];
  goal?: { id: number; title: string };
}

const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['active', 'paused', 'completed', 'archived'];

function priorityColor(priority: string) {
  switch (priority) {
    case 'high': return 'text-red-400 bg-red-900/20 border-red-800/30';
    case 'medium': return 'text-amber-400 bg-amber-900/20 border-amber-800/30';
    default: return 'text-green-400 bg-green-900/20 border-green-800/30';
  }
}

function statusColor(status: string) {
  switch (status) {
    case 'active': return 'text-blue-400 bg-blue-900/20 border-blue-800/30';
    case 'paused': return 'text-amber-400 bg-amber-900/20 border-amber-800/30';
    case 'completed': return 'text-green-400 bg-green-900/20 border-green-800/30';
    default: return 'text-gray-400 bg-gray-800/20 border-gray-700/30';
  }
}

function taskProgress(tasks: ProjectTask[]) {
  if (!tasks?.length) return 0;
  return Math.round((tasks.filter(t => t.isComplete).length / tasks.length) * 100);
}

export default function ProjectsPage() {
  const { token, isAuthenticated, authLoading } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [addingTaskTo, setAddingTaskTo] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState<number | null>(null);

  // Create form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueDate, setTaskDueDate] = useState('');

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
    fetchProjects();
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (token) fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/lifeos/projects', { headers: authHeaders });
      if (res.ok) {
        const json = await res.json();
        setProjects(json.data || json || []);
      }
    } catch (err) {
      console.error('fetchProjects error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/lifeos/projects', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          title,
          description,
          priority,
          status: 'active',
          dueDate: dueDate || null,
        }),
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setDueDate('');
        setShowForm(false);
        await fetchProjects();
      }
    } catch (err) {
      console.error('Create project error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (project: Project) => {
    try {
      await fetch(`/api/lifeos/projects/${project.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(project),
      });
      setEditingProject(null);
      await fetchProjects();
    } catch (err) {
      console.error('Update project error:', err);
    }
  };

  const handleArchive = async (id: number) => {
    if (!confirm('Archive this project?')) return;
    try {
      await fetch(`/api/lifeos/projects/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      await fetchProjects();
    } catch (err) {
      console.error('Archive project error:', err);
    }
  };

  const handleAddTask = async (projectId: number) => {
    if (!taskTitle.trim()) return;
    try {
      await fetch(`/api/lifeos/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          title: taskTitle,
          notes: '',
          priority: taskPriority,
          isComplete: false,
          dueDate: taskDueDate || null,
        }),
      });
      setTaskTitle('');
      setTaskPriority('medium');
      setTaskDueDate('');
      setAddingTaskTo(null);
      await fetchProjects();
    } catch (err) {
      console.error('Add task error:', err);
    }
  };

  const handleToggleTask = async (task: ProjectTask) => {
    setCompleting(task.id);
    try {
      await fetch(`/api/lifeos/projects/tasks/${task.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          ...task,
          notes: task.notes || '',
          isComplete: !task.isComplete,
        }),
      });
      await fetchProjects();
    } catch (err) {
      console.error('Toggle task error:', err);
    } finally {
      setCompleting(null);
    }
  };

  const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'paused');
  const completedProjects = projects.filter(p => p.status === 'completed');

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0f0a] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {activeProjects.length} active · {completedProjects.length} completed
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Cancel' : 'New project'}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="bg-gray-900/60 border border-amber-900/40 rounded-xl p-6 mb-6"
          >
            <h2 className="text-white font-semibold mb-4">Create a new project</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="md:col-span-2">
                <label className="block text-sm text-amber-400/80 mb-1.5">Project title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Build portfolio site, Learn TypeScript..."
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-amber-400/80 mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="What are you building or working on?"
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-amber-400/80 mb-1.5">Priority</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-600 transition-colors capitalize"
                >
                  {PRIORITIES.map(p => (
                    <option key={p} value={p} className="capitalize">{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-amber-400/80 mb-1.5">Due date (optional)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>

            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-amber-700 hover:bg-amber-600 disabled:bg-amber-900 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {saving ? 'Creating...' : 'Create project'}
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

        {/* Active projects */}
        <div className="space-y-4 mb-8">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="animate-pulse h-28 bg-gray-900/60 rounded-xl" />
            ))
          ) : activeProjects.length === 0 ? (
            <div className="bg-gray-900/60 border border-amber-900/30 rounded-xl p-12 text-center">
              <FolderKanban className="h-10 w-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-600 mb-3">No active projects yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-amber-800/40 hover:bg-amber-700/40 text-amber-400 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create your first project
              </button>
            </div>
          ) : (
            activeProjects.map(project => {
              const progress = taskProgress(project.tasks);
              const openTasks = project.tasks?.filter(t => !t.isComplete).length ?? 0;
              const totalTasks = project.tasks?.length ?? 0;

              return (
                <div
                  key={project.id}
                  className="bg-gray-900/60 border border-amber-900/30 rounded-xl overflow-hidden"
                >
                  {/* Project header */}
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-white font-semibold">{project.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${statusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${priorityColor(project.priority)}`}>
                            {project.priority}
                          </span>
                        </div>

                        {project.description && (
                          <p className="text-gray-500 text-sm mb-3">{project.description}</p>
                        )}

                        {/* Progress bar */}
                        {totalTasks > 0 && (
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-500 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">
                              {totalTasks - openTasks}/{totalTasks} tasks
                            </span>
                          </div>
                        )}

                        {/* Due date + goal */}
                        <div className="flex items-center gap-4 flex-wrap">
                          {project.dueDate && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <Calendar className="h-3 w-3" />
                              <span>Due: {new Date(project.dueDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                          )}
                          {project.goal && (
                            <div className="flex items-center gap-1.5 text-xs text-purple-600">
                              <Flag className="h-3 w-3" />
                              <span>{project.goal.title}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                          className="text-gray-600 hover:text-amber-400 p-1.5 rounded transition-colors"
                        >
                          {expandedProject === project.id
                            ? <ChevronUp className="h-4 w-4" />
                            : <ChevronDown className="h-4 w-4" />
                          }
                        </button>
                        <button
                          onClick={() => setEditingProject(project)}
                          className="text-gray-600 hover:text-amber-400 p-1.5 rounded transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleArchive(project.id)}
                          className="text-gray-600 hover:text-red-400 p-1.5 rounded transition-colors"
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tasks panel */}
                  {expandedProject === project.id && (
                    <div className="border-t border-gray-800 px-5 py-4 bg-gray-950/40">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm text-gray-400 font-medium">
                          Tasks ({totalTasks - openTasks}/{totalTasks} done)
                        </h4>
                        <button
                          onClick={() => setAddingTaskTo(addingTaskTo === project.id ? null : project.id)}
                          className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-400 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                          Add task
                        </button>
                      </div>

                      {/* Task list */}
                      <div className="space-y-2 mb-3">
                        {project.tasks?.length === 0 ? (
                          <p className="text-gray-700 text-xs text-center py-2">No tasks yet</p>
                        ) : (
                          project.tasks?.map(task => (
                            <div key={task.id} className="flex items-center gap-2.5 group">
                              <button
                                onClick={() => handleToggleTask(task)}
                                disabled={completing === task.id}
                                className="flex-shrink-0 transition-colors disabled:opacity-50"
                              >
                                {task.isComplete
                                  ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  : <Circle className="h-4 w-4 text-gray-600 hover:text-amber-400" />
                                }
                              </button>
                              <span className={`text-sm flex-1 ${task.isComplete ? 'text-gray-600 line-through' : 'text-gray-300'}`}>
                                {task.title}
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded border capitalize ${priorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              {task.dueDate && (
                                <span className="text-xs text-gray-700">
                                  {new Date(task.dueDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                                </span>
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add task form */}
                      {addingTaskTo === project.id && (
                        <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
                          <input
                            type="text"
                            value={taskTitle}
                            onChange={e => setTaskTitle(e.target.value)}
                            placeholder="Task title..."
                            className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-600 transition-colors"
                          />
                          <div className="flex gap-2">
                            <select
                              value={taskPriority}
                              onChange={e => setTaskPriority(e.target.value)}
                              className="bg-gray-800/60 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-600 transition-colors"
                            >
                              {PRIORITIES.map(p => (
                                <option key={p} value={p} className="capitalize">{p}</option>
                              ))}
                            </select>
                            <input
                              type="date"
                              value={taskDueDate}
                              onChange={e => setTaskDueDate(e.target.value)}
                              className="flex-1 bg-gray-800/60 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-600 transition-colors"
                            />
                            <button
                              onClick={() => handleAddTask(project.id)}
                              className="bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                            >
                              Add
                            </button>
                            <button
                              onClick={() => setAddingTaskTo(null)}
                              className="text-gray-600 hover:text-white px-2 rounded-lg transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Completed projects */}
        {completedProjects.length > 0 && (
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
            <h2 className="text-gray-500 font-semibold mb-4">Completed</h2>
            <div className="space-y-2">
              {completedProjects.map(project => (
                <div key={project.id} className="flex items-center gap-3 py-2 border-b border-gray-800/50 last:border-0">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-600 text-sm flex-1">{project.title}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded border capitalize ${priorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-amber-900/40 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold text-lg">Edit Project</h2>
              <button
                onClick={() => setEditingProject(null)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">

              <div>
                <label className="block text-sm text-amber-400/80 mb-1.5">Title</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-amber-400/80 mb-1.5">Description</label>
                <textarea
                  value={editingProject.description || ''}
                  onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                  rows={2}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-600 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-amber-400/80 mb-1.5">Priority</label>
                <select
                  value={editingProject.priority}
                  onChange={e => setEditingProject({ ...editingProject, priority: e.target.value })}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-600 transition-colors"
                >
                  {PRIORITIES.map(p => (
                    <option key={p} value={p} className="capitalize">{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-amber-400/80 mb-1.5">Status</label>
                <select
                  value={editingProject.status}
                  onChange={e => setEditingProject({ ...editingProject, status: e.target.value })}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-600 transition-colors"
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-amber-400/80 mb-1.5">Due date</label>
                <input
                  type="date"
                  value={editingProject.dueDate ? editingProject.dueDate.split('T')[0] : ''}
                  onChange={e => setEditingProject({ ...editingProject, dueDate: e.target.value })}
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>

            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleUpdate(editingProject)}
                className="flex-1 bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Save changes
              </button>
              <button
                onClick={() => setEditingProject(null)}
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