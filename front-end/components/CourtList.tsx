'use client';

import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/react';
import { useState, useEffect } from 'react';

interface Court {
  id: number;
  name: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  amenities: string[];
}

interface CourtListProps {
  onSelect: (court: Court) => void;
}

export function CourtList({ onSelect }: CourtListProps) {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await fetch('/api/courts');
        if (response.ok) {
          const data = await response.json();
          setCourts(data);
        }
      } catch (error) {
        console.error('Error fetching courts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  if (loading) {
    return <div>Loading courts...</div>;
  }

  return (
    <div className="space-y-4">
      {courts.map((court) => (
        <Card key={court.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{court.name}</h3>
              <p className="text-gray-600">{court.location}</p>
              <p className="text-sm text-gray-500 mt-2">{court.description}</p>
              <div className="mt-2">
                <span className="text-sm font-medium">Price: ${court.price}/hour</span>
                <span className="ml-4 text-sm">Rating: {court.rating}/5</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {court.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
            <Button onClick={() => onSelect(court)}>
              Select
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
} 