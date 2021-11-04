import { createAction, createReducer } from "@reduxjs/toolkit"
import { selectResults } from "../utils/selectors"

//initialState
const initialState = {
    status: 'void',
    data: null,
    error: null,
    params: null
}

// action creator
const resultsFetching = createAction('results/fetching', (params) => {
    return {
        payload: { params }
    }
})

const resultsResolved = createAction('results/resolved', (params, data) => {
    return {
        payload: { params, data }
    }
})

const resultsRejected = createAction('results/rejected', (params, error) => {
    return {
        payload: { params, error }
    }
})

// async / await action
export function fetchOrUpdateResults(params){
    return async (dispatch, getState) => {
        const results = selectResults(getState())
        if (results.status === 'void' || results.params !== params ){
            dispatch(resultsFetching(params))
        }
        try {
            const response = await fetch(
              `http://localhost:8000/results?${params}`
            )
            const data = await response.json()
            dispatch(resultsResolved(params, data))
        } catch (error) {
            dispatch(resultsRejected(params, error))
        }
    }
}

// reducer
export default createReducer(initialState, builder => 
    builder
        .addCase(resultsFetching, (draft, action) => {
            const params = action.payload.params
            if (draft.status === 'void') {
                draft.status = 'pending'
                draft.params = params
                return
            }
            draft.status = 'updating'
            draft.params = params
        })
        .addCase(resultsResolved, (draft, action) => {
            if (draft.params !== action.payload.params) {
                return
            }
            if (draft.status === 'pending' || draft.status === 'updating') {
                draft.data = action.payload
                draft.status = 'resolved'
                return
            }
            return    
        })
        .addCase(resultsRejected, (draft, action) => {
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
        })
)