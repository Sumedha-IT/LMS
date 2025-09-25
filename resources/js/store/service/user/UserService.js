// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '..'
import Cookies from 'js-cookie';
const userId = Cookies.get('x_path_id');
export default userId;

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getStudentData: builder.query({
            query: ({ userId }) => `students/${userId}`,
        }),

        getPaymentData: builder.query({
            query: () => `payments`,
        }),

        getUserExamData: builder.query({
            query: ({ userId, ExamType, page, rowsPerPage }) => `student/${userId}/exams?examType=${ExamType}&size=${rowsPerPage}&page=${page}`,
        }),
        getAttemptedId: builder.query({
            query: ({ userId, examId, location }) => ({
                url: `student/${userId}/exam/${examId}/initiateExam`,
                method: 'GET',
                params: location ? {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    accuracy: location.accuracy
                } : {}
            })
        }),

        getExamQuestions: builder.mutation({
            query: ({ userId, examAttemptId, partId, rowsPerPage, page }) => ({
                url: `student/${userId}/examQuestions?examAttemptId=${examAttemptId}&partId=${partId}&page=${page}&size=${rowsPerPage}`,
                method: 'GET',
            })
        }),
        UploadExamQuestions: builder.mutation({
            query: ({ userId, payloadData }) => ({
                url: `student/${userId}/examQuestions`,
                method: 'POST',
                body: payloadData
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
        getExamResult: builder.mutation({
            query: ({ userId, examId, examAttemptId }) => ({
                url: `student/${userId}/exam/${examId}/submitExam?attemptId=${examAttemptId}`,
                method: 'POST'
            })
        }),
        getReviewAnswerSheet: builder.mutation({
            query: ({ userId, examId }) => ({
                url: `student/${userId}/exam/${examId}/reviewExam`,
                method: 'GET'
            })
        }),
        getReviewExamQuestion: builder.mutation({
            query: ({ userId, examId, partId }) => ({
                url: `student/${userId}/exam/${examId}/reviewExam?partId=${partId}&review=1`,
                method: 'GET'
            })
        }),
        getExamStatistic: builder.mutation({
            query: ({ userId, examId, examAttemptId }) => ({
                url: `student/${userId}/exam/${examId}/examStat?attemptId=${examAttemptId}`,
                method: 'GET'
            })
        }),
        getExamReport: builder.mutation({
            query: ({ userId, examId }) => ({
                url: `student/${userId}/exam/${examId}/examReport`,
                method: 'GET'
            })
        }),
        getStudentJobProfileData: builder.query({
            query: () => `profile/${userId}`,
        }),
        updateStudentJobProfileData: builder.mutation({
            query: ({  payload }) => ({
                url: `${userId}/profile`,
                method: 'PATCH',
                body: payload,
            })
        }),
        UpdateStudentExperienceData: builder.mutation({
            query: ({ id,  payload }) => ({
                url: `${userId}/profileExperience/${id}`,
                method: 'PUT',
                body: payload,
            })
        }),
        AddStudentExperienceData: builder.mutation({
            query: ({  payload }) => ({
                url: `${userId}/profileExperience`,
                method: 'POST',
                body: payload,
            })
        }),
        UpdateStudentEducationData: builder.mutation({
            query: ({ id, payload }) => ({
                url: `${userId}/profileEducations/${id}`,
                method: 'PUT',
                body: payload,
            })
        }),
        AddStudentEducationData: builder.mutation({
            query: ({  payload }) => ({
                url: `${userId}/profileEducations`,
                method: "POST",
                body: payload,
            })
        }),
        UpdateStudentProjectData: builder.mutation({
            query: ({ id, payload }) => ({
                url: `${userId}/projects/${id}`,
                method: 'PUT',
                body: payload,
            })
        }),
        AddStudentProjectData: builder.mutation({
            query: ({ payload }) => ({
                url: `${userId}/projects`,
                method: "POST",
                body: payload,
            })
        }),
        AddStudentCertificateData: builder.mutation({
            query: ({ formData }) => ({
                url: `${userId}/documents`,
                method: 'POST',
                body: formData,
            })
        }),
        UpdateStudentCertificateData: builder.mutation({
            query: ({ formData }) => ({
                url: `${userId}/documents`,
                method: 'POST',
                body: formData,
            })
        }),
        getStudentJobData: builder.query({
            query: ({  page, rowsPerPage, status, jobType, minExperience, maxExperience, jobPosted, officePolicy, minSalary, maxSalary, search }) => `${userId}/job?page=${page}&size=${rowsPerPage}&status=${status}&jobType=${jobType}&minExperience=${minExperience}&maxExperience=${maxExperience}&jobPosted=${jobPosted}&officePolicy=${officePolicy}&minSalary=${minSalary}&maxSalary=${maxSalary}&search=${search}`,
        }),
        getStudentApplyJobData: builder.query({
            query: ({  page, rowsPerPage, status, jobType, officePolicy, search }) => `${userId}/appliedJobs?page=${page}&size=${rowsPerPage}&status=${status}&jobType=${jobType}&officePolicy=${officePolicy}&search=${search}`,
        }),
        getViewDocument: builder.query({
            query: ({ userId, resumeId }) => `${userId}/documents/${resumeId}`,
        }),
        AddJobData: builder.mutation({
            query: ({  payload }) => ({
                url: `${userId}/job`,
                method: "POST",
                body: payload
            })
        }),
        UpdateJobData: builder.mutation({
            query: ({  payload, jobId }) => ({
                url: `${userId}/job/${jobId}`,
                method: "PUT",
                body: payload
            })
        }),
        ApplyJob: builder.mutation({
            query: ({ jobId }) => ({
                url: `${userId}/job/${jobId}/apply`,
                method: "POST"
            })
        }),
        UpdateStudentAwardData: builder.mutation({
            query: ({ payload, awardId }) => ({
                url: `${userId}/awards/${awardId}`,
                method: "PUT",
                body: payload
            })
        }),
        AddStudentAwardData: builder.mutation({
            query: ({ payload }) => ({
                url: `${userId}/awards`,
                method: "POST",
                body: payload
            })
        }),
        getCountryAndStates: builder.query({
            query: () => 'countryAndStates',
        }),
        getStates: builder.query({
            query: () => 'states',
        }),

        // ===== PLACEMENT APIs =====
        
        // Companies APIs
        getCompanies: builder.query({
            query: () => 'companies',
        }),
        getCompanyById: builder.query({
            query: (id) => `companies/${id}`,
        }),
        createCompany: builder.mutation({
            query: (payload) => ({
                url: 'companies',
                method: 'POST',
                body: payload
            })
        }),
        updateCompany: builder.mutation({
            query: ({ id, payload }) => ({
                url: `companies/${id}`,
                method: 'PUT',
                body: payload
            })
        }),
        deleteCompany: builder.mutation({
            query: (id) => ({
                url: `companies/${id}`,
                method: 'DELETE'
            })
        }),

        // Job Postings APIs
        getJobPostings: builder.query({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params) {
                    Object.keys(params).forEach(key => {
                        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
                            queryParams.append(key, params[key]);
                        }
                    });
                }
                const queryString = queryParams.toString();
                return `job-postings${queryString ? `?${queryString}` : ''}`;
            },
        }),
        getJobPostingById: builder.query({
            query: (id) => `job-postings/${id}`,
        }),
        createJobPosting: builder.mutation({
            query: (payload) => ({
                url: 'job-postings',
                method: 'POST',
                body: payload
            })
        }),
        updateJobPosting: builder.mutation({
            query: ({ id, payload }) => ({
                url: `job-postings/${id}`,
                method: 'PUT',
                body: payload
            })
        }),
        deleteJobPosting: builder.mutation({
            query: (id) => ({
                url: `job-postings/${id}`,
                method: 'DELETE'
            })
        }),

        // Job Applications APIs
        getJobApplications: builder.query({
            query: () => 'job-applications',
        }),
        getJobApplicationById: builder.query({
            query: (id) => `job-applications/${id}`,
        }),
        createJobApplication: builder.mutation({
            query: (payload) => ({
                url: 'job-applications',
                method: 'POST',
                body: payload
            })
        }),
        updateJobApplication: builder.mutation({
            query: ({ id, payload }) => ({
                url: `job-applications/${id}`,
                method: 'PUT',
                body: payload
            })
        }),
        deleteJobApplication: builder.mutation({
            query: (id) => ({
                url: `job-applications/${id}`,
                method: 'DELETE'
            })
        }),

        // Placement Statistics
        getPlacementStats: builder.query({
            query: () => 'placement/stats',
        }),



        // Courses API
        getCourses: builder.query({
            query: () => 'curriculum-management/courses',
        }),
    }),
})

