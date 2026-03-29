import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://192.168.50.160:5005/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`LifeOS API returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch from LifeOS',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}