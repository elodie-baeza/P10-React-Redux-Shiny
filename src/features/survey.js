import { createAction } from "@reduxjs/toolkit"
import produce from "immer"
import { selectSurvey } from "../utils/selectors"

const initialState = {
    status: 'void',
    data: null,
    error: null,
}

// actions creators
const surveyFetching = createAction('survey/fetching');
const surveyResolved = createAction('survey/resolved', (data) => {
    return{
        payload: data 
    }
}) ;
const surveyRejected = createAction('survey/rejected', (error) => {
    return{
        payload: error
    }
}) ;

export async function fetchOrUpdateSurvey(store) {
    const status = selectSurvey(store.getState()).status;
    if (status === 'pending' || status === 'updating'){
        return;
    }
    store.dispatch(surveyFetching())
    try {
        const response = await fetch('http://localhost:8000/survey')
        const data = await response.json()
        store.dispatch(surveyResolved(data))    
    } catch(error) {
        store.dispatch(surveyRejected(error))
    }
}

// reducer
export default function surveyReducer(state = initialState, action) {
    return produce(state, draft => {
        switch(action.type) {
            // request isLoading
            case surveyFetching.toString(): {
                if (draft.status === 'void') {
                    draft.status = 'pending'
                    return
                }
                if (draft.status === 'rejected') {
                    draft.error = null
                    draft.status = 'pending'
                    return
                }
                if (draft.status === 'resolved') {
                    draft.status = 'updating'
                    return
                }
                return
            }
            // request return data
            case surveyResolved.toString(): {
                if (draft.status === 'pending' || draft.status === 'updating') {
                    draft.data = action.payload
                    draft.status = 'resolved'
                    return
                }
                return
            }
            // request has error
            case surveyRejected.toString(): {
                if (draft.status === 'pending' || draft.status === 'updating') {
                    draft.error = action.payload
                    draft.data = null
                    draft.status = 'rejected'
                    return
                }
                return
            }
            default: return;
        }
    })
}