export const { useGetStudentDataQuery,
    useGetUserExamDataQuery,
    useGetAttemptedIdQuery,
    useGetExamQuestionsMutation,
    useUploadExamQuestionsMutation,
    useAddExamDataMutation,
    useUpdateExamDataMutation,
    useGetExamResultMutation,
    useGetReviewAnswerSheetMutation,
    useGetReviewExamQuestionMutation,
    useGetExamStatisticMutation,
    useGetExamReportMutation,
    useGetPaymentDataQuery,
    useGetStudentJobProfileDataQuery,
    useUpdateStudentJobProfileDataMutation,
    useAddStudentExperienceDataMutation,
    useUpdateStudentExperienceDataMutation,
    useUpdateStudentEducationDataMutation,
    useAddStudentEducationDataMutation,
    useAddStudentProjectDataMutation,
    useUpdateStudentProjectDataMutation,
    useAddStudentCertificateDataMutation,
    useUpdateStudentCertificateDataMutation,
    useGetStudentJobDataQuery,
    useGetStudentApplyJobDataQuery,
    useGetViewDocumentQuery,
    useAddJobDataMutation,
    useUpdateJobDataMutation,
    useApplyJobMutation,
    useUpdateStudentAwardDataMutation,
    useAddStudentAwardDataMutation,
    useGetCountryAndStatesQuery,
    useGetStatesQuery,
    
    // Placement API hooks
    useGetCompaniesQuery,
    useGetCompanyByIdQuery,
    useCreateCompanyMutation,
    useUpdateCompanyMutation,
    useDeleteCompanyMutation,
    useGetJobPostingsQuery,
    useGetJobPostingByIdQuery,
    useCreateJobPostingMutation,
    useUpdateJobPostingMutation,
    useDeleteJobPostingMutation,
    useGetJobApplicationsQuery,
    useGetJobApplicationByIdQuery,
    useCreateJobApplicationMutation,
    useUpdateJobApplicationMutation,
    useDeleteJobApplicationMutation,
    useGetPlacementStatsQuery,
    useGetCoursesQuery,
} = userApi