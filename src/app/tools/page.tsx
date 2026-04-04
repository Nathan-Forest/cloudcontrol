'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Server, Cpu, HardDrive, MemoryStick,
  Play, Square, RotateCcw, FileText,
  CheckCircle2, XCircle, Clock, RefreshCw,
  ChevronDown, ChevronUp, Shield
} from 'lucide-react';

interface Container {
  name: string;
  status: string;
  image: string;
  ports: Record<string, unknown>;
  created: string;
}

interface SystemStats {
  cpu_percent: number;
  memory_total: number;
  memory_used: number;
  memory_percent: number;
  disk_total: number;
  disk_used: number;
  disk_percent: number;
  uptime_seconds: number;
}

interface LogState {
  [key: string]: string[];
}

function formatBytes(bytes: number) {
  const gb = bytes / (1024 ** 3);
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / (1024 ** 2)).toFixed(0)} MB`;
}

function formatUptime(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function statusColor(status: string) {
  if (status === 'running') return 'text-green-400';
  if (status === 'exited') return 'text-red-400';
  return 'text-amber-400';
}

function StatusDot({ status }: { status: string }) {
  const color = status === 'running' ? 'bg-green-400' : status === 'exited' ? 'bg-red-400' : 'bg-amber-400';
  const pulse = status === 'running' ? 'animate-pulse' : '';
  return <span className={`inline-block w-2 h-2 rounded-full ${color} ${pulse} mr-2`} />;
}

function StatBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 bg-gray-800 rounded-full overflow-hidden mt-2">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

export default function ToolsPage() {
  const { token, isAuthenticated, authLoading } = useAuth();
  const router = useRouter();

  const [containers, setContainers] = useState<Container[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogState>({});
  const [logsLoading, setLogsLoading] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; success: boolean } | null>(null);

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/lifeos/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchAll = useCallback(async () => {
    if (!token) return;
    try {
      const [containersRes, systemRes] = await Promise.all([
        fetch('/api/servercontrol', { headers: authHeaders }),
        fetch('/api/servercontrol/system', { headers: authHeaders }),
      ]);
      if (containersRes.ok) setContainers(await containersRes.json());
      if (systemRes.ok) setSystemStats(await systemRes.json());
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchAll();
  }, [token, fetchAll]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (token) fetchAll();
    }, 30000);
    return () => clearInterval(interval);
  }, [token, fetchAll]);

  const handleAction = async (name: string, action: string) => {
    const confirmMsg = action === 'stop'
      ? `Stop container "${name}"? This will take it offline.`
      : `${action.charAt(0).toUpperCase() + action.slice(1)} container "${name}"?`;

    if (!confirm(confirmMsg)) return;

    setActionLoading(`${name}-${action}`);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/servercontrol/${name}/${action}`, {
        method: 'POST',
        headers: authHeaders,
      });
      const data = await res.json();
      setActionMessage({
        text: data.message || `${action} successful`,
        success: res.ok,
      });
      await fetchAll();
    } catch (err) {
      setActionMessage({ text: `Action failed: ${err}`, success: false });
    } finally {
      setActionLoading(null);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const handleViewLogs = async (name: string) => {
    if (expandedLogs === name) {
      setExpandedLogs(null);
      return;
    }
    setExpandedLogs(name);
    if (logs[name]) return;
    setLogsLoading(name);
    try {
      const res = await fetch(`/api/servercontrol/${name}/logs?lines=50`, {
        headers: authHeaders,
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(prev => ({ ...prev, [name]: data.lines || [] }));
      }
    } catch (err) {
      console.error('Logs error:', err);
    } finally {
      setLogsLoading(null);
    }
  };

  const refreshLogs = async (name: string) => {
    setLogsLoading(name);
    try {
      const res = await fetch(`/api/servercontrol/${name}/logs?lines=50`, {
        headers: authHeaders,
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(prev => ({ ...prev, [name]: data.lines || [] }));
      }
    } finally {
      setLogsLoading(null);
    }
  };

  const runningCount = containers.filter(c => c.status === 'running').length;

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#030712] pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-5 w-5 text-amber-400" />
              <h1 className="text-2xl font-bold text-white">Server Control Centre</h1>
            </div>
            <p className="text-gray-500 text-sm">
              {runningCount}/{containers.length} containers running
              {lastRefresh && (
                <span className="ml-3 text-gray-700">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Action message */}
        {actionMessage && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
            actionMessage.success
              ? 'bg-green-900/20 border-green-800/30 text-green-400'
              : 'bg-red-900/20 border-red-800/30 text-red-400'
          }`}>
            {actionMessage.success
              ? <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              : <XCircle className="h-5 w-5 flex-shrink-0" />
            }
            {actionMessage.text}
          </div>
        )}

        {/* System Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="h-4 w-4 text-blue-400" />
              <span className="text-gray-400 text-sm">CPU</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">
              {systemStats ? `${systemStats.cpu_percent.toFixed(1)}%` : '—'}
            </p>
            {systemStats && (
              <StatBar
                value={systemStats.cpu_percent}
                color={systemStats.cpu_percent > 80 ? 'bg-red-500' : 'bg-blue-500'}
              />
            )}
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <MemoryStick className="h-4 w-4 text-purple-400" />
              <span className="text-gray-400 text-sm">Memory</span>
            </div>
            <p className="text-2xl font-bold text-purple-400">
              {systemStats ? `${systemStats.memory_percent.toFixed(1)}%` : '—'}
            </p>
            {systemStats && (
              <>
                <StatBar
                  value={systemStats.memory_percent}
                  color={systemStats.memory_percent > 80 ? 'bg-red-500' : 'bg-purple-500'}
                />
                <p className="text-xs text-gray-600 mt-1">
                  {formatBytes(systemStats.memory_used)} / {formatBytes(systemStats.memory_total)}
                </p>
              </>
            )}
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <HardDrive className="h-4 w-4 text-amber-400" />
              <span className="text-gray-400 text-sm">Disk</span>
            </div>
            <p className="text-2xl font-bold text-amber-400">
              {systemStats ? `${systemStats.disk_percent.toFixed(1)}%` : '—'}
            </p>
            {systemStats && (
              <>
                <StatBar
                  value={systemStats.disk_percent}
                  color={systemStats.disk_percent > 80 ? 'bg-red-500' : 'bg-amber-500'}
                />
                <p className="text-xs text-gray-600 mt-1">
                  {formatBytes(systemStats.disk_used)} / {formatBytes(systemStats.disk_total)}
                </p>
              </>
            )}
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-teal-400" />
              <span className="text-gray-400 text-sm">Uptime</span>
            </div>
            <p className="text-2xl font-bold text-teal-400">
              {systemStats ? formatUptime(systemStats.uptime_seconds) : '—'}
            </p>
            <p className="text-xs text-gray-600 mt-2">Server uptime</p>
          </div>
        </div>

        {/* Containers */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-gray-400" />
              <h2 className="text-white font-semibold">Containers</h2>
            </div>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse h-16 bg-gray-800 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {containers.map(container => (
                <div key={container.name}>
                  {/* Container row */}
                  <div className="px-6 py-4 flex items-center gap-4">

                    {/* Status + name */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <StatusDot status={container.status} />
                        <span className="text-white font-medium">{container.name}</span>
                        <span className={`text-xs capitalize ${statusColor(container.status)}`}>
                          {container.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs mt-0.5 truncate">
                        {container.image} · Created {container.created}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Logs */}
                      <button
                        onClick={() => handleViewLogs(container.name)}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 bg-gray-800/60 hover:bg-gray-700/60 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Logs
                        {expandedLogs === container.name
                          ? <ChevronUp className="h-3 w-3" />
                          : <ChevronDown className="h-3 w-3" />
                        }
                      </button>

                      {/* Start */}
                      <button
                        onClick={() => handleAction(container.name, 'start')}
                        disabled={container.status === 'running' || actionLoading === `${container.name}-start`}
                        className="flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 bg-green-900/20 hover:bg-green-800/30 disabled:opacity-30 disabled:cursor-not-allowed px-2.5 py-1.5 rounded-lg transition-colors border border-green-900/30"
                      >
                        <Play className="h-3.5 w-3.5" />
                        Start
                      </button>

                      {/* Stop */}
                      <button
                        onClick={() => handleAction(container.name, 'stop')}
                        disabled={container.status !== 'running' || actionLoading === `${container.name}-stop`}
                        className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-800/30 disabled:opacity-30 disabled:cursor-not-allowed px-2.5 py-1.5 rounded-lg transition-colors border border-red-900/30"
                      >
                        <Square className="h-3.5 w-3.5" />
                        Stop
                      </button>

                      {/* Restart */}
                      <button
                        onClick={() => handleAction(container.name, 'restart')}
                        disabled={container.status !== 'running' || actionLoading === `${container.name}-restart`}
                        className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-900/20 hover:bg-amber-800/30 disabled:opacity-30 disabled:cursor-not-allowed px-2.5 py-1.5 rounded-lg transition-colors border border-amber-900/30"
                      >
                        <RotateCcw className={`h-3.5 w-3.5 ${actionLoading === `${container.name}-restart` ? 'animate-spin' : ''}`} />
                        Restart
                      </button>
                    </div>
                  </div>

                  {/* Logs panel */}
                  {expandedLogs === container.name && (
                    <div className="border-t border-gray-800 bg-gray-950/60 px-6 py-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                          Last 50 log lines
                        </span>
                        <button
                          onClick={() => refreshLogs(container.name)}
                          disabled={logsLoading === container.name}
                          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 transition-colors"
                        >
                          <RefreshCw className={`h-3 w-3 ${logsLoading === container.name ? 'animate-spin' : ''}`} />
                          Refresh
                        </button>
                      </div>
                      {logsLoading === container.name ? (
                        <div className="animate-pulse h-32 bg-gray-800 rounded" />
                      ) : (
                        <div className="bg-black/40 rounded-lg p-4 max-h-64 overflow-y-auto font-mono text-xs text-gray-400 space-y-0.5">
                          {logs[container.name]?.length > 0 ? (
                            logs[container.name].map((line, i) => (
                              <p key={i} className="leading-5 break-all">{line}</p>
                            ))
                          ) : (
                            <p className="text-gray-700">No logs available</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}