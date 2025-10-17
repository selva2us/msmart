// src/redux/slices/productsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [
    { id: "1", name: "Apple", price: 50, stock: 30 },
    { id: "2", name: "Banana", price: 20, stock: 25 },
    { id: "3", name: "Milk Packet", price: 45, stock: 15 },
    { id: "4", name: "Bread", price: 30, stock: 10 },
    { id: "5", name: "Soap", price: 25, stock: 18 },
    { id: "6", name: "Rice (1kg)", price: 80, stock: 22 },
  ],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    reduceStock: (state, action) => {
      const soldItems = action.payload;
      soldItems.forEach((sold) => {
        const item = state.products.find((p) => p.id === sold.id);
        if (item) {
          item.stock = Math.max(item.stock - sold.qty, 0);
        }
      });
    },
  },
});

export const { reduceStock } = productsSlice.actions;
export default productsSlice.reducer;
