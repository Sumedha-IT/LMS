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
        getBatches: builder.query({
            query: () => `allBatches`,
        }),
        getExamData: builder.query({
            query: ({ page, rowsPerPage }) => `exams?page=${page}&size=${rowsPerPage}`,
        }),
        getInvigilators: builder.query({
            query: () => 'invigilators',
        }),
        getQuestionBanks: builder.query({
            query: ({ page, rowsPerPage }) => `questionBanks?page=${page}&size=${rowsPerPage}`,
        }),
        getQuestionsAsPerBankId: builder.query({
            query: (id) => `questions?questionBankId=${id}`,
        }),
        AddExamData: builder.mutation({
            query: (payload) => ({
                url: 'exams',
                method: 'POST',
                body: payload
            })
        }),
        GetQuestionId: builder.mutation({
            query: (payload) => ({
                url: 'questionIds',
                method: 'POST',
                body: payload
            })
        }),
        AddQuestionBanks: builder.mutation({
            query: ({ id, data }) => ({
                url: `${id}/examQuestions`,
                method: 'POST',
                body: data
            })
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetSubjectsQuery, useGetCoursesQuery, useGetExamDataQuery, useGetBatchesQuery, useGetInvigilatorsQuery, useGetQuestionBanksQuery, useGetQuestionsAsPerBankIdQuery, useAddExamDataMutation, useGetQuestionIdMutation, useAddQuestionBanksMutation } = adminApi