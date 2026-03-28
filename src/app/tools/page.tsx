import { HabitTracker } from '@/components/HabitTracker';

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-white mb-8">Daily Tools</h1>
        <p className="text-slate-400 mb-12">
          Tools to support your career journey. Build habits, track progress, stay consistent.
        </p>
        
        <div className="max-w-4xl">
          <HabitTracker />
        </div>
      </div>
    </div>
  );
}
