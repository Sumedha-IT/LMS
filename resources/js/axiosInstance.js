import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:8000/api',
    withCredentials: true,  // Required for authentication (cookies, sessions)
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

export default axiosInstance;
