import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ProcessedSpecies } from '../../ui/component/AddSpeciesModal'

export interface SpeciesState {
    NewSpecies: ProcessedSpecies[]
}

const initialState: SpeciesState = {
    NewSpecies: []
}

export const speciesSlice = createSlice({
    name: 'species',
    initialState,
    reducers: {
        setNewSpecies: (state, action: PayloadAction<{ data: ProcessedSpecies[]}>) => {
            state.NewSpecies = action.payload.data
        }
    }
})

// Action creators are generated for each case reducer function
export const { setNewSpecies } = speciesSlice.actions

export default speciesSlice.reducer
