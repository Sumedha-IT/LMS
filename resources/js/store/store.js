import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query';
import { adminApi } from './service/admin/AdminService'
import { userApi } from './service/user/UserService'
import ExamReducer from './slices/adminSlice/ExamSlice'
import UserExamReducer from './slices/userSlice/UserExamSlice'

export const store = configureStore({
    reducer: {
        ExamReducer: ExamReducer,
        UserExamReducer: UserExamReducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [userApi.reducerPath]: userApi.reducer

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(adminApi.middleware).concat(userApi.middleware),
})

setupListeners(store.dispatch);