'use client';

import { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { toast } from 'react-hot-toast';

interface TimeSlotPickerProps {
  courtId: number;
  date: Date;
  onSelect: (timeSlot: string) => void;
}

export function TimeSlotPicker({ courtId, date, onSelect }: TimeSlotPickerProps) {
  const [timeSlots, setTimeSlots] = useState<Array<{ time: string; available: boolean; price: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/courts/${courtId}/time-slots?date=${date.toISOString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch time slots');
        }
        
        const data = await response.json();
        setTimeSlots(data);
      } catch (error: any) {
        setError(error.message);
        toast.error('Failed to load time slots');
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [courtId, date]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        No time slots available for this date
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {timeSlots.map((slot) => (
        <Button
          key={slot.time}
          variant={slot.available ? 'solid' : 'flat'}
          color={slot.available ? 'primary' : 'default'}
          disabled={!slot.available}
          onClick={() => slot.available && onSelect(slot.time)}
          className="w-full flex flex-col items-center"
        >
          <span className="text-sm font-medium">{slot.time}</span>
          {slot.available && (
            <span className="text-xs text-gray-500">
              ${slot.price}/hour
            </span>
          )}
        </Button>
      ))}
    </div>
  );
} 