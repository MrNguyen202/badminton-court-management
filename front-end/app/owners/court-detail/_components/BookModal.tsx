"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { courtApi } from "@/app/api/court-services/courtAPI";
import { subCourtApi } from "@/app/api/court-services/subCourtAPI";
import { formatDateWithDay } from "../_helps/FormatDateWithDay";
import {
  calculateTimeDifference,
  formatTimeDifference,
} from "../_helps/TimeHelper";
import { useRouter } from "next/navigation";

export default function BookModal({
  isOpen,
  onOpenChange,
  courtId,
  subCourtSelected,
  bookedSchedule,
}: any) {
  const router = useRouter();
  const [court, setCourt] = useState<any>(null);
  const [subCourt, setSubCourt] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [userNameBooking, setUserNameBooking] = useState(user?.name || "");
  const [userPhoneBooking, setUserPhoneBooking] = useState(user?.phone || "");
  const [userEmailBooking, setUserEmailBooking] = useState(user?.email || "");
  const [error, setError] = useState({ name: "", phone: "", email: "" });

  // Lấy thông tin sân từ courtId (nếu cần thiết)
  useEffect(() => {
    async function fetchCourt() {
      if (courtId) {
        try {
          const response = await courtApi.getCourtById(courtId);
          if (response) {
            setCourt(response);
          } else {
            console.error("Failed to fetch court data");
          }
        } catch (error) {
          console.error("Error fetching court:", error);
        }
      }
    }

    fetchCourt(); // gọi hàm async
  }, [courtId]);

  // Lấy thông tin sân con từ subCourtSelected (nếu cần thiết)
  useEffect(() => {
    async function fetchSubCourt() {
      if (subCourtSelected) {
        try {
          const response = await subCourtApi.getSubCourtById(subCourtSelected);
          if (response) {
            setSubCourt(response);
          } else {
            console.error("Failed to fetch sub-court data");
          }
        } catch (error) {
          console.error("Error fetching sub-court:", error);
        }
      }
    }

    fetchSubCourt(); // gọi hàm async
  }, [subCourtSelected]);

  // Hàm xử lý thay đổi input
  const handleNameChange = (e: any) => {
    const value = e.target.value;
    setUserNameBooking(value);
    // Kiểm tra validation
    if (value.trim().length < 2) {
      setError((prev) => ({
        ...prev,
        name: "Họ và tên phải có ít nhất 2 ký tự",
      }));
    } else {
      setError((prev) => ({ ...prev, name: "" }));
    }
  };

  const handlePhoneChange = (e: any) => {
    const value = e.target.value;
    setUserPhoneBooking(value);
    // Kiểm tra validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(value)) {
      setError((prev) => ({
        ...prev,
        phone: "Số điện thoại phải có 10 chữ số",
      }));
    } else {
      setError((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleEmailChange = (e: any) => {
    const value = e.target.value;
    setUserEmailBooking(value);
    // Kiểm tra validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setError((prev) => ({
        ...prev,
        email: "Email không hợp lệ",
      }));
    } else {
      setError((prev) => ({ ...prev, email: "" }));
    }
  };

  // Tính toán tổng thời gian và tổng tiền
  const totalHours = bookedSchedule
    ? calculateTimeDifference(bookedSchedule.fromHour, bookedSchedule.toHour)
    : 0;
  const totalCost = bookedSchedule ? bookedSchedule.price * totalHours : 0;

  // Hàm xử lý khi nhấn nút Đặt sân
  const handleBooking = (onClose: any) => {
    // Kiểm tra đã đủ thông tin chưa
    if(userNameBooking.trim() === "") {
      setError((prev) => ({ ...prev, name: "Vui lòng nhập họ và tên" }));
      return;
    }
    if(userPhoneBooking.trim() === "") {
      setError((prev) => ({ ...prev, phone: "Vui lòng nhập số điện thoại" }));
      return;
    }else if(error.email === "Email không hợp lệ") {
      setError((prev) => ({ ...prev, email: "Email không hợp lệ" }));
      return;
    }
    if(userEmailBooking.trim() === "") {
      setError((prev) => ({ ...prev, email: "Vui lòng nhập email" }));
      return;
    }
    // Kiểm tra nếu không có user và các trường input không hợp lệ
    if (!user && (!userNameBooking || !userPhoneBooking || !userEmailBooking)) {
      setError({
        name: !userNameBooking ? "Vui lòng nhập họ và tên" : "",
        phone: !userPhoneBooking ? "Vui lòng nhập số điện thoại" : "",
        email: !userEmailBooking ? "Vui lòng nhập email" : "",
      });
      return;
    }

    if (!user && (error.name || error.phone)) {
      return;
    }
    console.log("court", court);
    // Tạo đối tượng booking chứa thông tin đặt sân
    const bookingData = {
      courtId: courtId,
      courtName: court?.name,
      courtAddress: court?.address,
      subCourtId: subCourtSelected,
      subCourtName: subCourt?.subName,
      subCourtType: subCourt?.type,
      date: bookedSchedule?.date,
      fromHour: bookedSchedule?.fromHour,
      toHour: bookedSchedule?.toHour,
      price: bookedSchedule?.price,
      totalHours: totalHours,
      totalCost: totalCost,
      userInfo: {
        name: user && !(user?.role === "ADMIN") ? user.name : userNameBooking,
        phone: user && !(user?.role === "ADMIN") ? user.phone : userPhoneBooking,
        email: user && !(user?.role === "ADMIN") ? user.email : userEmailBooking,
      },
      bookedScheduleId: bookedSchedule?.scheduleId,
    };

    console.log("Booking data in modal:", bookingData);

    // Lưu thông tin vào localStorage để có thể truy cập ở trang booking
    localStorage.setItem("pendingBooking", JSON.stringify(bookingData));

    // Đóng modal sau khi đặt thành công
    setCourt(null);
    setSubCourt(null);
    setUserNameBooking("");
    setUserPhoneBooking("");
    setError({ name: "", phone: "", email: "" });
    onClose();

    // Chuyển hướng đến trang booking
    router.push("/booking");
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "overflow-y-auto",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 bg-slate-900 text-white">
              Đặt sân
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-row gap-4">
                {/* <img src={court?.images[court?.images.length - 1].url} alt="Image" className='w-[20%] object-cover h-full rounded-lg' /> */}
                <div>
                  <h1 className="text-black font-semibold text-xl">
                    {court?.name}
                  </h1>
                  <p className="text-gray-500 text-base">
                    {court?.address.specificAddress} - {court?.address.ward},{" "}
                    {court?.address.district}, {court?.address.province}
                  </p>
                </div>
              </div>
              <div>
                <div className="my-2">
                  <span className="font-bold">Ký hiệu sân chơi:</span>
                  <span className="ml-3">
                    {subCourt?.subName} -{" "}
                    {subCourt?.type === "DOUBLE" ? "Đôi" : "Đơn"}
                  </span>
                </div>
                <div className="my-2">
                  <span className="font-bold">Ngày:</span>
                  <span className="ml-3">
                    {formatDateWithDay(bookedSchedule?.date)}
                  </span>
                </div>
                <div className="my-2">
                  <span className="font-bold">Khung giờ:</span>
                  <span className="ml-3">
                    {bookedSchedule?.fromHour.slice(0, 5)} -{" "}
                    {bookedSchedule?.toHour.slice(0, 5)}
                  </span>
                </div>

                <div className="my-2">
                  <span className="font-bold">Họ và tên:</span>
                  {user && user?.role === "USER" ? (
                    <span className="ml-3">{user?.name}</span>
                  ) : (
                    <span className="ml-3">
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md p-1 w-[40%]"
                        placeholder="Nhập họ tên"
                        value={userNameBooking}
                        onChange={handleNameChange}
                      />
                      {error.name && (
                        <span className="text-red-500 text-sm ml-2">
                          {error.name}
                        </span>
                      )}
                    </span>
                  )}
                </div>
                <div className="my-2">
                  <span className="font-bold">Số điện thoại:</span>
                  {user && user?.role === "USER" ? (
                    <span className="ml-3">{user?.phone}</span>
                  ) : (
                    <span className="ml-3">
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md p-1 w-[40%]"
                        placeholder="Nhập số điện thoại"
                        value={userPhoneBooking}
                        onChange={handlePhoneChange}
                      />
                      {error.phone && (
                        <span className="text-red-500 text-sm ml-2">
                          {error.phone}
                        </span>
                      )}
                    </span>
                  )}
                </div>
                <div className="my-2">
                  <span className="font-bold">Email:</span>
                  {user && user?.role === "USER" ? (
                    <span className="ml-3">{user?.email}</span>
                  ) : (
                    <span className="ml-3">
                      <input
                        type="email"
                        className="border border-gray-300 rounded-md p-1 w-[40%]"
                        placeholder="Nhập email"
                        value={userEmailBooking}
                        onChange={handleEmailChange}
                      />
                      {error.email && (
                        <span className="text-red-500 text-sm ml-2">
                          {error.email}
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
              <span className="bg-gray-500 h-[1px]" />
              <div>
                <div className="flex flex-row justify-between items-center my-1">
                  <span className="font-bold">Đơn giá:</span>
                  <span>
                    {bookedSchedule?.price.toLocaleString("vi-VN") + " VNĐ"}{" "}
                    /giờ
                  </span>
                </div>
                <div className="flex flex-row justify-between items-center my-1">
                  <span className="font-bold">Tổng thời gian chơi:</span>
                  <span>{formatTimeDifference(totalHours)}</span>
                </div>
                <div className="flex flex-row justify-between items-center my-1">
                  <span className="font-bold">Tổng tiền:</span>
                  <span>{totalCost.toLocaleString("vi-VN") + " VNĐ"}</span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Hủy
              </Button>
              <Button color="primary" onPress={() => handleBooking(onClose)}>
                Đặt sân
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
