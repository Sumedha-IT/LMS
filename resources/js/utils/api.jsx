// utils/api.js
import Cookies from "js-cookie";

// Function to decode and parse the cookie
const getDecodedCookie = (cookieName) => {
  try {
    const cookieValue = Cookies.get(cookieName);
    if (!cookieValue) return null;
    const decodedValue = decodeURIComponent(cookieValue);
    return JSON.parse(decodedValue);
  } catch (error) {
    console.error('Error decoding cookie:', error);
    return null;
  }
};

const baseUrl = import.meta.env.VITE_APP_API_URL;

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  try {
    const cookieData = getDecodedCookie('user_info');
    const token = cookieData?.token;

    if (!token) {
      throw new Error("No token found in cookie");
    }

    const url = `${baseUrl}${endpoint}`;
    const headers = {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'Authorization': token,
    };

    const options = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};