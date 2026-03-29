'use client';

import { useLifeOS } from '@/hooks/useLifeOS';

export default function LifeOSWidget() {
  const { data, loading, error } = useLifeOS();

  if (loading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-700 rounded w-1/3"/>
          <div className="h-8 bg-gray-700 rounded w-1/2"/>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <p className="text-gray-500 text-sm">LifeOS unavailable</p>
      </div>
    );
  }

  const stats = [
    {
      label: 'Habits today',
      value: `${data.habitsToday} / ${data.activeHabits}`,
      color: 'text-green-400',
      icon: '✓'
    },
    {
      label: 'Active goals',
      value: data.activeGoals,
      color: 'text-purple-400',
      icon: '◎'
    },
    {
      label: 'Open tasks',
      value: data.openTasks,
      color: 'text-amber-400',
      icon: '◈'
    },
    {
      label: 'Active projects',
      value: data.activeProjects,
      color: 'text-blue-400',
      icon: '⬡'
    },
    {
      label: 'Study today',
      value: `${data.studyMinutesToday}m`,
      color: 'text-teal-400',
      icon: '◉'
    },
  ];

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">LifeOS</h3>
        <span className="text-xs text-green-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block"/>
          Live
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-900/50 rounded-lg p-3">
            <div className={`text-xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}