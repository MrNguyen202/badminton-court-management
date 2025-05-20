"use client";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, Button } from "@nextui-org/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { courtApi } from "@/app/api/court-services/courtAPI"; // Đường dẫn đến file courtApi
import { subCourtApi } from "@/app/api/court-services/subCourtAPI"; // Đường dẫn đến file subCourtApi

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Court {
  id: number;
  name: string;
  address: {
    province: string;
    district: string;
    ward: string;
    specificAddress: string;
  };
  phone: string;
}

interface SubCourt {
  id: number;
  subName: string;
  type: string;
}

interface Booking {
  id: number;
  courtId: number;
  subCourtId: number;
  scheduleId: number;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: string;
  paymentId?: string;
}

function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { bookingId } = params as { bookingId: string };
  const [user, setUser] = useState<User | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [court, setCourt] = useState<Court | null>(null);
  const [subCourt, setSubCourt] = useState<SubCourt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Lấy thông tin người dùng từ localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Lấy thông tin booking
        const response = await fetch(
          `http://localhost:8083/api/bookings/${bookingId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể lấy thông tin đặt sân");
        }

        const bookingData = await response.json();
        setBooking(bookingData);

        // Lấy thông tin sân dựa trên courtId
        if (bookingData.courtId) {
          const courtData = await courtApi.getCourtById(bookingData.courtId);
          setCourt(courtData);
        }

        // Lấy thông tin sân phụ dựa trên subCourtId
        if (bookingData.subCourtId) {
          const subCourtData = await subCourtApi.getSubCourtById(
            bookingData.subCourtId
          );
          setSubCourt(subCourtData);
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error(error.message || "Có lỗi khi lấy thông tin đặt sân");
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      fetchData();
    }
  }, [bookingId]);

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString("vi-VN", {
      dateStyle: "full",
    });
  };

  const formatTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime).toLocaleTimeString("vi-VN", {
      timeStyle: "short",
    });
    const end = new Date(endTime).toLocaleTimeString("vi-VN", {
      timeStyle: "short",
    });
    return `${start} - ${end}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!booking || !court || !subCourt) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <Card className="shadow-lg rounded-xl p-6 w-full max-w-md text-center">
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">
            Không tìm thấy thông tin đặt sân
          </h1>
          <Button
            color="primary"
            onClick={() => router.push("/profile/booked-calendar")}
          >
            Quay lại
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-green-100 p-4">
      <Card className="shadow-lg rounded-xl p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-700 text-center mb-4">
          Chi tiết đặt sân
        </h1>

        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-2">Thông tin sân</h2>
            <p className="text-gray-600">Tên sân: {court.name}</p>
            <p className="text-gray-600">
              Địa chỉ: {court.address.specificAddress}, {court.address.ward},{" "}
              {court.address.district}, {court.address.province}
            </p>
            <p className="text-gray-600">Số điện thoại: {court.phone}</p>
            <p className="text-gray-600">
              Loại sân: {subCourt.subName} (
              {subCourt.type === "SINGLE" ? "Đơn" : "Đôi"})
            </p>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-2">Thời gian</h2>
            <p className="text-gray-600">
              Ngày: {formatDate(booking.startTime)}
            </p>
            <p className="text-gray-600">
              Giờ: {formatTime(booking.startTime, booking.endTime)}
            </p>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-2">Chi phí</h2>
            <p className="text-gray-600">
              Tổng tiền: {booking.totalAmount.toLocaleString("vi-VN")} VNĐ
            </p>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-2">Trạng thái</h2>
            <p className="text-gray-600">
              {booking.status === "NEW" && (
                <span className="text-green-600">Đã thanh toán</span>
              )}
            </p>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-2">Thông tin người đặt</h2>
            <p className="text-gray-600">Họ tên: {user?.name}</p>
            <p className="text-gray-600">Số điện thoại: {user?.phone}</p>
            <p className="text-gray-600">Email: {user?.email}</p>
          </div>

          <div className="text-center">
            <Button
              color="primary"
              onClick={() => router.push("/profile/booked-calendar")}
            >
              Quay lại
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default BookingDetailPage;
