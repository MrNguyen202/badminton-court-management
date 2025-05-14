"use client";

import React, { useEffect, useState } from "react";
import noImage from "../../public/no-product-image.jpg";
import location from "../../public/location.png";
import courtImage from "../../public/football-field.gif";
import calenderImage from "../../public/calendar.gif";
import utilityImage from "../../public/utility.gif";
import { courtApi } from "../api/court-services/courtAPI";
import Footer from "../_components/Footer";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type SubCourt = {
  id: number;
  subName: string;
  type: string;
};

type Court = {
  id: number;
  name: string;
  address: Address;
  phone: string;
  description: string;
  numberOfSubCourts: number;
  status: string;
  userID: number;
  images: Image[] | null;
  rating: number;
  district: string;
  utilities: string;
  openTime: string;
  closeTime: string;
  linkWeb: string;
  linkMap: string;
  subCourts: SubCourt[] | null;
  createDate: string;
};

type Image = {
  id: number;
  fileName: string;
  url: string;
  upLoadDate: string;
  upLoadBy: string;
};

type Address = {
  province: string;
  district: string;
  ward: string;
  specificAddress: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
};

function BadmintonCourtList() {
  const router = useRouter();
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [filter, setFilter] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const courtsPerPage = 8;
  const [courts, setCourts] = useState<Court[]>([]);
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as User | null;

  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [searchParams]);

  //get all courts tu api
  useEffect(() => {
    if (user === null) {
      courtApi.getAllCourt().then((data) => {
        setCourts(data);
      });
    } else {
      courtApi.getNotCourtByUserID(user.id).then((data) => {
        setCourts(data);
      });
    }
  }, []);

  const handleBooking = (court: Court) => {
    setSelectedCourt(court);
    router.push(`/owners/court-detail?courtID=${court.id}`);
  };

  const filteredCourts = courts.filter(
    (court) =>
      court.name.toLowerCase().includes(filter.toLowerCase()) &&
      (selectedDistrict
        ? court.numberOfSubCourts === Number(selectedDistrict)
        : true) &&
      (selectedRating
        ? Math.floor(court.numberOfSubCourts) === Number(selectedRating)
        : true)
  );

  const indexOfLastCourt = currentPage * courtsPerPage;
  const indexOfFirstCourt = indexOfLastCourt - courtsPerPage;
  const currentCourts = filteredCourts.slice(
    indexOfFirstCourt,
    indexOfLastCourt
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 max-w-full mx-auto flex flex-col ">
      <div className="flex w-full">
        <div className="w-1/5 p-4 border-r">
          <h2 className="text-lg font-bold mb-2">Bộ lọc</h2>
          <input
            type="text"
            placeholder="Tìm kiếm sân..."
            className="w-full p-2 border rounded mb-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          {/* <select
            className="w-full p-2 border rounded mb-2"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option value="">Chọn quận</option>
            {[...new Set(courts.map((c) => c.district))].map((district) => (
              <option key={district} value={district}>Quận {district}</option>
            ))}
          </select> */}
          <select
            className="w-full p-2 border rounded"
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
          >
            <option value="">Chọn số sao</option>
            {[5, 4, 3, 2, 1].map((star) => (
              <option key={star} value={star}>
                {star} sao
              </option>
            ))}
          </select>
        </div>
        <div className="w-4/5 p-4">
          <h1 className="text-3xl font-bold mb-4">Danh sách sân cầu lông</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentCourts.map((court) => (
              <div
                key={court.id}
                className="border p-4 rounded-lg shadow-md bg-white"
              >
                <img
                  src={
                    court.images && court.images[0]
                      ? court.images[0].url
                      : noImage.src
                  }
                  alt={"No image"}
                  className="w-full h-52 object-cover rounded-md mb-2"
                />
                <h2 className="text-lg font-semibold mb-4 truncate pr-4">
                  {court.name}
                </h2>
                <div className="flex items-center">
                  <img
                    src={location.src}
                    alt="location"
                    className="w-5 h-5 mr-1"
                  />
                  <p className="text-gray-600 truncate">
                    Khu vực:{" "}
                    {court.address.district.replace(
                      /^(Huyện|Thành phố|Thị xã)/,
                      ""
                    )}{" "}
                    - {court.address.province.replace(/^(Tỉnh|Thành phố)/, "")}
                  </p>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <img
                      src={courtImage.src}
                      alt="location"
                      className="w-5 h-5 mr-1"
                    />
                    <p className="text-gray-600">
                      Số sân: {court.numberOfSubCourts}
                    </p>
                  </div>
                  <p className="text-yellow-500 font-semibold">
                    {Array.from(
                      { length: Math.floor(court.numberOfSubCourts) },
                      (_, i) => (
                        <span key={i}>⭐</span>
                      )
                    )}
                    {court.numberOfSubCourts % 1 !== 0 && <span>⭐</span>}(
                    {court.numberOfSubCourts})
                  </p>
                </div>
                <div className="flex items-center">
                  <img
                    src={calenderImage.src}
                    alt="location"
                    className="w-5 h-5 mr-1"
                  />
                  <p className="text-gray-600">Sân trống: </p>
                </div>
                <div className="flex items-center">
                  <img
                    src={utilityImage.src}
                    alt="location"
                    className="w-5 h-5 mr-1"
                  />
                  <p className="text-gray-600 truncate pr-4">
                    Tiện ích: {court.utilities}
                  </p>
                </div>
                <button
                  className="mt-3 bg-slate-900 border-slate-900 border-1 text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition duration-500 w-full"
                  onClick={() => handleBooking(court)}
                >
                  Đặt sân ngay
                </button>
              </div>
            ))}
          </div>
          {filteredCourts.length > courtsPerPage && (
            <div className="mt-6 flex justify-center">
              {Array.from(
                { length: Math.ceil(filteredCourts.length / courtsPerPage) },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`mx-1 px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default BadmintonCourtList;
