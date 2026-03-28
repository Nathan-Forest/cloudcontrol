'use client';

import { Activity, Code2, Rocket, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePulseMonitor } from '@/hooks/usePulseMonitor';
import Image from 'next/image';

export default function Home() {
  const { data, loading, error } = usePulseMonitor();

  // Calculate stats from PulseMonitor data
  const stats = {
    appsDeployed: data?.data?.apps?.length || 7,
    uptime: data?.data?.apps?.filter(app => app.status === 'healthy').length || 0,
    languages: 5,
    pulseMonitorStatus: data?.success ? 'Live' : 'Offline',
  };

  // Calculate uptime percentage
  const uptimePercentage = stats.appsDeployed > 0 
    ? ((stats.uptime / stats.appsDeployed) * 100).toFixed(1)
    : '99.9';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          {/* Large Logo */}
          <div className="mb-6">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <Image
                src="/images/logo.png"
                alt="The Forest Den"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4">
            THE FOREST DEN
          </h1>
          <p className="text-xl text-slate-300 mb-2 tracking-wider">
            WHERE CODE GROWS WILD
          </p>
          
          <div className="mt-8">
            <h2 className="text-2xl text-slate-300 mb-2">
              Nathan Forest - Software Engineer
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Building production-grade applications with modern technologies.
              From IT Support to Full-Stack Development.
            </p>
          </div>
        </div>

        {/* Live Stats Ticker */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <StatCard 
            icon={<Code2 className="w-8 h-8" />}
            value={stats.appsDeployed.toString()}
            label="Apps Deployed"
            color="text-blue-500"
            loading={loading}
          />
          <StatCard 
            icon={<Rocket className="w-8 h-8" />}
            value={`${uptimePercentage}%`}
            label="Uptime"
            color="text-green-500"
            loading={loading}
          />
          <StatCard 
            icon={<TrendingUp className="w-8 h-8" />}
            value={stats.languages.toString()}
            label="Languages"
            color="text-purple-500"
          />
          <StatCard 
            icon={<Activity className="w-8 h-8" />}
            value={stats.pulseMonitorStatus}
            label="PulseMonitor"
            color={data?.success ? "text-emerald-500" : "text-red-500"}
            loading={loading}
            pulse={data?.success}
          />
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Tech Stack
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <TechBadge>TypeScript</TechBadge>
            <TechBadge>Python</TechBadge>
            <TechBadge>C#</TechBadge>
            <TechBadge>React</TechBadge>
            <TechBadge>Next.js</TechBadge>
            <TechBadge>FastAPI</TechBadge>
            <TechBadge>Node.js</TechBadge>
            <TechBadge>.NET</TechBadge>
            <TechBadge>Docker</TechBadge>
            <TechBadge>PostgreSQL</TechBadge>
            <TechBadge>Nginx</TechBadge>
            <TechBadge>Linux</TechBadge>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex justify-center gap-4">
          
            href="/projects"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            View Projects
          </a>
          
            href="/tools"
            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
          >
            Daily Tools
          </a>
        </div>

        {/* Debug info (remove in production) */}
        {error && (
          <div className="mt-8 p-4 bg-red-900/20 border border-red-700 rounded-lg text-center">
            <p className="text-red-400 text-sm">
              ⚠️ Error connecting to PulseMonitor: {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ 
  icon, 
  value, 
  label, 
  color,
  loading = false,
  pulse = false,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  loading?: boolean;
  pulse?: boolean;
}) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-3xl font-bold ${color} ${loading ? 'animate-pulse' : ''}`}>
              {loading ? '...' : value}
            </p>
            <p className="text-slate-400 text-sm">{label}</p>
          </div>
          <div className={`${color} ${pulse ? 'animate-pulse' : ''}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Tech Badge Component
export function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge className="px-4 py-2 bg-slate-800 text-slate-200 hover:bg-slate-700">
      {children}
    </Badge>
  );
}