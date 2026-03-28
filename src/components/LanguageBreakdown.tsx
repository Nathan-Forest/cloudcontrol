'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLanguageStats } from '@/lib/languageStats';

export function LanguageBreakdown() {
  const stats = getLanguageStats();
  
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Language Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stats.map((lang) => (
            <div key={lang.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{lang.name}</span>
                <span className="text-slate-400">
                  {lang.count} {lang.count === 1 ? 'project' : 'projects'} • {lang.percentage.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}