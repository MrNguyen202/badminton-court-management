'use client';

interface BookingSummaryProps {
  court: {
    name: string;
    location: string;
    price: number;
  };
  date: Date | undefined;
  timeSlot: string | null;
}

export function BookingSummary({ court, date, timeSlot }: BookingSummaryProps) {
  if (!date || !timeSlot) {
    return null;
  }

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h3 className="font-semibold">Court Details</h3>
        <p className="text-gray-600">{court.name}</p>
        <p className="text-sm text-gray-500">{court.location}</p>
      </div>

      <div className="border-b pb-4">
        <h3 className="font-semibold">Booking Details</h3>
        <p className="text-gray-600">{formattedDate}</p>
        <p className="text-gray-600">Time: {timeSlot}</p>
      </div>

      <div>
        <h3 className="font-semibold">Price</h3>
        <p className="text-lg font-medium">${court.price}</p>
      </div>
    </div>
  );
} 