import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie';

const apiUrl = import.meta.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const baseQuery = fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
        const token = Cookies.get('bearer_token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
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