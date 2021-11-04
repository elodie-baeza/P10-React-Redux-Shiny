// variables
const TOGGLE_THEME = 'theme/toggle'
const SET_THEME = 'theme/set'

// actions creator
export const toggleTheme = () => ({ type: TOGGLE_THEME })

export const setTheme = (theme = 'light') => ({
    type: SET_THEME,
    payload: theme,
})

// reducer
// on utilise une valeur par défaut pour donner le state initial
export default function themeReducer(state = 'lignt', action){
    if (action.type === TOGGLE_THEME){
        return state === 'light' ? 'dark' : 'light'
    }
    if (action.type === SET_THEME){
        return action.payload
    }
    return state
}