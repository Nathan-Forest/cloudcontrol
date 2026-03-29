'use client';

import { Activity, Code2, Rocket, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePulseMonitor } from '@/hooks/usePulseMonitor';
import { getLanguageCount } from '@/lib/languageStats';
import Image from 'next/image';
import { LanguageBreakdown } from '@/components/LanguageBreakdown';
import LifeOSWidget from '@/components/LifeOSWidget';

export default function Home() {
  const { data, loading, error } = usePulseMonitor();

  // Calculate stats from PulseMonitor data
  const stats = {
    appsDeployed: data?.data?.apps?.length || 7,
    uptime: data?.data?.apps?.filter(app => app.status === 'healthy').length || 0,
    languages: getLanguageCount(),
    pulseMonitorStatus: data?.success ? 'Live' : 'Offline',
  };

  // Calculate uptime percentage
  const uptimePercentage = stats.appsDeployed > 0
    ? ((stats.uptime / stats.appsDeployed) * 100).toFixed(1)
    : '99.9';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-5">
          {/* Large Logo */}
          <div className="mb-6">
            <div className="relative w-92 h-92 mx-auto mb-4">8
              <Image
                src="/images/logo.png"
                alt="The Forest Den"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
          </div>

        </div>

        {/* Live Stats Ticker */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-5">
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


        {/* About Me */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div>
            <LanguageBreakdown />
          </div>
          <div>
            <LifeOSWidget />
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">

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