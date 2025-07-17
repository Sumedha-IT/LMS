# API URL Configuration Guide

## Problem

When making API calls from React components, especially in routes with nested paths like `/administrator/:id/my-profile`, the API calls may fail with a 404 error because the URL is constructed incorrectly.

For example, if you're at URL `http://localhost:8000/administrator/1/my-profile` and make an API call to `${API_URL}/api/profile`, the browser might interpret this as a relative URL and try to access:
```
http://localhost:8000/administrator/1/undefined/api/profile
```
instead of the correct:
```
http://localhost:8000/api/profile
```

## Solution

To fix this issue, we need to ensure that all API calls use the correct base URL. Here are the steps to follow:

1. Make sure the environment variables are correctly set in `.env`:
   ```
   VITE_APP_API_URL=http://localhost:8000
   REACT_APP_API_URL=http://localhost:8000/api
   ```

2. In your React components, use the correct environment variable:
   ```javascript
   const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';
   ```

3. When making API calls with axios, always include the `baseURL` parameter to ensure the URL is constructed correctly:
   ```javascript
   axios.get(`${API_URL}/api/profile`, {
     headers: {
       'Accept': 'application/json',
       'Authorization': `Bearer ${userData.token}`,
     },
     withCredentials: true,
     baseURL: API_URL // Ensure the base URL is set correctly
   });
   ```

4. For axios instance configuration, you can also set the baseURL globally:
   ```javascript
   const api = axios.create({
     baseURL: API_URL,
     headers: {
       'Content-Type': 'application/json',
     },
   });
   ```

## Best Practices

1. Always use absolute URLs for API calls, not relative URLs.
2. Set the `baseURL` parameter in axios calls to ensure the URL is constructed correctly.
3. Use environment variables for API URLs to make the code more maintainable.
4. Test API calls in different routes to ensure they work correctly.
5. Consider creating a centralized API service file that handles all API calls with the correct configuration.

## Example Implementation

```javascript
// api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
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

export default api;
```

Then in your components:

```javascript
import api from './api';

// Usage
const fetchProfile = async () => {
  try {
    const response = await api.get('/api/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};
```

This approach ensures that all API calls use the correct base URL and are constructed properly.
