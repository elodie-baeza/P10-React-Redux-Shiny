import { createAction } from "@reduxjs/toolkit"

// actions creator
export const toggleTheme = createAction('theme/toggle')

export const setTheme = createAction('theme/set')
setTheme('light')

// reducer
// on utilise une valeur par défaut pour donner le state initial
export default function themeReducer(state = 'lignt', action){
    if (action.type === toggleTheme.toString()){
        return state === 'light' ? 'dark' : 'light'
    }
    if (action.type === setTheme.toString()){
        return action.payload
    }
    return state
}