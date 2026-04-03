import { NextRequest, NextResponse } from 'next/server';

const LIFEOS_URL = process.env.LIFEOS_API_URL || 'http://192.168.50.160:5005';

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization');

  const res = await fetch(`${LIFEOS_URL}/api/study`, {
    headers: { 'Authorization': token || '' },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization');
  const body = await req.json();

  const res = await fetch(`${LIFEOS_URL}/api/study`, {
    method: 'POST',
    headers: {
      'Authorization': token || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}