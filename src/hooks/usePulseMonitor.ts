'use client';

import { useState, useEffect } from 'react';
import type { PulseMonitorAPIResponse } from '@/types/pulsemonitor';

export function usePulseMonitor(refreshInterval: number = 10000) {
  const [data, setData] = useState<PulseMonitorAPIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/pulsemonitor');
        const json = await response.json();
        
        setData(json);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchData();

    // Set up interval for auto-refresh
    const interval = setInterval(fetchData, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { data, loading, error };
}