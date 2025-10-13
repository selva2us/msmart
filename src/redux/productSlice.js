import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: { products: [] },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    updateProductStock: (state, action) => {
      const { id, quantity } = action.payload;
      const index = state.products.findIndex((p) => p.id === id);
      if (index !== -1) {
        state.products[index].stock = quantity;
      }
    },
  },
});

export const { setProducts, updateProductStock } = productSlice.actions;
export default productSlice.reducer;
