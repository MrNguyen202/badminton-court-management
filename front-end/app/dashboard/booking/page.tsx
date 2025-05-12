'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TimeSlotPicker } from '@/components/TimeSlotPicker';
import { CourtList } from '@/components/CourtList';
import { BookingSummary } from '@/components/BookingSummary';
import { Button, Card } from '@nextui-org/react';
import { toast } from 'react-hot-toast';

export default function BookingPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedCourt, setSelectedCourt] = useState<any>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleCourtSelect = (court: any) => {
    setSelectedCourt(court);
    setStep(2);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setStep(3);
  };

  const handleBookingConfirm = async () => {
    try {
      setIsLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      
      if (!user) {
        toast.error('Please login to book a court');
        router.push('/login');
        return;
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courtId: selectedCourt.id,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      // Redirect to payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast.success('Booking confirmed!');
        router.push('/dashboard/bookings');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to book court');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book a Court</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {step === 1 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Select a Court</h2>
              <CourtList onSelect={handleCourtSelect} />
            </Card>
          )}

          {step === 2 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
              <div className="mb-6">
                {/* <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                /> */}
              </div>
              {selectedDate && (
                <TimeSlotPicker
                  courtId={selectedCourt.id}
                  date={selectedDate}
                  onSelect={handleTimeSlotSelect}
                />
              )}
            </Card>
          )}

          {step === 3 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Confirm Booking</h2>
              <BookingSummary
                court={selectedCourt}
                date={selectedDate}
                timeSlot={selectedTimeSlot}
              />
              <div className="mt-6 flex gap-4">
                {/* <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  disabled={isLoading}
                >
                  Back
                </Button> */}
                <Button
                  onClick={handleBookingConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Confirm Booking'}
                </Button>
              </div>
            </Card>
          )}
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Booking Progress</h2>
          <div className="space-y-4">
            <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3">
                1
              </div>
              <span>Select Court</span>
            </div>
            <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3">
                2
              </div>
              <span>Choose Date & Time</span>
            </div>
            <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3">
                3
              </div>
              <span>Confirm Booking</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 