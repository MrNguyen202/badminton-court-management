import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courtId, date, timeSlot, userId } = body;

    // Validate required fields
    if (!courtId || !date || !timeSlot || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse time slot
    const [startTime, endTime] = timeSlot.split(' - ');
    const bookingDate = new Date(date);
    const startDateTime = new Date(bookingDate);
    const [startHour, startMinute] = startTime.split(':');
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute));

    const endDateTime = new Date(bookingDate);
    const [endHour, endMinute] = endTime.split(':');
    endDateTime.setHours(parseInt(endHour), parseInt(endMinute));

    // Check if the time slot is available
    const availabilityResponse = await fetch(
      `http://localhost:8082/api/sub-court-schedules/check-availability/${courtId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
        }),
      }
    );

    if (!availabilityResponse.ok) {
      return NextResponse.json(
        { error: 'Time slot is not available' },
        { status: 400 }
      );
    }

    // Create the booking
    const bookingResponse = await fetch('http://localhost:8083/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courtId,
        userId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        status: 'NEW',
      }),
    });

    if (!bookingResponse.ok) {
      throw new Error('Failed to create booking');
    }

    const booking = await bookingResponse.json();

    // Initialize payment
    const paymentResponse = await fetch('http://localhost:8083/api/payments/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingId: booking.id,
        amount: booking.totalAmount,
      }),
    });

    if (!paymentResponse.ok) {
      // If payment initialization fails, cancel the booking
      await fetch(`http://localhost:8083/api/bookings/${booking.id}/cancel`, {
        method: 'POST',
      });
      throw new Error('Failed to initialize payment');
    }

    const payment = await paymentResponse.json();

    return NextResponse.json({
      booking,
      paymentUrl: payment.paymentUrl,
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
} 