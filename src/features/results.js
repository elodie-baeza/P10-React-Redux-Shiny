import { createSlice } from "@reduxjs/toolkit"
import { selectResults } from "../utils/selectors"

//initialState
const initialState = {
    status: 'void',
    data: null,
    error: null,
    params: null
}

const {actions, reducer} = createSlice({
    name: 'results',
    initialState,
    reducers: {
        fetching: {
            prepare: (params) => ({
                    payload: { params }
            }),
            reducer: (draft, action) => {
                const params = action.payload.params
                if (draft.status === 'void') {
                    draft.status = 'pending'
                    draft.params = params
                    return
                }
                draft.status = 'updating'
                draft.params = params
            }
        },
        resolved: {
            prepare: (params, data) => ({
                    payload: { params, data }
            }),
            reducer: (draft, action) => {
                if (draft.params !== action.payload.params) {
                    return
                }
                if (draft.status === 'pending' || draft.status === 'updating') {
                    draft.data = action.payload
                    draft.status = 'resolved'
                    return
                }
                return    
            }
        },
        rejected: {
            prepare: (params, error) => ({
                payload: { params, error }
        }),
            reducer: (draft, action) => {
                if (draft.params !== action.payload.params){
                    return
                }
                if (draft.status === 'pending' || draft.status === 'updating') {
                    draft.error = action.payload
                    draft.data = null
                    draft.status = 'rejected'
                    return
                }
                return    
            }
        }
    }
})

// async / await action
export function fetchOrUpdateResults(params){
    return async (dispatch, getState) => {
        const results = selectResults(getState())
        if (results.status === 'void' || results.params !== params ){
            dispatch(actions.fetching(params))
        }
        try {
            const response = await fetch(
              `http://localhost:8000/results?${params}`
            )
            const data = await response.json()
            dispatch(actions.resolved(params, data))
        } catch (error) {
            dispatch(actions.rejected(params, error))
        }
    }
}

export default reducer