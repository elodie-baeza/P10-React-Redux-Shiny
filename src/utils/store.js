import { configureStore } from "@reduxjs/toolkit";
import freelanceReducer from "../features/freelance";
import freelancesReducer from "../features/freelances";
import surveyReducer from "../features/survey";
import themeReducer from "../features/theme";

const store = configureStore({
    reducer: {
        theme: themeReducer,
        freelances: freelancesReducer,
        survey: surveyReducer,
        freelance: freelanceReducer,
    }
})

export default store