import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",  // Match your Laravel API base URL
    withCredentials: true,  // Required for authentication (cookies, sessions)
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

export default axiosInstance;
