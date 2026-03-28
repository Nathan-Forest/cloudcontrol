export interface App {
  name: string;
  url: string;
  description: string;
  status: 'healthy' | 'unhealthy' | 'down';
  response_time: number | null;
  status_code: number | null;
  error: string | null;
}

export interface HealthCheckResponse {
  timestamp: string;
  apps: App[];
}

export interface PulseMonitorAPIResponse {
  success: boolean;
  data?: HealthCheckResponse;
  error?: string;
  timestamp: string;
}