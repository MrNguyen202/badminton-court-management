"use client";

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import AddImage from "@/public/add-circle-stroke-rounded.svg";
import React from "react";

function AddScheduleSingle({ subcourt, date, filteredSchedules }: any) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [localSchedules, setLocalSchedules] = React.useState<{ fromHour: string; toHour: string; price: number; status: string; }[]>([]); // Lịch cục bộ
    const [startTime, setStartTime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [error, setError] = React.useState("");

    // Kết hợp filteredSchedules và localSchedules để hiển thị
    const combinedSchedules = [...filteredSchedules, ...localSchedules];

    const validateTime = (start: any, end: any) => {
        if (!start || !end) return "Vui lòng nhập đầy đủ thời gian.";
        const startDate = new Date(`2000-01-01T${start}`);
        const endDate = new Date(`2000-01-01T${end}`);
        if (startDate >= endDate) return "Thời gian kết thúc phải sau thời gian bắt đầu.";

        for (const schedule of combinedSchedules) {
            const existingStart = new Date(`2000-01-01T${schedule.fromHour}`);
            const existingEnd = new Date(`2000-01-01T${schedule.toHour}`);
            if (
                (startDate >= existingStart && startDate < existingEnd) ||
                (endDate > existingStart && endDate <= existingEnd) ||
                (startDate <= existingStart && endDate >= existingEnd)
            ) {
                return "Thời gian bị trùng với lịch hiện có.";
            }
        }
        return "";
    };

    const handleAddSchedule = () => {
        if (!startTime || !endTime || !price) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        const validationError = validateTime(startTime, endTime);
        if (validationError) {
            setError(validationError);
            return;
        }

        const newSchedule = {
            fromHour: startTime,
            toHour: endTime,
            price: parseFloat(price),
            status: "AVAILABLE", // Lịch mới luôn là AVAILABLE
        };

        setLocalSchedules([...localSchedules, newSchedule]);
        setError("");
        setStartTime("");
        setEndTime("");
        setPrice("");
    };

    const handleDeleteSchedule = (item: any) => {
        if (item.status === "BOOKED") {
            setError("Không thể xóa lịch đã đặt.");
            return;
        }
        // Xóa từ localSchedules nếu là lịch cục bộ
        if (localSchedules.includes(item)) {
            setLocalSchedules(localSchedules.filter((schedule) => schedule !== item));
        }
        setError("");
    };

    const handleAddSubCourtSchedule = async () => {
        alert("Thêm lịch thành công");
        onClose();
    };

    const handleCancel = () => {
        setLocalSchedules([]);
        setStartTime("");
        setEndTime("");
        setPrice("");
        setError("");
        onClose();
    }

    return (
        <>
            <div
                className="flex items-center justify-center p-2 px-3 border-b bg-primary-50 rounded-lg hover:bg-primary-100"
                onClick={onOpen}
            >
                <img src={AddImage.src} alt="" />
            </div>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="5xl"
                scrollBehavior="inside"
                classNames={{
                    base: "max-h-[90vh]",
                    body: "overflow-y-auto",
                }}
            >
                <ModalContent>
                    <ModalHeader className="text-xl">Thêm lịch đơn lẻ</ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-semibold border-l-4 border-orange-300 pl-3">
                                    Sân: {subcourt}
                                </span>
                                <span className="text-xl font-semibold">Ngày: {date.toDateString()}</span>
                            </div>
                        </div>
                        <div className="flex flex-row gap-4 mt-4 justify-between items-center">
                            <div className="border border-gray-300 rounded-md p-5 shadow-lg w-[40%]">
                                <div>
                                    <span className="text-lg font-semibold text-gray-400">Thời gian bắt đầu</span>
                                    <input
                                        type="time"
                                        className="border border-gray-300 rounded-lg p-2 w-full mt-2"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>
                                <div className="mt-4">
                                    <span className="text-lg font-semibold text-gray-400">Thời gian kết thúc</span>
                                    <input
                                        type="time"
                                        className="border border-gray-300 rounded-lg p-2 w-full mt-2"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                    />
                                </div>
                                <div className="mt-4">
                                    <span className="text-lg font-semibold text-gray-400">
                                        Giá (tính theo giờ - giá/h)
                                    </span>
                                    <input
                                        type="number"
                                        className="border border-gray-300 rounded-lg p-2 w-full mt-2"
                                        placeholder="Nhập giá sân"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center w-[20%] h-[100%]">
                                <p className="text-red-500 text-center italic mb-5">{error}</p>
                                <button
                                    className="w-[50px] h-[50px] bg-primary-500 text-white rounded-lg flex items-center justify-center hover:bg-primary-600 transition duration-300 shadow-lg"
                                    onClick={handleAddSchedule}
                                >
                                    {'>>'}
                                </button>
                            </div>
                            <div className="border border-gray-300 rounded-md p-5 shadow-xl w-[40%] h-[100%] overflow-y-auto">
                                <h1 className="text-xl font-bold text-center">Danh sách lịch</h1>
                                <div className="flex flex-col gap-2 p-2">
                                    {combinedSchedules.map((schedule, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 border-b border-gray-300"
                                        >
                                            <span className="text-lg font-bold text-gray-900">
                                                {schedule.fromHour.slice(0, 5)} - {schedule.toHour.slice(0, 5)}
                                            </span>
                                            <span className="text-lg font-bold text-gray-900">
                                                {schedule.price} VNĐ/h
                                            </span>
                                            <button
                                                className={`rounded-lg px-2 py-1 transition duration-300 ${schedule.status === "BOOKED"
                                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    : "hover:bg-gray-500 hover:text-white"
                                                    }`}
                                                onClick={() => handleDeleteSchedule(schedule)}
                                                disabled={schedule.status === "BOOKED"}
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="py-4">
                            <p className="text-red-500 italic">Lưu ý: Lịch đã đặt không được chỉnh sửa hay xóa</p>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                            onClick={handleCancel}
                        >
                            Hủy
                        </button>
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                            onClick={handleAddSubCourtSchedule}
                        >
                            Lưu
                        </button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default AddScheduleSingle;