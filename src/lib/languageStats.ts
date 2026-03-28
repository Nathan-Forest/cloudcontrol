import { projects, type TechStack } from '@/data/projects';

// Define what counts as a programming language (not frameworks/tools)
const PROGRAMMING_LANGUAGES: TechStack[] = [
  'TypeScript',
  'JavaScript',
  'Python',
  'C#',
];

export interface LanguageStats {
  name: TechStack;
  count: number;
  percentage: number;
  color: string;
}

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e', 
  Python: '#3776ab',
  'C#': '#239120',
};

export function getLanguageStats(): LanguageStats[] {
  // Count occurrences of each language
  const languageCounts = new Map<TechStack, number>();
  
  projects.forEach((project) => {
    project.techStack.forEach((tech) => {
      if (PROGRAMMING_LANGUAGES.includes(tech)) {
        languageCounts.set(tech, (languageCounts.get(tech) || 0) + 1);
      }
    });
  });
  
  const totalProjects = projects.length;
  
  // Convert to stats array
  return Array.from(languageCounts.entries()).map(([name, count]) => ({
    name,
    count,
    percentage: (count / totalProjects) * 100,
    color: languageColors[name] || '#6b7280',
  }));
}

export function getLanguageCount(): number {
  const stats = getLanguageStats();
  return stats.length;
}