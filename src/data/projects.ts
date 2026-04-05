export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  githubUrl: string;
  techStack: TechStack[];
  pulseMonitorName: string;
  port: number;
  category: 'monitoring' | 'finance' | 'platform' | 'web';
}

export type TechStack =
  | 'TypeScript' | 'JavaScript' | 'Python' | 'C#'
  | 'Next.js' | 'React' | 'FastAPI' | 'Flask' | '.NET'
  | 'Docker' | 'Nginx' | 'SQLite' | 'PostgreSQL';

export const projects: Project[] = [
  {
    id: 'pulsemonitor',
    name: 'PulseMonitor',
    description: 'Real-time application health monitoring service',
    url: 'https://pulse.theforestden.dev',
    githubUrl: 'https://github.com/Nathan-Forest/PulseMonitor',
    techStack: ['Python', 'TypeScript', 'FastAPI', 'React', 'Docker'],
    pulseMonitorName: 'PulseMonitor',
    port: 8000,
    category: 'monitoring',
  },
  {
    id: 'cloudcontrol',
    name: 'CloudControl',
    description: 'DevOps platform and monitoring dashboard',
    url: 'https://theforestden.dev',
    githubUrl: 'https://github.com/Nathan-Forest/cloudcontrol',
    techStack: ['TypeScript', 'Next.js', 'React', 'Docker'],
    pulseMonitorName: 'CloudControl',
    port: 3000,
    category: 'platform',
  },
  {
    id: 'secureauth-lite',
    name: 'SecureAuth-Lite',
    description: 'SQLite variant of SecureAuth demonstrating EF Core database-agnostic design',
    url: 'https://auth.theforestden.dev',
    githubUrl: 'https://github.com/Nathan-Forest/SecureAuth-Lite',
    techStack: ['C#', '.NET', 'TypeScript', 'React', 'SQLite', 'Docker'],
    pulseMonitorName: 'SecureAuth-Lite',
    port: 5003,
    category: 'platform',
  },
  {
    id: 'stocktracker',
    name: 'StockTracker',
    description: 'Python Flask stock portfolio tracking application',
    url: 'https://stocks.theforestden.dev',
    githubUrl: 'https://github.com/Nathan-Forest/StockTracker',
    techStack: ['Python', 'JavaScript', 'Flask', 'SQLite', 'Docker'],
    pulseMonitorName: 'StockTracker',
    port: 5001,
    category: 'finance',
  },
  {
    id: 'financehub',
    name: 'FinanceHub',
    description: 'Financial management and tracking platform',
    url: 'https://finance.theforestden.dev',
    githubUrl: 'https://github.com/Nathan-Forest/FinanceHub',
    techStack: ['C#', '.NET', 'JavaScript', 'SQLite', 'Docker'],
    pulseMonitorName: 'FinanceHub',
    port: 5002,
    category: 'finance',
  },
  {
    id: 'lifeos',
    name: 'LifeOS',
    description: 'Personal operating system — habits, goals, projects and study tracking',
    url: 'https://theforestden.dev/lifeos',
    githubUrl: 'https://github.com/Nathan-Forest/LifeOS',
    techStack: ['C#', '.NET', 'SQLite', 'Docker'],
    pulseMonitorName: 'LifeOS',
    port: 5005,
    category: 'platform',
  },
  {
    id: 'servercontrol',
    name: 'ServerControl',
    description: 'Docker container management and system metrics API powering the Server Control Centre',
    url: 'https://server.theforestden.dev',
    githubUrl: 'https://github.com/Nathan-Forest/ServerControl',
    techStack: ['Python', 'FastAPI', 'Docker'],
    pulseMonitorName: 'ServerControl',
    port: 5006,
    category: 'monitoring',
  },
];