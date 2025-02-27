import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/courts";

export const courtApi = {
    // Lấy tất cả sân
    getAllCourt: async () => {
        const response = await axios.get(`${API_BASE_URL}/all`);
        console.log(response.data);
        return response.data;
    },

    // Lấy sân theo userID
    getCourtByUserID: async (userID: number) => {
        const response = await axios.get(`${API_BASE_URL}/owner/${userID}`);
        return response.data;
    },

    // Tạo sân mới
    createCourt: async (courtData: any) => {
        const response = await axios.post(`${API_BASE_URL}/createCourt`, courtData);
        return response.data;
    },

  // Delete sân
  deleteCourt: async (courtID: number) => {
        const response = await axios.delete(`${API_BASE_URL}/deleteCourt/${courtID}`);
        return response.data;
    }
};