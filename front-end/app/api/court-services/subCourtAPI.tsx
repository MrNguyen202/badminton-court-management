import axios from "axios";

// Định nghĩa base URL cho API Gateway
const API_GATEWAY = `${process.env.NEXT_PUBLIC_API_GATEWAY}sub-courts`;

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

export const subCourtApi = {
  // Lấy tất cả sân phụ của sân chính
  getAllSubCourt: async (courtID: number) => {
    const response = await apiClient.get(`/get-sub-courts/${courtID}`);
    return response.data;
  },
};
