import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

<<<<<<< Updated upstream
const baseQuery = fetchBaseQuery({
    baseUrl: `${ import.meta.env.REACT_APP_API_URL}`,
=======
const apiUrl = APP_URL

const baseQuery = fetchBaseQuery({
    baseUrl: `${APP_URL}`,
>>>>>>> Stashed changes
    prepareHeaders: (headers) => {
        // const data = JSON.parse(String(localStorage.getItem("token")));
        const data = "350|CJjJQ4Dpytdkkm6Bn5qtigAEiIFsFsNe2MAJLGYxb5936e16";
        if (data) {
            headers.set("authorization", `Bearer ${data}`);
<<<<<<< Updated upstream
            // if (process.env.REACT_APP_API_URL)
=======
            // if (APP_URL)
>>>>>>> Stashed changes
            //     headers.set("x_api_key", process.env.NEXT_PUBLIC_X_API_KEY);
        }
        return headers;
    },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        try {
<<<<<<< Updated upstream
            const response = await fetch(`${process.env.REACT_APP_API_URL}`);
=======
            const response = await fetch(`${APP_URL}`);
>>>>>>> Stashed changes

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
