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
  } catch (err) {
    console.error('GET habits error:', err);
    return NextResponse.json({ success: false, data: [], error: String(err) });
  }
}

export async function POST(request: Request) {
  const token = request.headers.get('Authorization');
  try {
    const body = await request.json();
    console.log('POST habits - token present:', !!token);
    console.log('POST habits - body:', body);
    
    const response = await fetch('http://192.168.50.160:5005/api/habits', {
      method: 'POST',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log('LifeOS response status:', response.status);
    const data = await response.json();
    console.log('LifeOS response data:', data);
    
    return NextResponse.json({ success: response.ok, data });
  } catch (err) {
    console.error('POST habits error:', err);
    return NextResponse.json({ success: false, data: null, error: String(err) });
  }
}