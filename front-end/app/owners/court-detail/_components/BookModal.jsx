'use client';

import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { courtApi } from '@/app/api/court-services/courtAPI';
import { subCourtApi } from '@/app/api/court-services/subCourtAPI';
import { formatDateWithDay } from '../_helps/FormatDateWithDay';
import { calculateTimeDifference, formatTimeDifference } from '../_helps/TimeHelper';

export default function BookModal({
    isOpen,
    onOpenChange,
    courtId,
    subCourtSelected,
    bookedSchedule
}) {

    const [court, setCourt] = useState(null);
    const [subCourt, setSubCourt] = useState(null);
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const [userNameBooking, setUserNameBooking] = useState(user?.name || "");
    const [userPhoneBooking, setUserPhoneBooking] = useState(user?.phone || "");
    const [error, setError] = useState({ name: "", phone: "" });

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
    const handleNameChange = (e) => {
        const value = e.target.value;
        setUserNameBooking(value);
        // Kiểm tra validation
        if (value.trim().length < 2) {
            setError((prev) => ({ ...prev, name: "Họ và tên phải có ít nhất 2 ký tự" }));
        } else {
            setError((prev) => ({ ...prev, name: "" }));
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setUserPhoneBooking(value);
        // Kiểm tra validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value)) {
            setError((prev) => ({ ...prev, phone: "Số điện thoại phải có 10 chữ số" }));
        } else {
            setError((prev) => ({ ...prev, phone: "" }));
        }
    };

    // Hàm xử lý khi nhấn nút Đặt sân
    const handleBooking = (onClose) => {
        // Kiểm tra nếu không có user và các trường input không hợp lệ
        if (!user && (!userNameBooking || !userPhoneBooking)) {
            setError({
                name: !userNameBooking ? "Vui lòng nhập họ và tên" : "",
                phone: !userPhoneBooking ? "Vui lòng nhập số điện thoại" : ""
            });
            return;
        }

        if (!user && (error.name || error.phone)) {
            return;
        }

        // Thực hiện logic đặt sân ở đây (gọi API hoặc các thao tác khác)
        console.log("Booking details:", {
            name: userNameBooking,
            phone: userPhoneBooking,
            courtId,
            subCourtSelected,
            bookedSchedule
        });

        // Đóng modal sau khi đặt thành công
        setCourt(null);
        setSubCourt(null);
        setUserNameBooking("");
        setUserPhoneBooking("");
        setError({ name: "", phone: "" });
        onClose();
    };

    // Tính toán tổng thời gian và tổng tiền
    const totalHours = bookedSchedule ? calculateTimeDifference(bookedSchedule.fromHour, bookedSchedule.toHour) : 0;

    // Định dạng thời gian thành chuỗi "X giờ Y phút"
    const totalCost = bookedSchedule ? bookedSchedule.price * totalHours : 0;

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl"
            scrollBehavior="inside"
            classNames={{
                base: "max-h-[90vh]",
                body: "overflow-y-auto",
            }}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 bg-slate-900 text-white">Đặt sân</ModalHeader>
                        <ModalBody>
                            <div className='flex flex-row gap-4'>
                                <img src={court?.images[court?.images.length - 1].url} alt="Image" className='w-[20%] object-cover h-full rounded-lg' />
                                <div>
                                    <h1 className='text-black font-semibold text-xl'>{court?.name}</h1>
                                    <p className='text-gray-500 text-base'>{court?.address.specificAddress} - {court?.address.ward}, {court?.address.district}, {court?.address.province}</p>
                                </div>
                            </div>
                            <div>
                                <div className='my-2'>
                                    <span className='font-bold'>Ký hiệu sân chơi:</span>
                                    <span className='ml-3'>{subCourt?.subName} - {subCourt?.type === "DOUBLE" ? "Đôi" : "Đơn"}</span>
                                </div>
                                <div className='my-2'>
                                    <span className='font-bold'>Ngày:</span>
                                    <span className='ml-3'>{formatDateWithDay(bookedSchedule?.date)}</span>
                                </div>
                                <div className='my-2'>
                                    <span className='font-bold'>Khung giờ:</span>
                                    <span className='ml-3'>{bookedSchedule?.fromHour.slice(0, 5)} - {bookedSchedule?.toHour.slice(0, 5)}</span>
                                </div>
                                <div className='my-2'>
                                    <span className='font-bold'>Họ và tên:</span>
                                    {user && user?.role === "USER" ? (
                                        <span className='ml-3'>{user?.name}</span>
                                    ) : (
                                        <span className='ml-3'>
                                            <input
                                                type="text"
                                                className='border border-gray-300 rounded-md p-1 w-[40%]'
                                                placeholder='Nhập họ tên'
                                                value={userNameBooking}
                                                onChange={handleNameChange}
                                            />
                                            {error.name && <span className='text-red-500 text-sm ml-2'>{error.name}</span>}
                                        </span>
                                    )}
                                </div>
                                <div className='my-2'>
                                    <span className='font-bold'>Số điện thoại:</span>
                                    {user && user?.role === "USER" ? (
                                        <span className='ml-3'>{user?.phone}</span>
                                    ) : (
                                        <span className='ml-3'>
                                            <input
                                                type="text"
                                                className='border border-gray-300 rounded-md p-1 w-[40%]'
                                                placeholder='Nhập số điện thoại'
                                                value={userPhoneBooking}
                                                onChange={handlePhoneChange}
                                            />
                                            {error.phone && <span className='text-red-500 text-sm ml-2'>{error.phone}</span>}
                                        </span>
                                    )}
                                </div>
                                {user && user?.role === "USER" && (
                                    <div className='my-2'>
                                        <span className='font-bold'>Email:</span>
                                        <span className='ml-3'>{user?.email}</span>
                                    </div>
                                )}
                            </div>
                            <span className='bg-gray-500 h-[1px]' />
                            <div>
                                <div className='flex flex-row justify-between items-center my-1'>
                                    <span className='font-bold'>Đơn giá:</span>
                                    <span>{bookedSchedule?.price.toLocaleString("vi-VN") + " VNĐ"} /giờ</span>
                                </div>
                                <div className='flex flex-row justify-between items-center my-1'>
                                    <span className='font-bold'>Tổng thời gian chơi:</span>
                                    <span>{formatTimeDifference(totalHours)}</span>
                                </div>
                                <div className='flex flex-row justify-between items-center my-1'>
                                    <span className='font-bold'>Tổng tiền:</span>
                                    <span>{totalCost.toLocaleString("vi-VN") + " VNĐ"}</span>
                                </div>
                            </div>
                            <p className='text-red-500 italic text-sm'>Lưu ý: Khi đặt bạn phải cọc trước 10% tổng tiền hoặc thanh toán toàn bộ!</p>
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