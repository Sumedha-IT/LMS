// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '..'

// Define a service using a base URL and expected endpoints
export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getSubjects: builder.query({
            query: () => `subjects`,
        }),
        getCourses: builder.query({
            query: () => `courses`,
        }),
        getQuestionBanks: builder.query({
            query: () => `questionBanks`,
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetSubjectsQuery, useGetCoursesQuery, useGetQuestionBanksQuery } = adminApi