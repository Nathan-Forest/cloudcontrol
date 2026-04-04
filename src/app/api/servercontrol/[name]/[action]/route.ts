import { NextRequest, NextResponse } from 'next/server';

const SERVERCONTROL_URL = process.env.SERVERCONTROL_API_URL || 'http://192.168.50.160:5006';

export async function POST(req: NextRequest, { params }: { params: Promise<{ name: string, action: string }> }) {
  const { name, action } = await params;
  const token = req.headers.get('Authorization');

  const res = await fetch(`${SERVERCONTROL_URL}/containers/${name}/${action}`, {
    method: 'POST',
    headers: { 'Authorization': token || '' },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}