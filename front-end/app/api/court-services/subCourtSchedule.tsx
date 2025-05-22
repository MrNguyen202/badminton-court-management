import axios from "axios";

// Định nghĩa base URL cho API Gateway
const API_GATEWAY = `${process.env.NEXT_PUBLIC_API_GATEWAY}sub-court-schedules`;

// Tạo instance của axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_GATEWAY,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor để thêm token vào header Authorization
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để xử lý lỗi toàn cục (ví dụ: token hết hạn)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

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
        ? `/by-sub-court/${courtID}?startDate=${formattedDate}`
        : `/by-sub-court/${courtID}`;

      const response = await apiClient.get(url);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching court schedules:", error.message);
      throw new Error(error.response?.data?.error || "Lấy lịch sân thất bại!");
    }
  },

  // Create new sub court schedule
  createSubCourtSchedule: async (subCourtScheduleData: any) => {
    try {
      const response = await apiClient.post(`/create`, subCourtScheduleData);
      console.log("response", response);
      return response.data;
    } catch (error: any) {
      console.error("Error creating sub court schedule:", error.message);
      throw new Error(
        error.response?.data?.error || "Tạo lịch sân phụ thất bại!"
      );
    }
  },

  // Delete sub court schedule
  deleteSubCourtSchedule: async (scheduleId: number, subCourtId: number) => {
    try {
      const response = await apiClient.delete(
        `/delete/${scheduleId}/${subCourtId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error deleting sub court schedule:", error.message);
      throw new Error(
        error.response?.data?.error || "Xóa lịch sân phụ thất bại!"
      );
    }
  },

  // Update status sub court schedule
  updateStatusSubCourtSchedule: async (
    scheduleID: number,
    subCourtId: number,
    status: string
  ) => {
    try {
      const response = await apiClient.put(
        `/update-status/${scheduleID}/${subCourtId}`,
        { status }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating status sub court schedule:", error.message);
      throw new Error(
        error.response?.data?.error ||
          "Cập nhật trạng thái lịch sân phụ thất bại!"
      );
    }
  },

  // 
  createSubCourtSchedulesBulk: async (payload: { schedules: any[] }) => {
    try {
      const response = await apiClient.post(`/bulk-create`, payload);
      return response.data;
    } catch (error: any) {
      console.error("Error creating bulk sub court schedules:", error.message);
      throw new Error(
        error.response?.data?.error || "Tạo hàng loạt lịch sân phụ thất bại!"
      );
    }
  },
};
