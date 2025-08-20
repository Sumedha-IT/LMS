import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const baseQuery = fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
        // Try to get token from user_info cookie first
        const userInfo = Cookies.get('user_info');
        let token = null;
        
        if (userInfo) {
            try {
                const userData = JSON.parse(decodeURIComponent(userInfo));
                token = userData?.token;
            } catch (error) {
                console.error('Error parsing user_info cookie:', error);
            }
        }
        
        // Fallback to bearer_token cookie
        if (!token) {
            token = Cookies.get('bearer_token');
        }
        
        if (token) {
            headers.set('Authorization', token);
        } else {
            console.warn('No authentication token found');
        }
        
        headers.set('Accept', 'application/json');
        headers.set('Content-Type', 'application/json');
        return headers;
    },
    credentials: 'include',
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        try {
            // Try to refresh the token
            const refreshResponse = await fetch(`${apiUrl}/refresh-token`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            
            if (refreshResponse.ok) {
                // Retry the original request
                result = await baseQuery(args, api, extraOptions);
            } else {
                // If refresh fails, redirect to login
                window.location.href = '/login';
            }
        } catch (error) {
            console.error("Error refreshing access token:", error);
            window.location.href = '/login';
        }
    }

    return result;
};