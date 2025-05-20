import axios from "axios";

const API_GATEWAY = `${process.env.NEXT_PUBLIC_API_GATEWAY}auth`;

const apiClient = axios.create({
  baseURL: API_GATEWAY,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

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

export const userApi = {
  // API đăng ký
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }) => {
    try {
      console.log("userData", userData);
      const response = await apiClient.post("/register", userData);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Đăng ký thất bại, vui lòng thử lại!"
      );
    }
  },
  // API đăng nhập
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/login", { email, password });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Đăng nhập thất bại, vui lòng thử lại!"
      );
    }
  },

  // API lấy thông tin user sau khi đăng nhập
  getMe: async () => {
    try {
      const response = await apiClient.get("/me");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
          "Lấy thông tin user thất bại, vui lòng thử lại!"
      );
    }
  },

  // API lấy thông tin user theo id
  getUserInfo: async (userId: string) => {
    try {
      const response = await apiClient.get(`/auth/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
          "Lấy thông tin user thất bại, vui lòng thử lại!"
      );
    }
  },

  // API cập nhật thông tin user
  updateProfile: async (userData: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: string;
  }) => {
    try {
      const response = await apiClient.post("/update-user", userData);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
          "Cập nhật thông tin thất bại, vui lòng thử lại!"
      );
    }
  },

  // API cập nhật thông tin user
  updateRole: async (userData: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: string;
  }) => {
    try {
      const response = await apiClient.post("/update-role", userData);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
          "Cập nhật role thất bại, vui lòng thử lại!"
      );
    }
  },

  // API cập nhật mật khẩu
  updatePassword: async (data: {
    email: string;
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      const response = await apiClient.post("/update-password", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
          "Cập nhật mật khẩu thất bại, vui lòng thử lại!"
      );
    }
  },

  // API quên mật khẩu
  forgotPassword: async (data: {
    email: string;
    phone: string;
    newPassword: string;
  }) => {
    try {
      const response = await apiClient.post("/forgot-password", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Thất bại , vui lòng thử lại!"
      );
    }
  },
};
