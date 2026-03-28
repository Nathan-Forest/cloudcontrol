import { Badge } from '@/components/ui/badge';
import { type TechStack } from '@/data/projects';

const techColors: Record<TechStack, string> = {
  TypeScript: 'bg-blue-600 text-white',
  Python: 'bg-yellow-600 text-white',
  'C#': 'bg-purple-600 text-white',
  'Next.js': 'bg-black text-white',
  React: 'bg-cyan-600 text-white',
  FastAPI: 'bg-teal-600 text-white',
  Flask: 'bg-slate-700 text-white',
  '.NET': 'bg-indigo-600 text-white',
  Docker: 'bg-blue-500 text-white',
  Nginx: 'bg-green-600 text-white',
  SQLite: 'bg-sky-600 text-white',
  PostgreSQL: 'bg-blue-800 text-white',
};

interface TechBadgeProps {
  tech: TechStack;
}

export function TechBadge({ tech }: TechBadgeProps) {
  return (
    <Badge className={`px-2 py-1 text-xs font-semibold ${techColors[tech]}`}>
      {tech}
    </Badge>
  );
}