import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    QuestionBankCount: 0
}

export const ExamSlice = createSlice({
    name: 'exam',
    initialState,
    reducers: {
        getBankCount(state, action) {
            state.QuestionBankCount = action.payload.data
        }
    },
})


export default ExamSlice.reducer