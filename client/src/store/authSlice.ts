import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  isVendor: boolean;
  isAdmin: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  isVendor: false,
  isAdmin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isVendor = action.payload?.role === 'vendor';
      state.isAdmin = action.payload?.role === 'admin';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isVendor = false;
      state.isAdmin = false;
    },
  },
});

export const { setUser, setLoading, clearAuth } = authSlice.actions;
export default authSlice.reducer;
