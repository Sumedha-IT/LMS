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
        getCurriculum : builder.query({
            query: () => `curriculums`,
        }),
        getCourses: builder.query({
            query: () => `courses`,
        }),
        getBatches: builder.query({
            query: () => `allBatches`,
        }),
        getExamData: builder.query({
            query: ({ page, rowsPerPage, filterBatch, dateCriteria }) => ({
                url: `exams`,
                params: {
                    page: page || 1,
                    size: rowsPerPage || 10,
                    dateCriteria: dateCriteria || '',
                    batchId: filterBatch || ''
                }
            }),
        }),
        getInvigilators: builder.query({
            query: () => 'invigilators',
        }),
        getQuestionBanks: builder.query({
            query: ({ page, rowsPerPage }) => `questionBanks?page=${page}&size=${rowsPerPage}`,
        }),
        getMarkListBanks: builder.mutation({
            query: (id) => ({
                url: `exams/${id}/listMarks`,
                method: 'GET',
            })
        }),
        getQuestionsAsPerBankId: builder.query({
            query: (id) => `questions?questionBankId=${id}`,
        }),
        getRandomQuestionIds: builder.mutation({
            query: ({ bankId, partId, examId }) => ({
                url: `${examId}/examQuestions?questionBankId=${bankId}&partId=${partId}`,
                method: 'GET',
            })
        }),
        getExamDataById: builder.mutation({
            query: (id) => ({
                url: `exams/${id}`,
                method: 'GET',
            })
        }),
        AddExamData: builder.mutation({
            query: (payload) => ({
                url: 'exams',
                method: 'POST',
                body: payload
            })
        }),
        UpdateExamData: builder.mutation({
            query: ({ data, id }) => ({
                url: `exams/${id}`,
                method: 'PUT',
                body: data
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
            query: ({ examId, data }) => ({
                url: `${examId}/examQuestions`,
                method: 'POST',
                body: data
            })
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetSubjectsQuery,useGetCurriculumQuery, useGetCoursesQuery, useGetExamDataQuery, useGetExamDataByIdMutation,useGetMarkListBanksMutation, useGetRandomQuestionIdsMutation, useGetBatchesQuery, useGetInvigilatorsQuery, useGetQuestionBanksQuery, useGetQuestionsAsPerBankIdQuery, useAddExamDataMutation, useUpdateExamDataMutation, useGetQuestionIdMutation, useAddQuestionBanksMutation } = adminApi