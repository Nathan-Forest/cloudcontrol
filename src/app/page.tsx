import Image from 'next/image';
import { Activity, Code2, Rocket, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          {/* Large Logo with Glow */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl" />
            <div className="relative w-102 h-102 mx-auto mb-4">
              <Image
                src="/images/logo.png"
                alt="The Forest Den"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
          </div>
          <p className="text-2xl text-slate-300 mb-2">
            Nathan Forest - Software Engineer
          </p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Building production-grade applications with modern technologies.
            From IT Support to Full-Stack Development.
          </p>
        </div>

        {/* Live Stats Ticker */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <StatCard
            icon={<Code2 className="w-8 h-8" />}
            value="7"
            label="Apps Deployed"
            color="text-blue-500"
          />
          <StatCard
            icon={<Rocket className="w-8 h-8" />}
            value="99.9%"
            label="Uptime"
            color="text-green-500"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            value="5"
            label="Languages"
            color="text-purple-500"
          />
          <StatCard
            icon={<Activity className="w-8 h-8" />}
            value="Live"
            label="PulseMonitor"
            color="text-emerald-500"
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
          <a>
            View Projects
          </a>

          href="/tools"
          className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
          <a>
            Daily Tools
          </a>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, value, label, color }: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-slate-400 text-sm">{label}</p>
          </div>
          <div className={color}>{icon}</div>
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
