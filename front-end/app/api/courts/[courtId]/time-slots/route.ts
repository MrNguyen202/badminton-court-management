import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { courtId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Call the court service API to get time slots
    const response = await fetch(
      `http://localhost:8082/api/sub-court-schedules/by-sub-court/${params.courtId}?startDate=${date}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch time slots');
    }

    const data = await response.json();
    
    // Transform the data into a format suitable for the frontend
    const timeSlots = Object.entries(data).flatMap(([subCourtId, schedules]: [string, any]) => {
      return Object.entries(schedules).flatMap(([date, slots]: [string, any]) => {
        return (slots as any[]).map((slot: any) => ({
          time: `${slot.fromHour} - ${slot.toHour}`,
          available: slot.status === 'AVAILABLE',
        }));
      });
    });

    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time slots' },
      { status: 500 }
    );
  }
} 