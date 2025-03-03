import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/court-schedules";

export const scheduleApi = {
    // Lấy lịch sân theo courtID và startDate (tùy chọn)
    getScheduleByCourtId: async (courtID: number, startDate?: Date) => {
        try {
            // Định dạng startDate thành yyyy-MM-dd nếu có
            const formattedDate = startDate
                ? startDate.toISOString().split("T")[0] // Lấy phần yyyy-MM-dd
                : undefined;

            // Nếu có startDate thì thêm vào query string, không thì chỉ dùng courtID
            const url = formattedDate
                ? `${API_BASE_URL}/get-schedules/${courtID}?startDate=${formattedDate}`
                : `${API_BASE_URL}/get-schedules/${courtID}`;

            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching court schedules:", error);
            throw error; // Ném lỗi để xử lý ở nơi gọi API
        }
    },

    // Tạo lịch sân mới
    createSchedule: async (scheduleData: any) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/create-schedule`, scheduleData);
            return response.data;
        } catch (error) {
            console.error("Error creating court schedule:", error);
            throw error;
        }
    },
};