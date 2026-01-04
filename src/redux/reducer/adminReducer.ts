import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type UserRole = "superadmin" | "admin" | "editor" | "viewer" | "superuser" | "user"

export type AdminData = {
    accessToken: string,
    refreshToken: string,
    user: {
        id: string,
        supabase_id: string,
        name: string,
        email: string,
        phone_number: string | number | null,
        role: UserRole,
        banned: boolean,
        created_at: string,
        updated_at: string
    },
    expires_at: number
}

export interface AdminState {
    isAuth: boolean
    user: AdminData['user'] | null
}

const initialState: AdminState = {
    isAuth: false,
    user: null,
}

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{ auth: boolean }>) => {
            if (state.isAuth != action.payload.auth) {
                state.isAuth = action.payload.auth
            }
        },

        setAdminData: (
            state,
            action: PayloadAction<{ adminData: AdminData['user'] | null }>
        ) => {
            state.user = action.payload.adminData;
        },
    }
})

// Action creators are generated for each case reducer function
export const {
    setAuth,
    setAdminData
} = adminSlice.actions

export default adminSlice.reducer
