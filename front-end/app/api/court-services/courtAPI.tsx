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
        const response = await axios.get(`${API_BASE_URL}/get-by-user/${userID}`);
        return response.data;
    },

    // Tạo sân mới
    createCourt: async (courtData: any) => {
        const response = await axios.post(`${API_BASE_URL}/create-court`, courtData);
        return response.data;
    },

    // Delete sân
    deleteCourt: async (courtID: number) => {
        const response = await axios.put(`${API_BASE_URL}/delete-court/${courtID}`);
        return response.data;
    }
};