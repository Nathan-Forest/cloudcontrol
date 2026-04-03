import { NextRequest, NextResponse } from 'next/server';

const LIFEOS_URL = process.env.LIFEOS_API_URL || 'http://192.168.50.160:5005';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ milestoneId: string }> }) {
  const { milestoneId } = await params;
  const token = req.headers.get('Authorization');
  const body = await req.json();

  const res = await fetch(`${LIFEOS_URL}/api/goals/milestones/${milestoneId}`, {
    method: 'PUT',
    headers: {
      'Authorization': token || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}