// import axios from "axios";

// const API_BASE_URL = "http://localhost:8080/api/courts";

// const API_GATEWAY = `${process.env.NEXT_PUBLIC_API_GATEWAY}courts`;

// export const courtApi = {
//   // Lấy tất cả sân
//   getAllCourt: async () => {
//     const response = await axios.get(`${API_BASE_URL}/get-courts`);
//     return response.data;
//   },

//   // Lấy sân theo userID
//   getCourtByUserID: async (userID: number) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/get-courts-user/${userID}`
//       );
//       return response.data;
//     } catch (error: any) {
//       throw new Error(
//         error.response?.data?.error ||
//           "Lấy thông tin sân thất bại, vui lòng thử lại!"
//       );
//     }
//   },

//   // Lấy sân không phải của userID và OPEN
//   getNotCourtByUserID: async (userID: number) => {
//     const response = await axios.get(
//       `${API_BASE_URL}/get-not-courts-user/${userID}`
//     );
//     return response.data;
//   },

//   // Tạo sân mới
//   createCourt: async (formData: FormData) => {
//     return axios.post(`${API_BASE_URL}/create-court`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//   },

//   // Delete sân
//   deleteCourt: async (courtID: number) => {
//     const response = await axios.put(`${API_BASE_URL}/delete-court/${courtID}`);
//     return response.data;
//   },

//   //Lấy sân theo id
//   getCourtById: async (courtID: number) => {
//     const response = await axios.get(`${API_BASE_URL}/get-court/${courtID}`);
//     return response.data;
//   },
//   // Lấy số lượng sân
//   getNumberOfCourts: async (courtID: number) => {
//     const response = await axios.get(
//       `${API_BASE_URL}/get-number-of-courts/${courtID}`
//     );
//     return response.data;
//   },
// };



import axios from "axios";

// Định nghĩa base URL cho API Gateway
const API_GATEWAY = `${process.env.NEXT_PUBLIC_API_GATEWAY}courts`;

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

// Định nghĩa các API liên quan đến court
export const courtApi = {
  // Lấy tất cả sân
  getAllCourt: async () => {
    try {
      const response = await apiClient.get("/get-courts");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Lấy danh sách sân thất bại!"
      );
    }
  },

  // Lấy sân theo userID
  getCourtByUserID: async (userID: number) => {
    try {
      const response = await apiClient.get(`/get-courts-user/${userID}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
          "Lấy thông tin sân thất bại, vui lòng thử lại!"
      );
    }
  },

  // Lấy sân không phải của userID và OPEN
  getNotCourtByUserID: async (userID: number) => {
    try {
      const response = await apiClient.get(`/get-not-courts-user/${userID}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
          "Lấy danh sách sân không thuộc user thất bại!"
      );
    }
  },

  // Tạo sân mới
  createCourt: async (formData: FormData) => {
    try {
      const response = await apiClient.post("/create-court", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Tạo sân mới thất bại!"
      );
    }
  },

  // Xóa sân
  deleteCourt: async (courtID: number) => {
    try {
      const response = await apiClient.put(`/delete-court/${courtID}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Xóa sân thất bại!"
      );
    }
  },

  // Lấy sân theo id
  getCourtById: async (courtID: number) => {
    try {
      const response = await apiClient.get(`/get-court/${courtID}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Lấy thông tin sân thất bại!"
      );
    }
  },

  // Lấy số lượng sân
  getNumberOfCourts: async (courtID: number) => {
    try {
      const response = await apiClient.get(`/get-number-of-courts/${courtID}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Lấy số lượng sân thất bại!"
      );
    }
  },
};