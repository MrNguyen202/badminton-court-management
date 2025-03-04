import React, { useState, useEffect } from "react";
import { scheduleApi } from "../../../api/court-services/scheduleAPI";
import { getNextSevenDay } from "../_helps/OwnWeekTime";
import editImage from "../../../../public/pencil-edit-02-stroke-rounded.svg";
import addImage from "../../../../public/add-circle-stroke-rounded.svg";
import deleteImage from "../../../../public/delete-02-stroke-rounded.svg";
import AddScheduleSmart from "../_components/AddScheduleSmart";

type CourtSchedule = {
    id: number;
    courtID: number;
    date: string;
    toHour: string;
    fromHour: string;
    indexCourt: number;
    price: number;
    status: string;
};

function Schedule({ courtID }: { courtID: number }) {
    const [schedule, setSchedule] = useState<Record<number, Record<string, CourtSchedule[]>>>({});
    const [timeFrame, setTimeFrame] = useState(new Date() > new Date(new Date().setHours(12, 0, 0, 0)) ? 'afternoon' : 'morning');
    const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
    const [reloadTrigger, setReloadTrigger] = useState(0); // Trigger để load lại dữ liệu

    // Callback để reload lịch
    const handleScheduleAdded = () => {
        setReloadTrigger(prev => prev + 1); // Tăng giá trị để trigger useEffect
    };

    // Date
    const [date, setDate] = useState(new Date());
    const nextSevenDay = getNextSevenDay(date);

    const handlePrevWeek = () => {
        setDate(new Date(new Date(date).setDate(date.getDate() - 7)));
    };

    const handleNextDay = () => {
        setDate(new Date(new Date(nextSevenDay).setDate(nextSevenDay.getDate() + 1)));
    };

    // Lấy thứ trong tuần
    const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                if (!courtID) return;
                const response = await scheduleApi.getScheduleByCourtId(courtID, date);
                setSchedule(response);
                // Đặt sân đầu tiên làm mặc định khi có dữ liệu
                const courts = Object.keys(response).map(Number);
                if (courts.length > 0 && selectedCourt === null) {
                    setSelectedCourt(courts[0]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh lịch đặt:", error);
                setSchedule({});
                alert("Có lỗi xảy ra khi lấy danh lịch đặt.");
            }
        };
        fetchSchedule();
    }, [courtID, date, reloadTrigger]);

    // Hàm tạo danh sách 7 ngày từ ngày bắt đầu
    const getSevenDays = (startDate: Date) => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const sevenDays = getSevenDays(date);

    // Lấy danh sách các sân duy nhất
    const courts = Object.keys(schedule).map(Number);

    return (
        <div className="w-full">
            <div className="w-full flex items-center justify-between mt-6">
                <div className="flex items-center">
                    <h1 className="text-3xl font-bold">Lịch đặt sân</h1>
                    {/* Render danh sách sân */}
                    <div className="flex space-x-4 ml-4">
                        {courts.map((courtNumber) => (
                            <button
                                key={courtNumber}
                                onClick={() => setSelectedCourt(courtNumber)}
                                className={`px-4 py-2 border rounded-lg shadow-md transition-all duration-200 ${selectedCourt === courtNumber
                                    ? 'bg-slate-900 text-white border-primary-500'
                                    : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="text-lg font-semibold">Sân {courtNumber}</span>
                            </button>
                        ))}
                        {courts.length === 0 && (
                            <span className="text-lg text-gray-500 py-3">Không có dữ liệu sân</span>
                        )}
                    </div>
                </div>
                {JSON.parse(localStorage.getItem("user") || '{}')?.role === 'ADMIN' && (
                    <AddScheduleSmart courtID={courtID} onScheduleAdded={handleScheduleAdded}/>
                )}
            </div>
            <div className="w-full">
                <div className="flex justify-between items-center">
                    <div className="flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-lg h-14 w-1/3 my-4">
                        <button
                            className="text-xl font-bold text-white bg-slate-700 hover:bg-slate-900 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200"
                            onClick={handlePrevWeek}
                        >
                            {'<'}
                        </button>
                        <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-700">Từ ngày</span>
                            <span className="text-lg font-semibold text-gray-900">
                                {date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </span>
                            <span className="text-sm font-medium text-gray-700">đến ngày</span>
                            <span className="text-lg font-semibold text-gray-900">
                                {nextSevenDay.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </span>
                        </div>
                        <button
                            className="text-xl font-bold text-white bg-slate-700 hover:bg-slate-900 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200"
                            onClick={handleNextDay}
                        >
                            {'>'}
                        </button>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-lg h-14 w-2/5 my-4">
                        <div className="flex items-center space-x-3">
                            <span className="bg-primary-50 w-8 h-8"></span>
                            <span>Trống</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="bg-red-500 w-8 h-8"></span>
                            <span>Đã đặt</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="bg-yellow-600 w-8 h-8"></span>
                            <span>Quá hạn</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="bg-slate-500 w-8 h-8"></span>
                            <span>Tạm ngưng</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => setTimeFrame('morning')}
                            className={`px-4 py-3 text-xl text-gray-400 border border-slate-900 rounded-md mr-2 hover:text-slate-900 ${timeFrame === 'morning' ? 'bg-primary-500 text-white' : null}`}
                        >
                            Khung sáng
                        </button>
                        <button
                            onClick={() => setTimeFrame('afternoon')}
                            className={`px-4 py-3 text-xl text-gray-400 border border-slate-900 rounded-md mr-2 hover:text-slate-900 ${timeFrame === 'afternoon' ? 'bg-primary-500 text-white' : null}`}
                        >
                            Khung chiều
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full mt-2 bg-white rounded-lg shadow-lg py-3">
                {sevenDays.map((day, index) => {
                    const keyDate = day.toISOString().split('T')[0];
                    // Lấy tất cả lịch của các sân cho ngày hiện tại
                    const daySchedules = courts
                        .map(court => schedule[court]?.[keyDate] || [])
                        .flat();
                    const filteredSchedules = timeFrame === 'morning'
                        ? daySchedules.filter(item => item.fromHour < '12:00')
                        : daySchedules.filter(item => item.fromHour >= '12:00');

                    // Lọc theo sân được chọn nếu có
                    const courtFilteredSchedules = selectedCourt !== null
                        ? filteredSchedules.filter(item => item.indexCourt === selectedCourt)
                        : filteredSchedules;

                    return (
                        <div key={index} className="flex items-center justify-between w-full py-3">
                            <div className="rounded-lg ml-2 w-1/12 justify-evenly items-center flex">
                                <div className={`text-center py-3 w-1/2 rounded-lg border-1 border-primary-500 ${day.toDateString() === new Date().toDateString() ? 'bg-primary-500' : null}`}>
                                    <span className={`text-lg font-bold ${day.toDateString() === new Date().toDateString() ? 'text-white' : 'text-black'}`}>
                                        {daysOfWeek[day.getDay()]}
                                    </span>
                                    <span className={`block text-sm font-medium ${day.toDateString() === new Date().toDateString() ? 'text-white' : 'text-black'}`}>
                                        {day.getDate()}/{day.getMonth() + 1}
                                    </span>
                                </div>
                                {JSON.parse(localStorage.getItem("user") || '{}')?.role === 'ADMIN' && (
                                    <button>
                                        <img src={editImage.src} alt="Edit" />
                                    </button>
                                )}
                            </div>
                            <div className="flex w-11/12 space-x-5 pl-2 items-center">
                                {courtFilteredSchedules.length > 0 ? (
                                    courtFilteredSchedules.map((item: CourtSchedule, idx: number) => (
                                        <button
                                            key={idx}
                                            className="relative flex-col items-center justify-evenly p-2 px-3 border-b bg-primary-50 rounded-lg hover:bg-primary-100"
                                        >
                                            <span className="text-lg font-bold text-gray-900">
                                                {item.fromHour.slice(0, 5)} - {item.toHour.slice(0, 5)}
                                            </span>
                                            <span className="block text-lg text-gray-500 text-center">
                                                {item.price}k/h
                                            </span>
                                            {JSON.parse(localStorage.getItem("user") || '{}')?.role === 'ADMIN' && (
                                                <div
                                                    className="absolute -top-2 -right-2 cursor-pointer"
                                                    onClick={() => alert("Xóa lịch")}
                                                >
                                                    <img src={deleteImage.src} alt="Delete" />
                                                </div>
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-lg font-semibold text-gray-500">Không có lịch</div>
                                )}
                                {JSON.parse(localStorage.getItem("user") || '{}')?.role === 'ADMIN' && (
                                    <div className="flex items-center justify-center p-2 px-3 border-b bg-primary-50 rounded-lg hover:bg-primary-100">
                                        <img src={addImage.src} alt="Add" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Schedule;