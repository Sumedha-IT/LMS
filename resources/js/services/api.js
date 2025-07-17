import axios from 'axios';

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_APP_API_URL;

// Helper function to get cookies
function getCookie(name) {
  let cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    let [key, value] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const userInfo = getCookie("user_info");
    const userData = userInfo ? JSON.parse(userInfo) : null;
    
    if (userData?.token) {
      config.headers.Authorization = `Bearer ${userData.token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Unauthorized - redirect to login or refresh token
        console.error('Unauthorized access. Please log in again.');
      } else if (error.response.status === 403) {
        // Forbidden
        console.error('You do not have permission to access this resource.');
      } else if (error.response.status === 404) {
        // Not found
        console.error('The requested resource was not found.');
      } else if (error.response.status === 500) {
        // Server error
        console.error('An internal server error occurred.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server. Please check your network connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up the request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Profile API
const profileApi = {
  getProfile: () => api.get('/api/profile'),
  updateProfile: (data) => api.post('/api/profile', data),
  getEducation: () => api.get('/api/get/education'),
  getDegrees: () => api.get('/api/get/degrees'),
  getSpecializations: (degreeTypeId) => api.get(`/api/get/specialization/${degreeTypeId}`),
  createEducation: (data) => api.post('/api/education', data),
  updateEducation: (data) => api.put('/api/update/education', data),
  deleteEducation: (id) => api.delete(`/api/delete/education/${id}`),
};

// Projects API
const projectsApi = {
  getProjects: () => api.get('/api/projects'),
  createProject: (data) => api.post('/api/project', data),
  updateProject: (id, data) => api.put(`/api/project/${id}`, data),
  deleteProject: (id) => api.delete(`/api/project/${id}`),
};

// Certifications API
const certificationsApi = {
  getCertifications: () => api.get('/api/certifications'),
  createCertification: (data) => api.post('/api/certification', data),
  updateCertification: (id, data) => api.put(`/api/certification/${id}`, data),
  deleteCertification: (id) => api.delete(`/api/certification/${id}`),
};

export {
  api as default,
  profileApi,
  projectsApi,
  certificationsApi,
  API_URL,
};
