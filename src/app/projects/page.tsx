'use client';

import { ProjectCard } from '@/components/ProjectCard';
import { usePulseMonitor } from '@/hooks/usePulseMonitor';
import { projects } from '@/data/projects';

export default function ProjectsPage() {
  const { data, loading } = usePulseMonitor();
  
  // Map PulseMonitor data to projects
  const getAppStatus = (projectName: string) => {
    return data?.data?.apps?.find(app => app.name === projectName);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Production Applications
          </h1>
          <p className="text-lg text-slate-400">
            Live monitoring and management of deployed applications
          </p>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-3xl font-bold text-blue-500">
              {projects.length}
            </p>
            <p className="text-slate-400">Total Applications</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-3xl font-bold text-green-500">
              {data?.data?.apps?.filter(app => app.status === 'healthy').length || 0}
            </p>
            <p className="text-slate-400">Healthy</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-3xl font-bold text-emerald-500">
              {loading ? '...' : data?.success ? 'Live' : 'Offline'}
            </p>
            <p className="text-slate-400">Monitoring Status</p>
          </div>
        </div>
        
        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              appStatus={getAppStatus(project.pulseMonitorName)}
            />
          ))}
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="text-center mt-8">
            <p className="text-slate-400">Loading live data...</p>
          </div>
        )}
      </div>
    </div>
  );
}