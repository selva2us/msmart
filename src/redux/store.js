import { configureStore, createSlice } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // add this

// ----------------- Admin Slice -----------------
const initialAdminState = {
  totalSales: 1200,
  productsInStock: 340,
  lowStock: 12,
  todaysRevenue: 450,
  salesData: [50, 80, 100, 90, 120, 60],
};

const adminSlice = createSlice({
  name: 'admin',
  initialState: initialAdminState,
  reducers: {
    // Optional: add admin reducers if needed
  },
});

// ----------------- Product Slice -----------------
const initialProductState = {
  list: [], // stores all products
};

const productSlice = createSlice({
  name: 'products',
  initialState: initialProductState,
  reducers: {
    addProduct: (state, action) => {
      state.list.push({ id: Date.now(), ...action.payload });
    },
    deleteProduct: (state, action) => {
      state.list = state.list.filter(p => p.id !== action.payload);
    },
    editProduct: (state, action) => {
      const index = state.list.findIndex(p => p.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
  },
});

// ----------------- Configure Store -----------------
const store = configureStore({
  reducer: {
    admin: adminSlice.reducer,
    products: productSlice.reducer,
    auth: authReducer,
  },
});

export const { addProduct, deleteProduct, editProduct } = productSlice.actions;
export default store;
