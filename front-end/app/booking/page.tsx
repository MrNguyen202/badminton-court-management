"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@nextui-org/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { subCourtScheduleApi } from "../api/court-services/subCourtSchedule";

export default function BookingPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const pendingBooking = localStorage.getItem("pendingBooking");
    if (pendingBooking) {
      try {
        const parsedData = JSON.parse(pendingBooking);
        setBookingData(parsedData);
      } catch (error) {
        console.error("Error parsing booking data:", error);
        toast.error("Có lỗi khi lấy thông tin đặt sân");
        router.push("/");
      }
    } else {
      toast.error("Không tìm thấy thông tin đặt sân");
      router.push("/");
    }
  }, [router]);

  const handleBookingConfirm = async () => {
    try {
      setIsLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "null");

      const date = bookingData.date;
      const fromHour = bookingData.fromHour.slice(0, 5);
      const toHour = bookingData.toHour.slice(0, 5);
      const formattedFromHour = `${date}T${fromHour}:00`;
      const formattedToHour = `${date}T${toHour}:00`;

      const requestBody = {
        courtId: bookingData.courtId,
        subCourtId: bookingData.subCourtId,
        scheduleId: bookingData.bookedScheduleId,
        date: bookingData.date,
        fromHour: formattedFromHour,
        toHour: formattedToHour,
        totalCost: bookingData.totalCost,
        userId: user?.id || null,
        userInfo: bookingData.userInfo,
        isDeposit: false,
      };

      if (user?.role === "ADMIN") {
        // ADMIN: Xác nhận đặt sân mà không cần thanh toán PayPal
        const token = localStorage.getItem("token") || user.token;
        const bookingResponse = await fetch(
          `http://localhost:8080/api/paypal/confirm`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
          }
        );
        const paymentResult = await bookingResponse.text();
        console.log("paymentResult", paymentResult);
        if (paymentResult === "success") {
          console.log("Đặt sân thành công");
          await subCourtScheduleApi.updateStatusSubCourtSchedule(
            Number(bookingData.bookedScheduleId),
            Number(bookingData.subCourtId),
            "BOOKED"
          );
          router.push("/owners/court-detail?courtID=" + bookingData.courtId);
          toast.success("Đặt sân thành công! Thanh toán tiền mặt tại sân.");
          localStorage.removeItem("pendingBooking");
        }
      } else {
        // USER: Thanh toán qua PayPal
        const paymentResponse = await fetch(
          `http://localhost:8080/api/paypal/pay`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          }
        );

        const paymentResult = await paymentResponse.text();

        if (paymentResult.includes("Redirect to:")) {
          const url = paymentResult.replace("Redirect to: ", "").trim();
          window.location.href = url;
        } else {
          throw new Error(paymentResult || "Khởi tạo thanh toán thất bại");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Đặt sân thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("pendingBooking");
    router.push("/owners/court-detail?courtID=" + bookingData.courtId);
  };

  if (!bookingData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        Xác nhận và thanh toán
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 space-y-4 shadow-xl">
          <h2 className="text-xl font-semibold text-primary">
            Thông tin đặt sân
          </h2>

          <div className="text-sm space-y-3 text-gray-700">
            <div>
              <strong>Sân:</strong> {bookingData.courtName}
              <p>
                {bookingData.courtAddress?.specificAddress} -{" "}
                {bookingData.courtAddress?.ward},{" "}
                {bookingData.courtAddress?.district},{" "}
                {bookingData.courtAddress?.province}
              </p>
            </div>

            <div>
              <strong>Loại sân:</strong> {bookingData.subCourtName} (
              {bookingData.subCourtType === "DOUBLE" ? "Đôi" : "Đơn"})
            </div>

            <div>
              <strong>Thời gian:</strong>
              <p>
                {new Date(bookingData.date).toLocaleDateString("vi-VN")} —{" "}
                {bookingData.fromHour.slice(0, 5)} đến{" "}
                {bookingData.toHour.slice(0, 5)}
              </p>
              <p>Thời lượng: {bookingData.totalHours} giờ</p>
            </div>

            <div>
              <strong>Người đặt:</strong>
              <p>
                {bookingData.userInfo.name} - {bookingData.userInfo.phone}
              </p>
              {bookingData.userInfo.email && (
                <p>{bookingData.userInfo.email}</p>
              )}
            </div>

            <div className="pt-2 border-t">
              <strong>Chi phí:</strong>
              <p>
                Đơn giá: {bookingData.price.toLocaleString("vi-VN")} VNĐ/giờ
              </p>
              <p className="text-lg font-semibold text-green-600">
                Tổng cộng: {bookingData.totalCost.toLocaleString("vi-VN")} VNĐ
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <Button
              color="danger"
              variant="ghost"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              color="primary"
              onClick={handleBookingConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </div>
        </Card>

        <Card className="p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Thanh toán
          </h2>
          <div className="border p-4 rounded-lg flex items-center bg-blue-50">
            <input
              type="radio"
              id="payment-online"
              name="payment-method"
              className="mr-3"
              defaultChecked
              disabled
            />
            <label htmlFor="payment-online">
              {JSON.parse(localStorage.getItem("user") || "null")?.role ===
              "ADMIN"
                ? "Thanh toán tiền mặt tại sân"
                : "Thanh toán qua PayPal"}
            </label>
          </div>

          <div className="mt-8 text-gray-600">
            <h3 className="font-semibold mb-2">Hướng dẫn đặt sân</h3>
            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li>Xác nhận thông tin sân & thanh toán</li>
              {JSON.parse(localStorage.getItem("user") || "null")?.role ===
              "ADMIN" ? (
                <>
                  <li>Xác nhận đặt sân tại hệ thống</li>
                  <li>Nhận tiền mặt tại sân</li>
                </>
              ) : (
                <>
                  <li>Thực hiện thanh toán qua PayPal</li>
                  <li>Nhận email xác nhận thanh toán và đặt sân</li>
                </>
              )}
              <li>Đến sân đúng thời gian đã đặt</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
