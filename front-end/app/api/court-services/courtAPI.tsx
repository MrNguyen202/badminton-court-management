import axios from "axios";

export const getAllCourt = async () => {
    const response = await axios.get("http://localhost:8081/api/courts/all");
    console.log(response.data);
    return response.data;
};