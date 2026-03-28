export interface Project {
  id: string;
  name: string;
  description: string;
  url: string; // Where to open the app
  githubUrl: string;
  techStack: TechStack[];
  pulseMonitorName: string; // Matches PulseMonitor's app.name
  port: number;
  category: 'monitoring' | 'finance' | 'platform' | 'web';
}

export type TechStack = 
  | 'TypeScript' | 'Python' | 'C#'
  | 'Next.js' | 'React' | 'FastAPI' | 'Flask' | '.NET'
  | 'Docker' | 'Nginx' | 'SQLite' | 'PostgreSQL';

export const projects: Project[] = [
  {
    id: 'pulsemonitor',
    name: 'PulseMonitor',
    description: 'Real-time application health monitoring service',
    url: 'http://192.168.50.160:5173',
    githubUrl: 'https://github.com/Nathan-Forest/PulseMonitor',
    techStack: ['Python', 'FastAPI', 'React', 'Docker'],
    pulseMonitorName: 'PulseMonitor API',
    port: 8000,
    category: 'monitoring',
  },
  {
    id: 'cloudcontrol',
    name: 'CloudControl',
    description: 'DevOps platform and monitoring dashboard',
    url: 'http://192.168.50.160:3000',
    githubUrl: 'https://github.com/Nathan-Forest/CloudControl',
    techStack: ['TypeScript', 'Next.js', 'React', 'Docker'],
    pulseMonitorName: 'CloudControl',
    port: 3000,
    category: 'platform',
  },
  {
    id: 'stocktracker',
    name: 'StockTracker',
    description: 'Portfolio tracking and stock management application',
    url: 'http://192.168.50.160:5001',
    githubUrl: 'https://github.com/Nathan-Forest/StockTracker',
    techStack: ['Python', 'Flask', 'SQLite', 'Docker'],
    pulseMonitorName: 'StockTracker',
    port: 5001,
    category: 'finance',
  },
  {
    id: 'financehub',
    name: 'FinanceHub',
    description: 'Financial management and tracking platform',
    url: 'http://192.168.50.160:5002',
    githubUrl: 'https://github.com/Nathan-Forest/FinanceHub',
    techStack: ['C#', '.NET', 'SQLite', 'Docker'],
    pulseMonitorName: 'FinanceHub',
    port: 5002,
    category: 'finance',
  },
  {
    id: 'nginx',
    name: 'Nginx',
    description: 'Reverse proxy and web server',
    url: 'http://192.168.50.160',
    githubUrl: '', // No GitHub for Nginx
    techStack: ['Nginx'],
    pulseMonitorName: 'Nginx Web Server',
    port: 80,
    category: 'web',
  },
];