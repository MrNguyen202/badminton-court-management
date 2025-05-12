import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:8082/api/courts/get-courts');
    
    if (!response.ok) {
      throw new Error('Failed to fetch courts');
    }

    const courts = await response.json();
    return NextResponse.json(courts);
  } catch (error) {
    console.error('Error fetching courts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courts' },
      { status: 500 }
    );
  }
}