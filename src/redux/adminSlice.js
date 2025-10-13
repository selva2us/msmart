import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalSales: 15000,
  productsInStock: 120,
  lowStock: 5,
  todaysRevenue: 4500,
  salesData: [500, 700, 800, 900, 1000, 1200],
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    updateMetrics: (state, action) => ({ ...state, ...action.payload }),
  },
});

export const { updateMetrics } = adminSlice.actions;
export default adminSlice.reducer;
