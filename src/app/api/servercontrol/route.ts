import { NextRequest, NextResponse } from 'next/server';

const SERVERCONTROL_URL = process.env.SERVERCONTROL_API_URL || 'http://192.168.50.160:5006';

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization');

  const res = await fetch(`${SERVERCONTROL_URL}/containers`, {
    headers: { 'Authorization': token || '' },
    cache: 'no-store',
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}