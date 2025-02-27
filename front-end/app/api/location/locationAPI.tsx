import axios from "axios";

const API_BASE_URL = "https://provinces.open-api.vn/api";

export const locationApi = {
    //Lấy tỉnh/thành phố
    getAllProvince: async () => {
        const response = await axios.get(`${API_BASE_URL}/?depth=1`);
        console.log("TP", response.data);
        return response.data;
    },

    //Lấy quận/huyện theo mã tỉnh/thành phố
    getDistrictByProvinceCode: async (provinceCode: number) => {
        const response = await axios.get(`${API_BASE_URL}/p/${provinceCode}?depth=2`);
        return response.data;
    },

    //Lấy phường/xã theo mã quận/huyện
    getWardByDistrictCode: async (districtCode: number) => {
        const response = await axios.get(`${API_BASE_URL}/d/${districtCode}?depth=2`);
        return response.data;
    },

    //Lấy thông tin chi tiết theo mã
    getDetail: async (id: number) => {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    },
};