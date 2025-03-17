import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/courts";

export const courtApi = {
    // Lấy tất cả sân
    getAllCourt: async () => {
        const response = await axios.get(`${API_BASE_URL}/get-courts`);
        return response.data;
    },

    // Lấy sân theo userID
    getCourtByUserID: async (userID: number) => {
        const response = await axios.get(`${API_BASE_URL}/get-courts-user/${userID}`);
        return response.data;
    },

    // Lấy sân không phải của userID và OPEN
    getNotCourtByUserID: async (userID: number) => {
        const response = await axios.get(`${API_BASE_URL}/get-not-courts-user/${userID}`);
        return response.data;
    },

    // Tạo sân mới
    createCourt: async (formData: FormData) => {
        return axios.post(`${API_BASE_URL}/create-court`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },

    // Delete sân
    deleteCourt: async (courtID: number) => {
        const response = await axios.put(`${API_BASE_URL}/delete-court/${courtID}`);
        return response.data;
    },

    //Lấy sân theo id
    getCourtById: async (courtID: number) => {
        const response = await axios.get(`${API_BASE_URL}/get-court/${courtID}`);
        return response.data;
    },
    // Lấy số lượng sân
    getNumberOfCourts: async (courtID: number) => {
        const response = await axios.get(`${API_BASE_URL}/get-number-of-courts/${courtID}`);
        return response.data;
    }
};