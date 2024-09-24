import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Make sure to set this in your .env file
    timeout: 10000, // Set a timeout of 10 seconds
});
const getCommonHeaders = (isFormData = false) => {
    // const authToken = localStorage.getItem('token');
    const authToken = "350|CJjJQ4Dpytdkkm6Bn5qtigAEiIFsFsNe2MAJLGYxb5936e16";
    return {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
    };
};

// POST Request
export const axiosPost = async (endpoint, payload) => {
    const isFormData = payload instanceof FormData;
    const config = {
        headers: getCommonHeaders(isFormData)
    };
    return await api.post(endpoint, payload, config);
};

// PUT Request
export const axiosPut = async (endpoint, payload) => {
    const isFormData = payload instanceof FormData;
    const config = {
        headers: getCommonHeaders(isFormData)
    };
    return await api.put(endpoint, payload, config);
};

// GET Request
export const axiosGet = async (endpoint) => {
    const config = {
        headers: getCommonHeaders()
    };
    return await api.get(endpoint, config);
};

// DELETE Request
export const axiosDelete = async (endpoint) => {
    const config = {
        headers: getCommonHeaders()
    };
    return await api.delete(endpoint, config);
};
