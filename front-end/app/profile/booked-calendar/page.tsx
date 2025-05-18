"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Booking {
  id: number;
  courtId: number;
  courtName: string;
  subCourtId: number;
  subCourtName: string;
  scheduleId: number;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: string;
  paymentId?: string;
}

function BookingHistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast.error("Không thể tải thông tin người dùng");
        router.push("/login");
      }
    } else {
      toast.error("Vui lòng đăng nhập để xem lịch sử đặt sân");
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (user?.id) {
      const fetchBookings = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            `http://localhost:8083/api/bookings/user/${user.id}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (!response.ok) {
            throw new Error("Không thể lấy danh sách đặt sân");
          }

          const data = await response.json();
          setBookings(data);
        } catch (error: any) {
          console.error("Error fetching bookings:", error);
          toast.error(error.message || "Có lỗi khi lấy danh sách đặt sân");
        } finally {
          setIsLoading(false);
        }
      };

      fetchBookings();
    }
  }, [user]);

  const handleViewDetails = (bookingId: number) => {
    router.push(`/profile/booked-calendar/${bookingId}`);
  };

  const handleBackToProfile = () => {
    router.push("/profile");
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString("vi-VN", {
      dateStyle: "short",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "NEW":
        return "Đã thanh toán";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Nút Quay lại */}
        <div className="mb-4">
          <Button
            onClick={handleBackToProfile}
            color="default"
            variant="flat"
            className="hover:bg-gray-200 transition-colors"
          >
            Quay lại Profile
          </Button>
        </div>

        <Card className="shadow-xl rounded-2xl p-8 bg-white">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Lịch sử đặt sân
          </h1>

          {bookings.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">
              Bạn chưa có lịch đặt sân nào.
            </p>
          ) : (
            <Table
              aria-label="Booking history table"
              classNames={{
                wrapper: "border-none shadow-none",
                th: "bg-blue-50 text-gray-700 font-semibold text-base",
                td: "py-4 text-gray-600 text-base",
                tr: "hover:bg-gray-50 transition-colors",
              }}
            >
              <TableHeader>
                <TableColumn>Ngày</TableColumn>
                <TableColumn>Giờ</TableColumn>
                <TableColumn>Tổng tiền</TableColumn>
                <TableColumn>Trạng thái</TableColumn>
                <TableColumn>Hành động</TableColumn>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{formatDate(booking.startTime)}</TableCell>
                    <TableCell>
                      {formatTime(booking.startTime, booking.endTime)}
                    </TableCell>
                    <TableCell>
                      {booking.totalAmount.toLocaleString("vi-VN")} VNĐ
                    </TableCell>
                    <TableCell>
                      <Tooltip content={getStatusText(booking.status)}>
                        <Chip
                          color={getStatusColor(booking.status)}
                          variant="flat"
                          size="sm"
                          className="font-medium"
                        >
                          {getStatusText(booking.status)}
                        </Chip>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => handleViewDetails(booking.id)}
                        className="font-medium hover:scale-105 transition-transform"
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}

export default BookingHistoryPage;
