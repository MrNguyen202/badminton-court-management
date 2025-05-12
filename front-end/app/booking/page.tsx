"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@nextui-org/react";
import { toast } from "react-hot-toast";

export default function BookingPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Lấy thông tin đặt sân từ localStorage khi component được mount
  useEffect(() => {
    const pendingBooking = localStorage.getItem("pendingBooking");
    if (pendingBooking) {
      try {
        const parsedData = JSON.parse(pendingBooking);
        setBookingData(parsedData);
      } catch (error) {
        console.error("Error parsing booking data:", error);
        toast.error("Có lỗi khi lấy thông tin đặt sân");
        router.push("/"); // Nếu không có dữ liệu hợp lệ, quay về trang chủ
      }
    } else {
      // Nếu không có thông tin đặt sân, chuyển về trang chủ
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

      const paymentMethod = document.querySelector(
        'input[name="payment-method"]:checked'
      )?.id;
      const isDeposit = paymentMethod === "payment-cash";

      const requestBody = {
        courtId: bookingData.courtId,
        subCourtId: bookingData.subCourtId,
        date: bookingData.date,
        fromHour: formattedFromHour,
        toHour: formattedToHour,
        totalCost: bookingData.totalCost,
        userId: user?.id || null,
        userInfo: bookingData.userInfo,
        isDeposit: isDeposit,
      };

      console.log("Request body:", requestBody);

      const bookingResponse = await fetch(
        "http://localhost:8083/api/bookings",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const bookingDataResult = await bookingResponse.json();

      if (!bookingResponse.ok) {
        console.error("Booking error:", bookingDataResult);
        throw new Error(bookingDataResult.error || "Tạo booking thất bại");
      }

      const bookingId = bookingDataResult;
      console.log("Booking ID:", bookingId);

      const paymentResponse = await fetch(
        `http://localhost:8083/api/paypal/pay?bookingId=${bookingId}`,
        {
          method: "POST",
        }
      );

      const paymentResult = await paymentResponse.text();

      if (paymentResult.includes("Redirect to:")) {
        const url = paymentResult.replace("Redirect to: ", "").trim();
        window.location.href = url; // Chuyển hướng đến trang thanh toán PayPal
      } else {
        throw new Error(paymentResult || "Khởi tạo thanh toán thất bại");
      }
    } catch (error: any) {
      console.error("Error details:", error.message);
      toast.error(error.message || "Đặt sân thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Xóa dữ liệu đặt sân tạm thời và quay về trang chủ
    localStorage.removeItem("pendingBooking");
    router.push("/");
  };

  if (!bookingData) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Xác nhận đặt sân</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Thông tin đặt sân</h2>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold">Thông tin sân</h3>
              <p className="text-gray-600">{bookingData.courtName}</p>
              <p className="text-sm text-gray-500">
                {bookingData.courtAddress?.specificAddress} -{" "}
                {bookingData.courtAddress?.ward},
                {bookingData.courtAddress?.district},{" "}
                {bookingData.courtAddress?.province}
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold">Chi tiết sân</h3>
              <p className="text-gray-600">
                {bookingData.subCourtName} -{" "}
                {bookingData.subCourtType === "DOUBLE" ? "Đôi" : "Đơn"}
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold">Thời gian đặt</h3>
              <p className="text-gray-600">
                Ngày: {new Date(bookingData.date).toLocaleDateString("vi-VN")}
              </p>
              <p className="text-gray-600">
                Khung giờ: {bookingData.fromHour.slice(0, 5)} -{" "}
                {bookingData.toHour.slice(0, 5)}
              </p>
              <p className="text-gray-600">
                Thời lượng: {bookingData.totalHours} giờ
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold">Thông tin người đặt</h3>
              <p className="text-gray-600">
                Họ tên: {bookingData.userInfo.name}
              </p>
              <p className="text-gray-600">
                Số điện thoại: {bookingData.userInfo.phone}
              </p>
              {bookingData.userInfo.email && (
                <p className="text-gray-600">
                  Email: {bookingData.userInfo.email}
                </p>
              )}
            </div>

            <div>
              <h3 className="font-semibold">Chi phí</h3>
              <p className="text-gray-600">
                Đơn giá: {bookingData.price.toLocaleString("vi-VN")} VNĐ/giờ
              </p>
              <p className="text-lg font-medium">
                Tổng tiền: {bookingData.totalCost.toLocaleString("vi-VN")} VNĐ
              </p>
              <p className="text-red-500 italic text-sm mt-2">
                Lưu ý: Bạn sẽ phải đặt cọc 10% tổng tiền hoặc thanh toán toàn bộ
                để hoàn tất đặt sân!
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              color="danger"
              variant="light"
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
              {isLoading ? "Đang xử lý..." : "Xác nhận và thanh toán"}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
          <div className="space-y-4">
            <div className="border p-4 rounded-lg flex items-center">
              <input
                type="radio"
                id="payment-online"
                name="payment-method"
                className="mr-3"
                defaultChecked
              />
              <label htmlFor="payment-online">
                Thanh toán trực tuyến (VNPay, MoMo, PayPal, ZaloPay)
              </label>
            </div>
            <div className="border p-4 rounded-lg flex items-center">
              <input
                type="radio"
                id="payment-cash"
                name="payment-method"
                className="mr-3"
              />
              <label htmlFor="payment-cash">
                Đặt cọc 10% và thanh toán phần còn lại tại sân
              </label>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-2">Các bước đặt sân</h3>
            <ol className="list-decimal ml-5 space-y-2">
              <li>Xác nhận thông tin đặt sân và phương thức thanh toán</li>
              <li>Hoàn tất thanh toán hoặc đặt cọc</li>
              <li>Nhận thông tin xác nhận qua email/SMS</li>
              <li>Đến sân theo thời gian đã đặt</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}
