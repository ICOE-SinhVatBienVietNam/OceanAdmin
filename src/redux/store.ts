import { configureStore } from '@reduxjs/toolkit'

// Reducer
import speciesReducer from './reducer/speciesReducer'

export const store = configureStore({
    reducer: {
        speciesReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch