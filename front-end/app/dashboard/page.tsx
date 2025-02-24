"use client";

import React, { useState } from "react";

const courts = [
  { id: 1, name: "Sân Cầu Lông A", address: "123 Đường A, Quận 1", price: "100.000 VND/h", image: "https://picsum.photos/200/320", rating: 4.5, district: 1 },
  { id: 2, name: "Sân Cầu Lông B", address: "456 Đường B, Quận 3", price: "120.000 VND/h", image: "https://picsum.photos/200/321", rating: 4.0, district: 3 },
  { id: 3, name: "Sân Cầu Lông C", address: "789 Đường C, Quận 5", price: "90.000 VND/h", image: "https://picsum.photos/200/322", rating: 4.2, district: 5 },
  { id: 4, name: "Sân Cầu Lông D", address: "101 Đường D, Quận 7", price: "110.000 VND/h", image: "https://picsum.photos/200/323", rating: 3.8, district: 7 },
  { id: 5, name: "Sân Cầu Lông E", address: "202 Đường E, Quận 10", price: "130.000 VND/h", image: "https://picsum.photos/200/324", rating: 4.7, district: 10 },
  { id: 6, name: "Sân Cầu Lông F", address: "303 Đường F, Quận 2", price: "95.000 VND/h", image: "https://picsum.photos/200/325", rating: 4.1, district: 2 },
  { id: 7, name: "Sân Cầu Lông G", address: "404 Đường G, Quận 4", price: "105.000 VND/h", image: "https://picsum.photos/200/326", rating: 4.3, district: 4 },
  { id: 8, name: "Sân Cầu Lông H", address: "505 Đường H, Quận 6", price: "115.000 VND/h", image: "https://picsum.photos/200/327", rating: 4.6, district: 6 },
  { id: 9, name: "Sân Cầu Lông I", address: "606 Đường I, Quận 8", price: "125.000 VND/h", image: "https://picsum.photos/200/328", rating: 4.0, district: 8 },
  { id: 10, name: "Sân Cầu Lông J", address: "707 Đường J, Quận 9", price: "135.000 VND/h", image: "https://picsum.photos/200/329", rating: 4.8, district: 9 },
  { id: 11, name: "Sân Cầu Lông K", address: "808 Đường K, Quận 11", price: "85.000 VND/h", image: "https://picsum.photos/200/330", rating: 3.9, district: 11 },
];

type Court = {
  id: number;
  name: string;
  address: string;
  price: string;
  image: string;
  rating: number;
  district: number;
};

function BadmintonCourtList() {
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [filter, setFilter] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const courtsPerPage = 6;

  const handleBooking = (court : Court) => {
    setSelectedCourt(court);
    alert(`Bạn đã chọn đặt sân: ${court.name}`);
  };

  const handleViewDetails = (court: Court) => {
    alert(`Chi tiết sân: ${court.name} - ${court.address} - Giá: ${court.price}`);
  };

  const filteredCourts = courts.filter((court) =>
    court.name.toLowerCase().includes(filter.toLowerCase()) &&
    (selectedDistrict ? court.district === Number(selectedDistrict) : true) &&
    (selectedRating ? Math.floor(court.rating) === Number(selectedRating) : true)
  );

  const indexOfLastCourt = currentPage * courtsPerPage;
  const indexOfFirstCourt = indexOfLastCourt - courtsPerPage;
  const currentCourts = filteredCourts.slice(indexOfFirstCourt, indexOfLastCourt);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 max-w-full mx-auto flex flex-col items-center">
      <div className="flex w-full">
        <div className="w-1/4 p-4 border-r">
          <h2 className="text-lg font-bold mb-2">Bộ lọc</h2>
          <input
            type="text"
            placeholder="Tìm kiếm sân..."
            className="w-full p-2 border rounded mb-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <select
            className="w-full p-2 border rounded mb-2"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option value="">Chọn quận</option>
            {[...new Set(courts.map((c) => c.district))].map((district) => (
              <option key={district} value={district}>Quận {district}</option>
            ))}
          </select>
          <select
            className="w-full p-2 border rounded"
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
          >
            <option value="">Chọn số sao</option>
            {[5, 4, 3].map((star) => (
              <option key={star} value={star}>{star} sao</option>
            ))}
          </select>
        </div>
        <div className="w-3/4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCourts.map((court) => (
              <div key={court.id} className="border p-4 rounded-lg shadow-md bg-white">
                <img src={court.image} alt={court.name} className="w-full h-56 object-cover rounded-md mb-2" />
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{court.name}</h2>
                  <p className="text-yellow-500 font-semibold">
                    {Array.from({ length: Math.floor(court.rating) }, (_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                    {court.rating % 1 !== 0 && <span>⭐</span>}
                  </p>
                </div>
                <p className="text-gray-600">{court.address}</p>
                <p className="font-bold text-red-500">Giá: {court.price}</p>
                <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full" onClick={() => handleViewDetails(court)}>Xem chi tiết</button>
                <button
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                  onClick={() => handleBooking(court)}
                >
                  Đặt sân
                </button>
              </div>
            ))}
          </div>
          {filteredCourts.length > courtsPerPage && (
            <div className="mt-6 flex justify-center">
              {Array.from({ length: Math.ceil(filteredCourts.length / courtsPerPage) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BadmintonCourtList;