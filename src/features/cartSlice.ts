
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from './product';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const existing = state.items.find(item => item.product.id === action.payload.id);
      if (existing) {
        existing.quantity++;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
    },
    increaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find(i => i.product.id === action.payload);
      if (item) item.quantity++;
    },
    decreaseQuantity(state, action: PayloadAction<number>) {
      const itemIndex = state.items.findIndex(i => i.product.id === action.payload);
      if (itemIndex >= 0) {
        if (state.items[itemIndex].quantity > 1) {
          state.items[itemIndex].quantity--;
        } else {
          state.items.splice(itemIndex, 1);
        }
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(i => i.product.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
