import { createSlice } from '@reduxjs/toolkit'

const initialState = {
<<<<<<< Updated upstream
    QuestionBankCount: 0
=======
    QuestionBankCount: []
>>>>>>> Stashed changes
}

export const ExamSlice = createSlice({
    name: 'exam',
    initialState,
    reducers: {
        getBankCount(state, action) {
<<<<<<< Updated upstream
            state.QuestionBankCount = action.payload.data
=======
            state.QuestionBankCount = action.payload
>>>>>>> Stashed changes
        }
    },
})

<<<<<<< Updated upstream

=======
export const { getBankCount } = ExamSlice.actions
>>>>>>> Stashed changes
export default ExamSlice.reducer