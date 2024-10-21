import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = APP_URL

const baseQuery = fetchBaseQuery({
    baseUrl: `${APP_URL}`,
    prepareHeaders: (headers) => {
        // const data = JSON.parse(String(localStorage.getItem("token")));
        const data = "31|uyUHQUw8TGBcj0xlU2jmsgMJvWEoQ9Iuk3lxMCwb5f1437ba";
        if (data) {
            headers.set("authorization", `Bearer ${data}`);
            // if (APP_URL)
            //     headers.set("x_api_key", process.env.NEXT_PUBLIC_X_API_KEY);
        }
        return headers;
    },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        try {
            const response = await fetch(`${APP_URL}`);

            // Clear localStorage and refresh the page
            // localStorage.clear();
            // window.location.reload();
            result = await baseQuery(args, api, extraOptions);

        } catch (error) {
            console.error("Error refreshing access token:", error);
        }
    }

    return result;
};
