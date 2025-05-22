import axios from "axios";

// Định nghĩa base URL cho API Gateway
const API_GATEWAY = `${process.env.NEXT_PUBLIC_API_GATEWAY}feedbacks`;

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


// Định nghĩa các hàm API
export const feedbackAPI = {
    // Lấy danh sách phản hồi
    getFeedbacks: async (courtID: number) => {
        try {
            const response = await apiClient.get(`/get-feedbacks-by-court-id/${courtID}`);
            console.log("Response data:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
            throw error;
        }
    },

    // Tạo phản hồi mới
    createFeedback: async (feedbackData: any) => {
        try {
            const response = await apiClient.post("/add-feedback", feedbackData);
            return response.data;
        } catch (error) {
            console.error("Error creating feedback:", error);
            throw error;
        }
    },

    // Rating of a court
    getRating: async (courtID: number) => {
        try {
            const response = await apiClient.get(`/get-average-star-by-court-id/${courtID}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching rating:", error);
            throw error;
        }
    },

    // Delete feedback
    deleteFeedback: async (feedbackId: number) => {
        try {
            const response = await apiClient.delete(`/delete-feedback/${feedbackId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting feedback:", error);
            throw error;
        }
    },
};