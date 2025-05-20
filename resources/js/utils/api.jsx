// utils/api.js
import Cookies from "js-cookie";
import { getFromCache, saveToCache, clearCache } from "./apiCache";

// Cache durations for different endpoints (in milliseconds)
const CACHE_DURATIONS = {
  "/profile": 5 * 60 * 1000, // 5 minutes
  "/attendances": 5 * 60 * 1000, // 5 minutes
  "/student/journey": 10 * 60 * 1000, // 10 minutes
  "/announcements": 5 * 60 * 1000, // 5 minutes
  "/getUserAssignments": 5 * 60 * 1000, // 5 minutes
  "/exam-chart": 10 * 60 * 1000, // 10 minutes
  "/leaderboard": 5 * 60 * 1000, // 5 minutes
  "/student-attendance/status": 15 * 1000, // 15 seconds - very short cache for attendance status
  "/student-attendance/report": 60 * 1000, // 1 minute - short cache for attendance report
  // Add more endpoints as needed
};

// Priority endpoints that should be loaded first
const PRIORITY_ENDPOINTS = [
  "/student-attendance/status"
];

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

// Check for both VITE_API_URL and REACT_APP_API_URL environment variables
const baseUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:8000/api';
console.log('API Base URL:', baseUrl);

export const apiRequest = async (endpoint, options = {}) => {
  const { method = 'GET', body = null, skipCache = false, signal = null } = options;

  // Check if this is a priority endpoint
  const isPriority = PRIORITY_ENDPOINTS.includes(endpoint);

  // Only log if not a priority endpoint to reduce console noise
  if (!isPriority) {
    console.log(`API Request: ${method} ${endpoint}`);
  }

  // Clear cache if skipCache is true
  if (skipCache) {
    if (!isPriority) {
      console.log(`Clearing cache for endpoint: ${endpoint}`);
    }
    clearCache(endpoint);
  }

  // For GET requests, check cache first (unless skipCache is true)
  if (method === 'GET' && !skipCache) {
    const cacheKey = endpoint;
    const cachedData = getFromCache(cacheKey);

    if (cachedData) {
      if (!isPriority) {
        console.log(`Returning cached data for: ${endpoint}`);
      }
      return cachedData;
    }
  }

  try {
    // Try to get token from cookie
    const cookieData = getDecodedCookie('user_info');
    let token = cookieData?.token;

    console.log(`Cookie data found: ${!!cookieData}`);

    // If no token in cookie, try to get from localStorage as fallback
    if (!token) {
      console.log("No token found in cookie, checking localStorage...");
      const localStorageData = localStorage.getItem('user_info');
      if (localStorageData) {
        try {
          const parsedData = JSON.parse(localStorageData);
          token = parsedData?.token;
          console.log("Found token in localStorage");
        } catch (e) {
          console.error("Error parsing localStorage data:", e);
        }
      }
    }

    // If still no token, try to get from session
    if (!token) {
      console.log("No token found in localStorage, checking session...");
      // In Laravel, the CSRF token is often available in the meta tags
      const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (metaToken) {
        token = metaToken;
        console.log("Using CSRF token from meta tag");
      }
    }

    if (!token) {
      console.error("No authentication token found");
      throw new Error("No authentication token found");
    }

    // Handle query parameters for GET requests
    let url = `${baseUrl}${endpoint}`;
    if (method === 'GET' && options.params) {
      const queryParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }
    }

    console.log(`Making request to: ${url}`);

    const headers = {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'Authorization': token,
    };

    const fetchOptions = {
      method,
      headers,
    };

    // Add signal to fetch options if provided
    if (signal) {
      fetchOptions.signal = signal;
    }

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(body);

      // Only log if not a priority endpoint
      if (!isPriority) {
        console.log(`Request body: ${JSON.stringify(body)}`);
      }
    }

    // Only log if not a priority endpoint
    if (!isPriority) {
      console.log(`Fetch options: ${JSON.stringify({
        method: fetchOptions.method,
        headers: Object.keys(fetchOptions.headers)
      })}`);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      const error = new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      error.response = { data: errorData };
      throw error;
    }

    const data = await response.json();

    // Cache GET responses
    if (method === 'GET') {
      const cacheDuration = CACHE_DURATIONS[endpoint] || 5 * 60 * 1000; // Default to 5 minutes
      saveToCache(endpoint, data, cacheDuration);
    }

    // Clear related caches after POST operations to attendance endpoints
    if (method === 'POST' && endpoint.includes('student-attendance')) {
      // Clear attendance status and report caches to ensure fresh data on next fetch
      clearCache('/student-attendance/status');
      clearCache('/student-attendance/report');

      // Also clear the current endpoint cache
      clearCache(endpoint);
    }

    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};