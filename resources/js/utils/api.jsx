// utils/api.js
import Cookies from "js-cookie";
import { getFromCache, saveToCache, clearCache } from "./apiCache";
import requestManager from "./requestManager";

// Cache durations for different endpoints (in milliseconds)
const CACHE_DURATIONS = {
  "/profile": 10 * 60 * 1000, // 10 minutes - increased for dashboard
  "/attendances": 5 * 60 * 1000, // 5 minutes
  "/student/journey": 15 * 60 * 1000, // 15 minutes - increased for dashboard
  "/announcements": 5 * 60 * 1000, // 5 minutes
  "/getUserAssignments": 10 * 60 * 1000, // 10 minutes - increased for dashboard
  "/exam-chart": 15 * 60 * 1000, // 15 minutes - increased for dashboard
  "/leaderboard": 5 * 60 * 1000, // 5 minutes
  "/student-attendance/status": 30 * 1000, // 30 seconds - increased slightly
  "/student-attendance/report": 5 * 60 * 1000, // 5 minutes - increased for dashboard
  // Add more endpoints as needed
};

// Priority endpoints that should be loaded first
const PRIORITY_ENDPOINTS = [
  "/student-attendance/status"
];

// Retry configuration
const MAX_RETRIES = 2;
const RETRY_DELAY = 2000; // 2 seconds

// Function to decode and parse the cookie
export const getDecodedCookie = (cookieName) => {
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

// Check for both VITE_APP_API_URL and REACT_APP_API_URL environment variables
const baseUrl = import.meta.env.VITE_APP_API_URL;
console.log('API Base URL:', baseUrl);

// Retry function for failed requests
const retryRequest = async (requestFn, maxRetries = MAX_RETRIES) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      // Don't retry on 429 errors (rate limiting)
      if (error.message === "Too Many Attempts." || error.response?.status === 429) {
        throw error;
      }
      
      // Don't retry on authentication errors
      if (error.message === "No authentication token found") {
        throw error;
      }
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      console.warn(`Request failed, retrying in ${RETRY_DELAY}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
};

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

  // Use the global request manager for deduplication and caching
  return requestManager.executeRequest(endpoint, options, async () => {
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

      // Wrap the fetch request with retry logic
      const response = await retryRequest(async () => {
        return await fetch(url, fetchOptions);
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: response.statusText };
        }
        
        // Handle 429 Too Many Requests specifically
        if (response.status === 429) {
          console.warn(`Rate limited for ${endpoint}, returning cached data if available`);
          
          // Try to return cached data for 429 errors
          if (method === 'GET') {
            const cachedData = getFromCache(endpoint);
            if (cachedData) {
              console.log(`Returning cached data due to rate limit for: ${endpoint}`);
              return cachedData;
            }
          }
          
          throw new Error("Too Many Attempts.");
        }
        
        const error = new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        error.response = { data: errorData };
        throw error;
      }

      const data = await response.json();

      // Cache GET responses using the old cache system for backward compatibility
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
      
      // For network errors or 429 errors, try to return cached data
      if (method === 'GET' && (error.message === "Too Many Attempts." || error.name === 'TypeError')) {
        const cachedData = getFromCache(endpoint);
        if (cachedData) {
          console.log(`Returning cached data due to error for: ${endpoint}`);
          return cachedData;
        }
      }
      
      throw error;
    }
  });
};

// Export utility functions for global cache management
export const clearAllCache = () => {
  clearCache();
  requestManager.clearCache();
};

export const cancelAllRequests = () => {
  requestManager.cancelPendingRequests();
};

export const getCacheStats = () => {
  return requestManager.getCacheStats();
};