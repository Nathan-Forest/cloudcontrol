import { NextRequest, NextResponse } from 'next/server';

const LIFEOS_URL = process.env.LIFEOS_API_URL || 'http://192.168.50.160:5005';

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization');

  const res = await fetch(`${LIFEOS_URL}/api/study/summary`, {
    headers: { 'Authorization': token || '' },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}