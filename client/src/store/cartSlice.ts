import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  loading: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  loading: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    // Optimistic UI updates
    addOptimisticItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(i => 
        i.productId === action.payload.productId && 
        JSON.stringify(i.selectedAttributes) === JSON.stringify(action.payload.selectedAttributes)
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeOptimisticItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateOptimisticQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
});

export const { 
  setCartItems, 
  addOptimisticItem, 
  removeOptimisticItem, 
  updateOptimisticQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  setLoading
} = cartSlice.actions;

export default cartSlice.reducer;
