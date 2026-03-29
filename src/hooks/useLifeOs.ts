'use client';

import { useState, useEffect } from 'react';

interface LifeOSStats {
  habitsToday: number;
  activeHabits: number;
  activeGoals: number;
  openTasks: number;
  activeProjects: number;
  studyMinutesToday: number;
  timestamp: string;
}

interface LifeOSResponse {
  success: boolean;
  data: LifeOSStats;
  timestamp: string;
}

export function useLifeOS(refreshInterval: number = 30000) {
  const [data, setData] = useState<LifeOSStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/lifeos');
        const json: LifeOSResponse = await response.json();

        if (json.success) {
          setData(json.data);
          setError(null);
        } else {
          setError('LifeOS unavailable');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { data, loading, error };
}