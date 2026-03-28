import { Shield } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-blue-500" />
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
        </div>
        
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 mb-8">
          <p className="text-yellow-400 text-sm">
            🔐 Authentication required. Integration with SecureAuth coming soon!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-2">Container Management</h3>
            <p className="text-slate-400 text-sm">
              Start, stop, and monitor Docker containers
            </p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-2">System Monitoring</h3>
            <p className="text-slate-400 text-sm">
              CPU, RAM, disk usage, and network stats
            </p>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-2">Deployment</h3>
            <p className="text-slate-400 text-sm">
              Deploy new apps from GitHub repositories
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}