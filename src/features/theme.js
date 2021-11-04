import { createSlice } from "@reduxjs/toolkit"

const {actions, reducer} = createSlice({
    name: 'theme',
    initialState: 'light',
    reducers: {
        toggle: (state) => {
            return state === 'light' ? 'dark' : 'light'
        },
        set: (state, action) => {
            return action.payload
        }
    }
})

export const {toggle, set} = actions

export default reducer