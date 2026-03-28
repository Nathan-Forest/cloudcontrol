export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-4">Projects</h1>
        <p className="text-slate-400 mb-8">
          Portfolio applications deployed and monitored in real-time
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Project cards will go here! */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-2">PulseMonitor</h3>
            <p className="text-slate-400 text-sm mb-4">
              Real-time application health monitoring dashboard
            </p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-500 text-sm font-medium">Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}