import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Common_names = {
  species_id: string;
  name: string;
};

type References = {
  species_id: string;
  display_name: string;
  path: string | null;
};

type Thumbnails = {
  species_id: string;
  thumbnail: string;
  is_main: boolean;
};

type Species_coordinates = {
  species_id: string;
  latitude: string;
  longitude: string;
};

export type SpeciesData = {
  id: string;
  group: string | null;
  phylum: string | null;
  class: string | null;
  order: string | null;
  family: string | null;
  genus: string;
  species: string;
  threatened_symbol: string | null;
  impact: string | null;
  description: string | null;
  characteristic: string | null;
  habitas: string | null;
  distribution_vietnam: string | null;
  distribution_world: string | null;
  created_at: string;
  updated_at: string;
  common_names: [] | Common_names[];
  species_coordinates: Species_coordinates[];
  references: [] | References[];
  thumbnails: [] | Thumbnails[];
};

export interface SpeciesState {
  speciesDetail: SpeciesData | null;
  data: SpeciesData[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const initialState: SpeciesState = {
  speciesDetail: null,
  data: [],
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

export const speciesSlice = createSlice({
  name: "species",
  initialState,
  reducers: {
    resetData: (state) => {
      state.data = [];
    },

    setPaginationData: (state, action: PayloadAction<SpeciesData[]>) => {
      state.data = action.payload;
    },

    setPagination: (
      state,
      action: PayloadAction<{
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      }>,
    ) => {
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.total = action.payload.total;
      state.totalPages = action.payload.totalPages;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },

    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },

    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },

    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },

    addNewSpecies: (state, action: PayloadAction<SpeciesData[]>) => {
      state.data.unshift(...action.payload);

      if (state.data.length > state.limit) {
        state.data.pop();
      }
    },

    removeSpecies: (state, action: PayloadAction<string[]>) => {
      state.data = state.data.filter(
        (species) => !action.payload.includes(species.id),
      );
    },

    updateSpecies: (state, action: PayloadAction<SpeciesData>) => {
      const index = state.data.findIndex(
        (species) => species.id === action.payload.id,
      );
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },

    setDetailSpecies: (state, action: PayloadAction<SpeciesData>) => {
      if (!action.payload) return;
      state.speciesDetail = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  resetData,
  setPaginationData,
  setPagination,
  setPage,
  setLimit,
  setTotal,
  setTotalPages,
  addNewSpecies,
  removeSpecies,
  updateSpecies,
  setDetailSpecies,
} = speciesSlice.actions;

export default speciesSlice.reducer;
