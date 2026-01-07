import { configureStore } from '@reduxjs/toolkit'

// Reducer
import speciesReducer from './reducer/speciesReducer'
import adminReducer from './reducer/adminReducer'

export const store = configureStore({
    reducer: {
        speciesReducer,
        adminReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch