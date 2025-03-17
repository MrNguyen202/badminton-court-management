import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/sub-court-schedules";

export const subCourtScheduleApi = {
    // Lấy lịch sân theo courtID và startDate (tùy chọn)
    getScheduleByCourtId: async (courtID: number, startDate?: Date) => {
        try {
            // Định dạng startDate thành yyyy-MM-dd nếu có
            const formattedDate = startDate
                ? startDate.toISOString().split("T")[0] // Lấy phần yyyy-MM-dd
                : undefined;

            // Nếu có startDate thì thêm vào query string, không thì chỉ dùng courtID
            const url = formattedDate
                ? `${API_BASE_URL}/by-sub-court/${courtID}?startDate=${formattedDate}`
                : `${API_BASE_URL}/by-sub-court/${courtID}`;

            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching court schedules:", error);
            throw error; // Ném lỗi để xử lý ở nơi gọi API
        }
    },
    
    // Create new sub court schedule
    createSubCourtSchedule: async (subCourtScheduleData: any) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/create`, subCourtScheduleData);
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.error("Error creating sub court schedule:", error);
            throw error;
        }
    },

    //Delete sub court schedule
    deleteSubCourtSchedule: async (scheduleId: number, subCourtId: number) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/delete/${scheduleId}/${subCourtId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting sub court schedule:", error);
            throw error;
        }
    },

    //Update status sub court schedule
    updateStatusSubCourtSchedule: async (subCourtScheduleID: number, subCourtId: number, status: string) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/update-status/${subCourtScheduleID}/${subCourtId}`, {status});
            return response.data;
        } catch (error) {
            console.error("Error updating status sub court schedule:", error);
            throw error;
        }
    },
};