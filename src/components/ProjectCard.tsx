'use client';

import { ExternalLink, Activity } from 'lucide-react';
import { siGithub } from 'simple-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TechBadge } from './TechBadge';
import type { Project } from '@/data/projects';
import type { App } from '@/types/pulsemonitor';

interface ProjectCardProps {
    project: Project;
    appStatus?: App; // From PulseMonitor
}

export function ProjectCard({ project, appStatus }: ProjectCardProps) {
    const isHealthy = appStatus?.status === 'healthy';
    const statusColor = isHealthy ? 'bg-green-500' : 'bg-red-500';
    const statusText = isHealthy ? 'Healthy' : 'Down';

    return (
        <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        {/* Status Indicator */}
                        <div className={`w-3 h-3 rounded-full ${statusColor} ${isHealthy ? 'animate-pulse' : ''}`} />
                        <CardTitle className="text-xl text-white">{project.name}</CardTitle>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                            title="Open App"
                        >
                            <ExternalLink className="w-4 h-4 text-white" />
                        </a>
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                                title="View on GitHub"
                            >
                                <svg
                                    role="img"
                                    viewBox="0 0 24 24"
                                    className="w-4 h-4 fill-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d={siGithub.path} />
                                    </svg>
              </a>
                        )}
                    </div>
                </div>
                <p className="text-slate-400 text-sm mt-2">{project.description}</p>
            </CardHeader>

            <CardContent>
                {/* Status Info */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">
                            {appStatus?.response_time ? `${appStatus.response_time.toFixed(0)}ms` : 'N/A'}
                        </span>
                    </div>
                    <Badge variant={isHealthy ? 'default' : 'destructive'} className="text-xs">
                        {statusText}
                    </Badge>
                    {appStatus?.status_code && (
                        <span className="text-slate-400 text-xs">
                            HTTP {appStatus.status_code}
                        </span>
                    )}
                </div>

                {/* Tech Stack */}
                <div className="space-y-2">
                    <p className="text-xs text-slate-500 font-semibold">Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                            <TechBadge key={tech} tech={tech} />
                        ))}
                    </div>
                </div>

                {/* Port Info */}
                <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-500">
                        Port: <span className="text-slate-300 font-mono">{project.port}</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}