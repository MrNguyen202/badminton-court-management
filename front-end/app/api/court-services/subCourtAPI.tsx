import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/sub-courts";

export const subCourtApi = {
    // Lấy tất cả sân phụ của sân chính
    getAllSubCourt: async (courtID : number) => {
        const response = await axios.get(`${API_BASE_URL}/get-sub-courts/${courtID}`);
        return response.data;
    },
};