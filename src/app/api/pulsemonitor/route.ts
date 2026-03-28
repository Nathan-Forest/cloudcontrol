import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch from PulseMonitor API (same server!)
    const response = await fetch('http://localhost:8000/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Important: Don't cache in production
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`PulseMonitor API returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error fetching from PulseMonitor:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch from PulseMonitor',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}