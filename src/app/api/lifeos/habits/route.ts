import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const token = request.headers.get('Authorization');
  try {
    const response = await fetch('http://192.168.50.160:5005/api/habits', {
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, data: [] });
  }
}

export async function POST(request: Request) {
  const token = request.headers.get('Authorization');
  try {
    const body = await request.json();
    const response = await fetch('http://192.168.50.160:5005/api/habits', {
      method: 'POST',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, data: null });
  }
}