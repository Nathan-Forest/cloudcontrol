import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = request.headers.get('Authorization');
  try {
    const response = await fetch(
      `http://192.168.50.160:5005/api/habits/${id}/complete`,
      {
        method: 'POST',
        headers: { 'Authorization': token || '', 'Content-Type': 'application/json' },
        body: JSON.stringify(''),
      }
    );
    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false });
  }
}