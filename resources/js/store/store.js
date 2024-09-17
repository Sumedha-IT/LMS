import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query';
import { adminApi } from './service/admin/AdminService'
import ExamReducer from './slices/adminSlice/ExamSlice'

export const store = configureStore({
    reducer: {
        ExamReducer: ExamReducer,
        [adminApi.reducerPath]: adminApi.reducer

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(adminApi.middleware),
})

setupListeners(store.dispatch);