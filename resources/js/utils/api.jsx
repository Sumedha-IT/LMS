// utils/api.js
import Cookies from "js-cookie";
import { getFromCache, saveToCache } from "./apiCache";

// Cache durations for different endpoints (in milliseconds)
const CACHE_DURATIONS = {
  "/profile": 5 * 60 * 1000, // 5 minutes
  "/attendances": 5 * 60 * 1000, // 5 minutes
  "/student/journey": 10 * 60 * 1000, // 10 minutes
  "/announcements": 5 * 60 * 1000, // 5 minutes
  "/getUserAssignments": 5 * 60 * 1000, // 5 minutes
  "/exam-chart": 10 * 60 * 1000, // 10 minutes
  "/leaderboard": 5 * 60 * 1000, // 5 minutes
  // Add more endpoints as needed
};

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

const baseUrl = import.meta.env.REACT_APP_API_URL || 'http://localhost:8000/api'; // Ensure this is set in your .env file

export const apiRequest = async (endpoint, options = {}) => {
  const { method = 'GET', body = null, skipCache = false } = options;

  // For GET requests, check cache first (unless skipCache is true)
  if (method === 'GET' && !skipCache) {
    const cacheKey = endpoint;
    const cachedData = getFromCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }
  }

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

    const fetchOptions = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Cache GET responses
    if (method === 'GET') {
      const cacheDuration = CACHE_DURATIONS[endpoint] || 5 * 60 * 1000; // Default to 5 minutes
      saveToCache(endpoint, data, cacheDuration);
    }

    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};