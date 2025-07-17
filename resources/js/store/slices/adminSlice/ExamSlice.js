import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    QuestionBankCount: []
}

export const ExamSlice = createSlice({
    name: 'exam',
    initialState,
    reducers: {
        getBankCount(state, action) {
            state.QuestionBankCount = action.payload
        }
    },
})

export const { getBankCount } = ExamSlice.actions
export default ExamSlice.reducer