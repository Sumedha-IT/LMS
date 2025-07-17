import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    QuestionsData: {}
}

export const UserExamSlice = createSlice({
    name: 'userexam',
    initialState,
    reducers: {
        getQuestionsData(state, action) {
            state.QuestionsData = action.payload
        }
    },
})

export const { getQuestionsData } = UserExamSlice.actions
export default UserExamSlice.reducer