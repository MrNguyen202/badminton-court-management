"use client";

import { useState, useEffect } from "react";
import { subCourtScheduleApi } from "@/app/api/court-services/subCourtSchedule";
import { getNextSevenDay } from "../_helps/OwnWeekTime";
import AddScheduleSmart from "../_components/AddScheduleSmart";
import { subCourtApi } from "@/app/api/court-services/subCourtAPI"; 
import EditImage from "@/public/pencil-edit-02-stroke-rounded.svg";
import DeleteImage from "@/public/delete-02-stroke-rounded.svg";
import AddScheduleSingle from "../_components/AddScheduleSingle";
import { useDisclosure } from "@nextui-org/react";
import BookModal from "./BookModal";
import { toast } from "react-toastify";

// Types to match API data
type SubCourtSchedule = {
  subCourtId: number;
  scheduleId: number;
  subCourtName: string;
  date: string;
  fromHour: string;
  toHour: string;
  price: number;
  status: string;
};

type SubCourt = {
  id: number;
  subName: string;
  type: string;
};

function Schedule({ courtID }: { courtID: number }) {
  const [schedule, setSchedule] = useState<
    Record<number, Record<string, SubCourtSchedule[]>>
  >({});
  const [timeFrame, setTimeFrame] = useState(
    new Date() > new Date(new Date().setHours(12, 0, 0, 0))
      ? "afternoon"
      : "morning"
  );

  const [selectedSubCourt, setSelectedSubCourt] = useState<SubCourt | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [date, setDate] = useState(new Date());
  const [subCourts, setSubCourts] = useState<SubCourt[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [bookedSchedule, setBookedSchedule] = useState<SubCourtSchedule | null>(
    null
  );

  // Calculate next seven days from current date
  const nextSevenDay = getNextSevenDay(date);
  const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const handleScheduleAdded = (newDate: Date) => {
    setDate(newDate);
    setReloadTrigger((prev) => prev + 1);
  };

  const handlePrevWeek = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 7);
    setDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 7);
    setDate(newDate);
  };

  // Fetch subCourt list
  useEffect(() => {
    const fetchSubCourt = async () => {
      try {
        const response = await subCourtApi.getAllSubCourt(courtID);
        setSubCourts(response);
        if (response.length > 0) {
          setSelectedSubCourt(response[0]);
        }
      } catch (error) {
        console.error("Error fetching sub-courts:", error);
        setSubCourts([]);
        alert("An error occurred while fetching sub-courts.");
      }
    };
    fetchSubCourt();
  }, [courtID]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.role === "ADMIN") {
          setIsAdmin(true);
        }
      } catch (e) {
        console.error("Lỗi parse từ localstorage:", e);
      }
    }
  }, []);

  // Fetch schedule data from API
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        if (!selectedSubCourt) return;

        // Format date to ensure consistency
        const formattedDate = new Date(date);
        formattedDate.setHours(12, 0, 0, 0);

        const response = await subCourtScheduleApi.getScheduleByCourtId(
          selectedSubCourt?.id,
          formattedDate
        );

        // Convert string keys to number keys
        const formattedSchedule = Object.keys(response).reduce(
          (acc, subCourtId) => {
            acc[Number(subCourtId)] = response[subCourtId];
            return acc;
          },
          {} as Record<number, Record<string, SubCourtSchedule[]>>
        );

        setSchedule(formattedSchedule);
      } catch (error) {
        console.error("Error fetching schedule:", error);
        setSchedule({});
        alert("An error occurred while fetching schedule data.");
      }
    };
    fetchSchedule();
  }, [courtID, date, reloadTrigger, selectedSubCourt]);

  // Generate array of seven days starting from the current date
  const getSevenDays = (startDate: Date) => {
    const days = [];
    const start = new Date(startDate);
    start.setHours(12, 0, 0, 0); // Normalize time part

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const sevenDays = getSevenDays(date);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-primary-50";
      case "BOOKED":
        return "bg-red-500";
      case "EXPIRED":
        return "bg-yellow-600";
      case "MAINTENANCE":
        return "bg-slate-500";
      default:
        return "bg-gray-200";
    }
  };

  // Delete schedule
  const handleDeleteSchedule = async (
    scheduleId: number,
    subCourtId: number
  ) => {
    try {
      //Viết xử lý xóa lịch ở đây
      await subCourtScheduleApi.deleteSubCourtSchedule(scheduleId, subCourtId);
      toast.success("Xóa lịch thành công");
      setReloadTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error deleting schedule:", error);
      alert("An error occurred while deleting the schedule.");
    }
  };

  // Format date to ISO string for API lookup
  const formatDateToISOString = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  // Handle booking modal open
  const handleOpenBookingModal = (schedule: SubCourtSchedule) => {
    setBookedSchedule(schedule);
    onOpen();
  };

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-between mt-6">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">Lịch đặt sân</h1>
          <div className="flex space-x-4 ml-4">
            {subCourts.map((subCourt) => (
              <button
                key={subCourt.id}
                onClick={() => setSelectedSubCourt(subCourt)}
                className={`px-4 py-2 border rounded-lg shadow-md transition-all duration-200 ${selectedSubCourt?.id === subCourt.id
                  ? "bg-slate-900 text-white border-primary-500"
                  : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100"
                  }`}
              >
                <span className="text-lg font-semibold">
                  {subCourt.subName} -{" "}
                  {subCourt.type === "DOUBLE" ? "Đôi" : "Đơn"}
                </span>
              </button>
            ))}
            {subCourts.length === 0 && (
              <span className="text-lg text-gray-500 py-3">
                Không có dữ liệu sân phụ
              </span>
            )}
          </div>
        </div>
        {isAdmin && (
          <AddScheduleSmart
            courtID={courtID}
            onScheduleAdded={handleScheduleAdded}
          />
        )}
      </div>

      <div className="w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-lg h-14 w-1/3 my-4">
            <button
              className="text-xl font-bold text-white bg-slate-700 hover:bg-slate-900 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200"
              onClick={handlePrevWeek}
            >
              {"<"}
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Từ ngày</span>
              <span className="text-lg font-semibold text-gray-900">
                {date.toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
              <span className="text-sm font-medium text-gray-700">
                đến ngày
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {new Date(
                  date.getTime() + 6 * 24 * 60 * 60 * 1000
                ).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
            <button
              className="text-xl font-bold text-white bg-slate-700 hover:bg-slate-900 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200"
              onClick={handleNextWeek}
            >
              {">"}
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
              onClick={() => setTimeFrame("morning")}
              className={`px-4 py-3 text-xl text-gray-400 border border-slate-900 rounded-md mr-2 hover:text-slate-900 ${timeFrame === "morning" ? "bg-primary-500 text-white" : ""
                }`}
            >
              Khung sáng
            </button>
            <button
              onClick={() => setTimeFrame("afternoon")}
              className={`px-4 py-3 text-xl text-gray-400 border border-slate-900 rounded-md mr-2 hover:text-slate-900 ${timeFrame === "afternoon" ? "bg-primary-500 text-white" : ""
                }`}
            >
              Khung chiều
            </button>
          </div>
        </div>
      </div>

      <div className="w-full mt-2 bg-white rounded-lg shadow-lg py-3">
        {sevenDays.map((day, index) => {
          // Format date consistently for API lookup
          const keyDate = formatDateToISOString(day);
          const daySchedules =
            selectedSubCourt !== null && schedule[selectedSubCourt?.id]
              ? schedule[selectedSubCourt?.id][keyDate] || []
              : [];

          const filteredSchedules =
            timeFrame === "morning"
              ? daySchedules.filter((item) => item.fromHour < "12:00:00")
              : daySchedules.filter((item) => item.fromHour >= "12:00:00");

          return (
            <div
              key={index}
              className="flex items-center justify-between w-full py-3"
            >
              <div className="rounded-lg ml-2 w-1/12 justify-evenly items-center flex">
                <div
                  className={`text-center py-3 w-1/2 rounded-lg border border-primary-500 ${day.toDateString() === new Date().toDateString()
                    ? "bg-primary-500"
                    : ""
                    }`}
                >
                  <span
                    className={`text-lg font-bold ${day.toDateString() === new Date().toDateString()
                      ? "text-white"
                      : "text-black"
                      }`}
                  >
                    {daysOfWeek[day.getDay()]}
                  </span>
                  <span
                    className={`block text-sm font-medium ${day.toDateString() === new Date().toDateString()
                      ? "text-white"
                      : "text-black"
                      }`}
                  >
                    {day.getDate()}/{day.getMonth() + 1}
                  </span>
                </div>
                {isAdmin && (
                  <button className="p-1">
                    <img src={EditImage.src} alt="" />
                  </button>
                )}
              </div>
              <div className="flex w-11/12 space-x-5 pl-2 items-center">
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((item, idx) => (
                    <button
                      key={idx}
                      className={`relative flex-col items-center justify-evenly p-2 px-3 border-b rounded-lg hover:bg-opacity-75 ${getStatusColor(
                        item.status
                      )}`}
                      disabled={item.status !== "AVAILABLE"}
                      onClick={() => handleOpenBookingModal(item)}
                    >
                      <span className="text-lg font-bold text-gray-900">
                        {item.fromHour.slice(0, 5)} - {item.toHour.slice(0, 5)}
                      </span>
                      <span className="block text-lg text-gray-500 text-center">
                        {item.price / 1000}k/h
                      </span>
                      {isAdmin && (
                        <div
                          className="absolute -top-2 -right-2 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation(); // Ngăn sự kiện lan truyền lên button cha
                            handleDeleteSchedule(
                              item.scheduleId,
                              item.subCourtId
                            );
                          }}
                        >
                          <img src={DeleteImage.src} />
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="text-lg font-semibold text-gray-500">
                    Không có lịch
                  </div>
                )}
                {isAdmin && (
                  <AddScheduleSingle
                    subcourt={selectedSubCourt}
                    date={day}
                    filteredSchedules={filteredSchedules}
                    onScheduleAdded={handleScheduleAdded}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <BookModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        courtId={courtID}
        subCourtSelected={selectedSubCourt?.id}
        bookedSchedule={bookedSchedule}
      />
    </div>
  );
}

export default Schedule;
