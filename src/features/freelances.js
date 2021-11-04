import { createAction, createReducer } from "@reduxjs/toolkit"
import { selectFreelances } from "../utils/selectors"

const initialState = {
    status: 'void',
    data: null,
    error: null,
}

// actions creators
const freelancesFetching = createAction('freelances/fetching');
const freelancesResolved = createAction('freelances/resolved', (data) => {
    return {
        payload: data
    }
});
const freelancesRejected = createAction('freelances/rejected', (error) => {
    return {
        payload: error
    }
});

export async function fetchOrUpdateFreelances(dispatch, getState) {
    const status = selectFreelances(getState()).status;
    if (status === 'pending' || status === 'updating'){
        return;
    }
    dispatch(freelancesFetching())
    try {
        const response = await fetch('http://localhost:8000/freelances')
        const data = await response.json()
        dispatch(freelancesResolved(data))    
    } catch(error) {
        dispatch(freelancesRejected(error))
    }
}

// reducer
export default createReducer(initialState, builder => builder
    .addCase(freelancesFetching, (draft, action) => {
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
    })
    .addCase(freelancesResolved, (draft, action) => {
        if (draft.status === 'pending' || draft.status === 'updating') {
            draft.data = action.payload
            draft.status = 'resolved'
            return
        }
        return
    })
    .addCase(freelancesRejected, (draft, action) => {
        if (draft.status === 'pending' || draft.status === 'updating') {
            draft.error = action.payload
            draft.data = null
            draft.status = 'rejected'
            return
        }
        return
    })
)