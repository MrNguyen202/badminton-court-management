import axios from "axios";

const API_GATEWAY = `${process.env.NEXT_PUBLIC_API_GATEWAY}`;

const apiClient = axios.create({
  baseURL: API_GATEWAY,
  headers: {
    "Content-Type": "application/json",
  },
});

// Conditionally set withCredentials based on whether the user is logged in
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    // Only set withCredentials to true if the user is logged in
    config.withCredentials = !!token && !!user;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors, but only redirect to sign-in if the user is attempting to access a protected route
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const user = localStorage.getItem("user");
    if (error.response?.status === 401 && user) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

export const bookingApi = {
  // API tạo booking
  createBooking: async (bookingData: {
    courtId: number;
    subCourtId: number;
    date: string;
    fromHour: string;
    toHour: string;
    totalCost: number;
    userId?: number;
    userInfo: {
      name: string;
      phone: string;
      email?: string;
    };
    isDeposit: boolean;
  }) => {
    try {
      const response = await apiClient.post("/bookings", bookingData);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Tạo booking thất bại, vui lòng thử lại!"
      );
    }
  },

  // API khởi tạo thanh toán PayPal
  initiatePaypalPayment: async (bookingId: number) => {
    try {
      const response = await apiClient.post(
        `/paypal/pay?bookingId=${bookingId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
          "Khởi tạo thanh toán thất bại, vui lòng thử lại!"
      );
    }
  },

  // API lấy thông tin booking theo ID
  getBooking: async (bookingId: number) => {
    try {
      const response = await apiClient.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
          "Lấy thông tin booking thất bại, vui lòng thử lại!"
      );
    }
  },

  // API lấy danh sách booking của user
  getUserBookings: async (userId: number) => {
    try {
      const response = await apiClient.get(`/bookings/user/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
          "Lấy danh sách booking thất bại, vui lòng thử lại!"
      );
    }
  },

  // API hủy booking
  cancelBooking: async (bookingId: number) => {
    try {
      const response = await apiClient.post(`/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Hủy booking thất bại, vui lòng thử lại!"
      );
    }
  },

  // API xác nhận booking
  confirmBooking: async (bookingId: number) => {
    try {
      const response = await apiClient.post(`/bookings/${bookingId}/confirm`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
          "Xác nhận booking thất bại, vui lòng thử lại!"
      );
    }
  },
};
