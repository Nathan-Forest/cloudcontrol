'use client';

import { languageStats } from '@/lib/languageStats';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  Github, Linkedin, Mail, ExternalLink,
  Server, Code2, Terminal, Wrench
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

const skills = {
  Frontend: [
    'Next.js', 'React', 'TypeScript', 'JavaScript',
    'Tailwind CSS', 'shadcn/ui', 'Recharts',
  ],
  Backend: [
    'C# / .NET 8', 'FastAPI', 'Python', 'Flask',
    'Entity Framework Core', 'SQLite', 'JWT Auth', 'REST APIs',
  ],
  DevOps: [
    'Docker', 'Docker Compose', 'Nginx',
    'Ubuntu Server', 'SSH', 'Git / GitHub', 'Linux CLI',
  ],
  Tools: [
    'VS Code', 'Postman', 'GitHub Actions (learning)',
    'PulseMonitor', 'CloudControl',
  ],
};

const skillIcons = {
  Frontend: <Code2 className="h-4 w-4" />,
  Backend: <Server className="h-4 w-4" />,
  DevOps: <Terminal className="h-4 w-4" />,
  Tools: <Wrench className="h-4 w-4" />,
};

const skillColors = {
  Frontend: 'border-blue-900/40 text-blue-400',
  Backend: 'border-green-900/40 text-green-400',
  DevOps: 'border-purple-900/40 text-purple-400',
  Tools: 'border-amber-900/40 text-amber-400',
};

const badgeColors = {
  Frontend: 'bg-blue-900/20 border-blue-800/30 text-blue-300',
  Backend: 'bg-green-900/20 border-green-800/30 text-green-300',
  DevOps: 'bg-purple-900/20 border-purple-800/30 text-purple-300',
  Tools: 'bg-amber-900/20 border-amber-800/30 text-amber-300',
};

const timeline = [
  {
    year: '2015–2024',
    title: 'IT Support & Systems Administration',
    description: 'Spent nearly a decade in IT support, managing infrastructure, troubleshooting systems, and developing a deep understanding of how technology works under the hood.',
    color: 'border-gray-600',
    dot: 'bg-gray-500',
  },
  {
    year: '2024',
    title: 'The Decision — IT to Development',
    description: 'Made the deliberate choice to transition into software development. Started learning JavaScript, then TypeScript, then C# — always building real things rather than following tutorials.',
    color: 'border-blue-800',
    dot: 'bg-blue-500',
  },
  {
    year: 'Early 2025',
    title: 'Building The Foundation',
    description: 'Deployed first containerised applications. Built SecureAuth with PostgreSQL, learning EF Core, JWT authentication, and production deployment patterns from scratch.',
    color: 'border-purple-800',
    dot: 'bg-purple-500',
  },
  {
    year: '2025',
    title: 'The Forest Den — Born',
    description: 'Converted a ThinkCentre into a home lab Ubuntu Server and began building The Forest Den — a full home DevOps platform with 6 production applications, Docker orchestration, and Nginx reverse proxy.',
    color: 'border-green-800',
    dot: 'bg-green-500',
  },
  {
    year: 'Now',
    title: 'Junior Developer — Ready',
    description: 'Building LifeOS, shipping CI/CD pipelines, and actively seeking a junior JavaScript/TypeScript developer role where I can bring production-minded thinking and genuine passion for the craft.',
    color: 'border-teal-700',
    dot: 'bg-teal-400 animate-pulse',
  },
];

const pieData = languageStats.map(stat => ({
  name: stat.language,
  value: stat.projectCount,
}));

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#030712] pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-900/20 border border-green-800/30 text-green-400 text-sm px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Open to junior developer roles
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nathan Forest
          </h1>
          <p className="text-xl text-green-400 font-medium mb-6">
            Junior Developer · IT Background · Full Stack
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed text-lg">
            Nearly a decade in IT support taught me how technology actually works.
            Now I build it. Transitioning into software development with a production-first
            mindset — I don't just write code, I deploy it, monitor it, and maintain it.
          </p>

          {/* Contact links */}
          <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
            
              href="https://github.com/Nathan-Forest"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            <a>
              <Github className="h-4 w-4" />
              GitHub
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>
            
              href="https://linkedin.com/in/nathan-forest-australia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-900/20 hover:bg-blue-800/30 border border-blue-800/30 hover:border-blue-700/50 text-blue-400 hover:text-blue-300 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
           <a>
              <Linkedin className="h-4 w-4" />
              LinkedIn
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>
            
              href="mailto:nathan@forestden.dev"
              className="flex items-center gap-2 bg-green-900/20 hover:bg-green-800/30 border border-green-800/30 hover:border-green-700/50 text-green-400 hover:text-green-300 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            <a>
              <Mail className="h-4 w-4" />
              nathan@forestden.dev
            </a>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(Object.keys(skills) as Array<keyof typeof skills>).map(category => (
              <div
                key={category}
                className={`bg-gray-900/60 border rounded-xl p-6 ${skillColors[category]}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  {skillIcons[category]}
                  <h3 className="font-semibold text-sm uppercase tracking-wider">{category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills[category].map(skill => (
                    <span
                      key={skill}
                      className={`text-xs px-2.5 py-1 rounded-full border ${badgeColors[category]}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Distribution */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Language Distribution
          </h2>
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

              {/* Pie Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111827',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#f9fafb',
                      }}
                      formatter={(value: number) => [`${value} projects`, '']}
                    />
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: '#9ca3af', fontSize: '12px' }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Language bars */}
              <div className="space-y-4">
                {languageStats.map((stat, index) => (
                  <div key={stat.language}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-gray-300 text-sm font-medium">{stat.language}</span>
                      <span className="text-gray-500 text-xs">{stat.projectCount} projects</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(stat.projectCount / Math.max(...languageStats.map(s => s.projectCount))) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">The Journey</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-800 -translate-x-1/2" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-[#030712] z-10 mt-5"
                    style={{ backgroundColor: '' }}
                  >
                    <div className={`w-3 h-3 rounded-full ${item.dot}`} />
                  </div>

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className={`bg-gray-900/60 border ${item.color} rounded-xl p-5`}>
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                        {item.year}
                      </span>
                      <h3 className="text-white font-semibold mt-1 mb-2">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Philosophy */}
        <div className="bg-gray-900/60 border border-green-900/30 rounded-xl p-8 text-center">
          <p className="text-2xl text-white font-semibold mb-3">🌲</p>
          <h2 className="text-xl font-bold text-white mb-4">The Forest Den Philosophy</h2>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            "Do it right first time." Every application deployed here is containerised,
            monitored, and maintained to production standards. When I interview,
            I don't just show code — I show running infrastructure that recruiters
            can interact with in real time.
          </p>
        </div>

      </div>
    </div>
  );
}