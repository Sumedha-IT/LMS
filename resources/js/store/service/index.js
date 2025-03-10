import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.REACT_APP_API_URL || 'http://localhost:8000';

const baseQuery = fetchBaseQuery({
    baseUrl: `${apiUrl}`, // Use the defined apiUrl variable
    prepareHeaders: (headers) => {
        // Uncomment and adjust if you need token-based auth
        // const data = JSON.parse(String(localStorage.getItem("token")));
        // const data = "31|uyUHQUw8TGBcj0xlU2jmsgMJvWEoQ9Iuk3lxMCwb5f1437ba";
        // if (data) {
        //     headers.set("authorization", `Bearer ${data}`);
        // }
        return headers;
    },
    credentials: 'include', 
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        try {
            const response = await fetch(`${apiUrl}`); // Use apiUrl here too
            // Clear localStorage and refresh the page if needed
            // localStorage.clear();
            // window.location.reload();
            result = await baseQuery(args, api, extraOptions);
        } catch (error) {
            console.error("Error refreshing access token:", error);
        }
    }

    return result;
};