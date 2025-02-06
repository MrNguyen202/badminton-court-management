import Image from "next/image";
import { useState } from "react";

const locations = [
  "Địa điểm",
  "Quận 1",
  "Quận 2",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 6",
  "Quận 7",
  "Quận 8",
  "Quận 9",
  "Quận 10",
  "Quận 11",
  "Quận 12",
  "Bình Tân",
  "Bình Thạnh",
  "Gò Vấp",
  "Phú Nhuận",
  "Tân Bình",
  "Tân Phú",
  "Thủ Đức",
  "Bình Chánh",
  "Cần Giờ",
];

const EventLocation = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>(
    locations[0]
  );

  return (
    <div className="p-6 flex items-center gap-2">
      <Image src="/location.png" width={30} height={30} alt="Search" />
      <select
        id="location"
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
        className="w-full p-2 rounded-lg text-white bg-white/5"
      >
        {locations.map((location) => (
          <option key={location} value={location} className="text-black">
            {location}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EventLocation;
