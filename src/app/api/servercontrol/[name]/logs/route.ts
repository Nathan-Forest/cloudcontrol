import { NextRequest, NextResponse } from 'next/server';

const SERVERCONTROL_URL = process.env.SERVERCONTROL_API_URL || 'http://192.168.50.160:5006';

export async function GET(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const token = req.headers.get('Authorization');
  const lines = req.nextUrl.searchParams.get('lines') || '50';

  const res = await fetch(`${SERVERCONTROL_URL}/containers/${name}/logs?lines=${lines}`, {
    headers: { 'Authorization': token || '' },
    cache: 'no-store',
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}