import React, { useEffect, useState } from "react";
import { RadioGroup, Radio } from "@heroui/react";
import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/modal";
import courtImage from "../../../../public/football-field.gif";
import { courtApi } from "../../../api/court-services/courtAPI";
import { scheduleApi } from "../../../api/court-services/scheduleAPI";
import { TimeInput } from "@heroui/react";
import { Time } from "@internationalized/date";
import soonImage from "../../../../public/sun-03-stroke-rounded.svg";
import moonImage from "../../../../public/moon-02-stroke-rounded.svg";
import { Input } from "@nextui-org/input";

function AddScheduleSmart({ courtID }: { courtID: any }) {
    const [numberOfCourt, setNumberOfCourt] = useState(0);
    const [courtId, setCourtId] = useState(courtID);

    useEffect(() => {
        const fetchNumberOfCourts = async () => {
            try {
                const response = await courtApi.getNumberOfCourts(courtId);
                setNumberOfCourt(response);
            } catch (error) {
                console.log(error);
            }
        };
        fetchNumberOfCourts();
    }, [courtId]);
    console.log("ID", courtId);

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    // State cho các sân được chọn
    const [selectedCourts, setSelectedCourts] = useState<string[]>(["all"]);

    // State cho khung giờ Sáng
    const [morningInterval, setMorningInterval] = useState<"owntime" | "part-own" | "twotime">("owntime");
    const [morningStartTime, setMorningStartTime] = useState<Time | null>(new Time(4, 0));
    const [morningEndTime, setMorningEndTime] = useState<Time | null>(new Time(12, 0));

    // State cho khung giờ Tối
    const [eveningInterval, setEveningInterval] = useState<"owntime" | "part-own" | "twotime">("owntime");
    const [eveningStartTime, setEveningStartTime] = useState<Time | null>(new Time(13, 0));
    const [eveningEndTime, setEveningEndTime] = useState<Time | null>(new Time(22, 0));

    // State cho phạm vi thời gian áp dụng
    const [duration, setDuration] = useState<"day" | "week" | "month" | "year">("day");

    // State cho giá
    const [price, setPrice] = useState<string>("100");

    // Tạo danh sách tất cả các sân (dùng để kiểm tra logic "Tất cả")
    const allCourtValues = Array.from({ length: numberOfCourt }, (_, index) => `court-${index + 1}`);

    // Hàm xử lý khi thay đổi trạng thái của checkbox
    const handleCourtSelectionChange = (newSelectedCourts: string[]) => {
        // Lấy danh sách sân đã chọn, loại bỏ "all" để kiểm tra
        const selectedWithoutAll = newSelectedCourts.filter(court => court !== "all");

        // Kiểm tra nếu tất cả các sân riêng lẻ đều được chọn
        const allCourtsSelected = allCourtValues.every(court => newSelectedCourts.includes(court));

        if (newSelectedCourts.includes("all")) {
            // Nếu "Tất cả" được chọn
            if (!selectedCourts.includes("all")) {
                // Nếu trước đó "Tất cả" chưa được chọn, tích tất cả các sân
                setSelectedCourts([...allCourtValues, "all"]);
            } else {
                // Nếu "Tất cả" đã được chọn trước đó, bỏ tích "Tất cả" nhưng giữ các sân đã chọn
                setSelectedCourts(selectedWithoutAll);
            }
        } else {
            // Nếu "Tất cả" không được chọn
            if (selectedCourts.includes("all")) {
                // Nếu trước đó "Tất cả" đã được chọn, bỏ tích tất cả các sân
                setSelectedCourts([]);
            } else {
                // Nếu "Tất cả" không được chọn trước đó
                if (allCourtsSelected) {
                    // Nếu tất cả các sân riêng lẻ đều được chọn, tự động tích "Tất cả"
                    setSelectedCourts([...selectedWithoutAll, "all"]);
                } else {
                    // Nếu không phải tất cả sân đều được chọn, cập nhật danh sách sân đã chọn (không có "all")
                    setSelectedCourts(selectedWithoutAll);
                }
            }
        }
    };

    // Hàm tạo danh sách lịch dựa trên khoảng thời gian và interval
    const generateSchedules = (
        startTime: Time | null,
        endTime: Time | null,
        interval: "owntime" | "part-own" | "twotime"
    ) => {
        if (!startTime || !endTime) return [];

        const schedules: { fromHour: string; toHour: string }[] = [];
        let currentHour = startTime.hour;
        let currentMinute = startTime.minute;

        const intervalMinutes =
            interval === "owntime" ? 60 :
                interval === "part-own" ? 90 :
                    120; // 2 tiếng

        while (
            (currentHour < endTime.hour) ||
            (currentHour === endTime.hour && currentMinute < endTime.minute)
        ) {
            const fromHour = `${currentHour.toString().padStart(2, "0")}:${currentMinute
                .toString()
                .padStart(2, "0")}`;

            let nextHour = currentHour + Math.floor((currentMinute + intervalMinutes) / 60);
            let nextMinute = (currentMinute + intervalMinutes) % 60;
            if (nextHour > endTime.hour || (nextHour === endTime.hour && nextMinute > endTime.minute)) break;

            const toHour = `${nextHour.toString().padStart(2, "0")}:${nextMinute
                .toString()
                .padStart(2, "0")}`;

            schedules.push({ fromHour, toHour });
            currentHour = nextHour;
            currentMinute = nextMinute;
        }

        return schedules;
    };

    // Tạo danh sách lịch cho khung Sáng và Tối
    const morningSchedules = generateSchedules(morningStartTime, morningEndTime, morningInterval);
    const eveningSchedules = generateSchedules(eveningStartTime, eveningEndTime, eveningInterval);

    // Hàm gửi dữ liệu lên backend
    const handleAddSchedule = async () => {
        try {
            const today = new Date();
            const daysToAdd =
                duration === "day" ? 1 :
                    duration === "week" ? 7 :
                        duration === "month" ? 30 :
                            365; // year

            const courtIndexes = selectedCourts.includes("all")
                ? Array.from({ length: numberOfCourt }, (_, i) => i + 1)
                : selectedCourts.map(court => parseInt(court.split("-")[1]));

            const schedulesToAdd = [];
            const priceValue = parseFloat(price) || 0;

            for (let i = 0; i < daysToAdd; i++) {
                const currentDate = new Date(today);
                currentDate.setDate(today.getDate() + i);
                const dateString = currentDate.toISOString().split("T")[0];

                // Thêm lịch khung Sáng
                for (const schedule of morningSchedules) {
                    for (const indexCourt of courtIndexes) {
                        schedulesToAdd.push({
                            courtId: courtId,
                            indexCourt,
                            date: dateString,
                            fromHour: schedule.fromHour + ":00",
                            toHour: schedule.toHour + ":00",
                            price: priceValue,
                            status: "AVAILABLE"
                        });
                    }
                }

                // Thêm lịch khung Tối
                for (const schedule of eveningSchedules) {
                    for (const indexCourt of courtIndexes) {
                        schedulesToAdd.push({
                            courtId: courtId,
                            indexCourt,
                            date: dateString,
                            fromHour: schedule.fromHour + ":00",
                            toHour: schedule.toHour + ":00",
                            price: priceValue,
                            status: "AVAILABLE"
                        });
                    }
                }
            }

            console.log("Schedules to add:", schedulesToAdd);

            for (const schedule of schedulesToAdd) {
                await scheduleApi.createSchedule(schedule);
            }

            alert("Thêm lịch thành công!");
            onClose();
        } catch (error) {
            console.error("Lỗi khi thêm lịch:", error);
            alert("Có lỗi xảy ra khi thêm lịch.");
        }
    };

    return (
        <>
            <div className="flex items-center mr-3">
                <img src={courtImage.src} alt="Court" className="w-7 h-7" />
                <span
                    className="text-lg text-primary-500 underline cursor-pointer"
                    onClick={onOpen}
                >
                    Thêm lịch thông minh
                </span>
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
                    <ModalHeader className="text-xl">Thêm lịch thông minh</ModalHeader>
                    <ModalBody>
                        <CheckboxGroup
                            color="primary"
                            value={selectedCourts}
                            onValueChange={handleCourtSelectionChange}
                            label="Chọn sân"
                            orientation="horizontal"
                            className="mb-4"
                        >
                            {Array.from({ length: numberOfCourt }).map((_, index) => (
                                <Checkbox key={index} value={`court-${index + 1}`}>
                                    Sân {index + 1}
                                </Checkbox>
                            ))}
                            <Checkbox value="all">Tất cả</Checkbox>
                        </CheckboxGroup>

                        {/* Khung giờ Sáng */}
                        <RadioGroup
                            label="Khung giờ sáng"
                            orientation="horizontal"
                            value={morningInterval}
                            onValueChange={(value) => setMorningInterval(value as typeof morningInterval)}
                            color="primary"
                            className="mb-2"
                        >
                            <Radio value="owntime">1 tiếng</Radio>
                            <Radio value="part-own">1,5 tiếng</Radio>
                            <Radio value="twotime">2 tiếng</Radio>
                        </RadioGroup>
                        <div className="flex gap-4 mb-4">
                            <TimeInput
                                label="Thời gian bắt đầu"
                                value={morningStartTime as any}
                                onChange={(value) => setMorningStartTime(value as Time | null)}
                                hourCycle={24}
                                granularity="minute"
                                placeholderValue={new Time(4, 0)}
                            />
                            <TimeInput
                                label="Thời gian kết thúc"
                                value={morningEndTime as any}
                                onChange={(value) => setMorningEndTime(value as Time | null)}
                                hourCycle={24}
                                granularity="minute"
                                placeholderValue={new Time(12, 0)}
                            />
                        </div>

                        {/* Khung giờ Tối */}
                        <RadioGroup
                            label="Khung giờ tối"
                            orientation="horizontal"
                            value={eveningInterval}
                            onValueChange={(value) => setEveningInterval(value as typeof eveningInterval)}
                            color="primary"
                            className="mb-2"
                        >
                            <Radio value="owntime">1 tiếng</Radio>
                            <Radio value="part-own">1,5 tiếng</Radio>
                            <Radio value="twotime">2 tiếng</Radio>
                        </RadioGroup>
                        <div className="flex gap-4 mb-4">
                            <TimeInput
                                label="Thời gian bắt đầu"
                                value={eveningStartTime as any}
                                onChange={(value) => setEveningStartTime(value as Time | null)}
                                hourCycle={24}
                                granularity="minute"
                                placeholderValue={new Time(13, 0)}
                            />
                            <TimeInput
                                label="Thời gian kết thúc"
                                value={eveningEndTime as any}
                                onChange={(value) => setEveningEndTime(value as Time | null)}
                                hourCycle={24}
                                granularity="minute"
                                placeholderValue={new Time(22, 0)}
                            />
                        </div>

                        {/* Trường giá */}
                        <Input
                            label="Giá (VND)"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Nhập giá"
                            color="primary"
                            className="max-w-xs mb-4"
                            min="0"
                            step="0.1"
                        />

                        <RadioGroup
                            label="Tạo lịch cho"
                            orientation="horizontal"
                            value={duration}
                            onValueChange={(value) => setDuration(value as typeof duration)}
                            color="primary"
                            className="mb-4"
                        >
                            <Radio value="day">Một ngày</Radio>
                            <Radio value="week">Một tuần</Radio>
                            <Radio value="month">Một tháng</Radio>
                            <Radio value="year">Một năm</Radio>
                        </RadioGroup>

                        {/* Xem trước danh sách lịch */}
                        {(morningSchedules.length > 0 || eveningSchedules.length > 0) && (
                            <div className="my-4">
                                <p className="text-lg font-semibold">Xem trước lịch (Giá: {price} VND)</p>
                                {morningSchedules.length > 0 && (
                                    <div className="mt-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <img src={soonImage.src} alt="Morning" className="w-6 h-6" />
                                            <p className="font-medium">Khung sáng:</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {morningSchedules.map((schedule, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-primary-50 rounded-lg text-gray-900"
                                                >
                                                    {schedule.fromHour} - {schedule.toHour}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {eveningSchedules.length > 0 && (
                                    <div className="mt-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <img src={moonImage.src} alt="Evening" className="w-6 h-6" />
                                            <p className="font-medium">Khung tối:</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {eveningSchedules.map((schedule, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-primary-50 rounded-lg text-gray-900"
                                                >
                                                    {schedule.fromHour} - {schedule.toHour}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <button
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                            onClick={handleAddSchedule}
                            disabled={
                                (!morningStartTime || !morningEndTime || morningStartTime >= morningEndTime) &&
                                (!eveningStartTime || !eveningEndTime || eveningStartTime >= eveningEndTime) ||
                                !price || parseFloat(price) <= 0
                            }
                        >
                            Thêm
                        </button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default AddScheduleSmart;