import { createAction, createReducer } from "@reduxjs/toolkit"
import produce from "immer"
import { selectFreelance } from "../utils/selectors"

// le state initial de cette feature est un objet vide
const initialState = {
    // chaque propriété de cet objet correspond à l'Id d'un freelance
    // 3: { status: 'void' }
}

// action creator
const freelanceFetching = createAction('freelance/fetching', (freelanceId) => {
    return {
        payload: { freelanceId }
    }
})

const freelanceResolved = createAction('freelance/resolved', (freelanceId, data) => {
    return {
        payload: { freelanceId, data }
    }
})

const freelanceRejected = createAction('freelance/rejected', (freelanceId, error) => {
    return {
        payload: { freelanceId, error }
    }
})

// async/await function
export async function fetchOrUpdateFreelance(store, freelanceId){
    const selectFreelanceById = selectFreelance(freelanceId)
    const status = selectFreelanceById(store.getState()).status
    if (status === 'pending' || status === 'updating'){
        return;
    }
    store.dispatch(freelanceFetching(freelanceId))
    try {
        const response = await fetch(
          `http://localhost:8000/freelance?id=${freelanceId}`
        )
        const data = await response.json()
        store.dispatch(freelanceResolved(freelanceId, data))
    } catch (error) {
        store.dispatch(freelanceRejected(freelanceId, error))
    }
}

function setVoidIfUndefined(draft, freelanceId){
    // on vérifie que le state contient la propriété correspondante à l'Id du freelance
    if (draft[freelanceId] === undefined) {
        // si elle n'existe pas, on l'initialise avec void
        draft[freelanceId] = { status: 'void' }
        }        
}

// reducer
export default createReducer(initialState, builder => builder
    .addCase(freelanceFetching, (draft, action) => {
        setVoidIfUndefined(draft, action.payload.freelanceId)
        if (draft[action.payload.freelanceId].status === 'void') {
            draft[action.payload.freelanceId].status = 'pending'
            return
        }
        if (draft[action.payload.freelanceId].status === 'rejected') {
            draft[action.payload.freelanceId].error = null
            draft[action.payload.freelanceId].status = 'pending'
            return
        }
        if (draft[action.payload.freelanceId].status === 'resolved') {
            draft[action.payload.freelanceId].status = 'updating'
            return
        }
        return
    })
    .addCase(freelanceResolved, (draft, action) => {
        setVoidIfUndefined(draft, action.payload.freelanceId)
        if (
            draft[action.payload.freelanceId].status === 'pending' || 
            draft[action.payload.freelanceId].status === 'updating'
            ) {
            draft[action.payload.freelanceId].data = action.payload.data
            draft[action.payload.freelanceId].status = 'resolved'
            return
        }
        return
    })
    .addCase(freelanceRejected, (draft, action) => {
        setVoidIfUndefined(draft, action.payload.freelanceId)
        if (
            draft[action.payload.freelanceId].status === 'pending' || 
            draft[action.payload.freelanceId].status === 'updating'
            ) {
            draft[action.payload.freelanceId].error = action.payload.error
            draft[action.payload.freelanceId].data = null
            draft[action.payload.freelanceId].status = 'rejected'
            return
        }
        return
    })
)