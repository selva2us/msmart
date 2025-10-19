import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { getAllProducts } from "../api/productApi";
import { getAdminDashboardStats } from "../api/adminAPI";

// ----------------- Async Thunks -----------------
export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await getAllProducts();
    return response;
  } catch (error) {
    console.error("Fetch products failed:", error);
    return rejectWithValue(error.message);
  }
});

export const fetchAdminStats = createAsyncThunk("admin/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const response = await getAdminDashboardStats();
    return response;
  } catch (error) {
    console.error("Fetch admin stats failed:", error);
    return rejectWithValue(error.message);
  }
});

// ----------------- Admin Slice -----------------
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    totalSales: 0,
    productsInStock: 0,
    lowStock: 0,
    todaysRevenue: 0,
    salesData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load admin stats";
      });
  },
});

// ----------------- Product Slice -----------------
const productSlices = createSlice({
  name: "products",
  initialState: { list: [], loading: false, error: null },
  reducers: {
    addProduct: (state, action) => {
      state.list.push(action.payload);
    },
    deleteProduct: (state, action) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
    editProduct: (state, action) => {
      const index = state.list.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load products";
      });
  },
});

// ----------------- Configure Store -----------------
const store = configureStore({
  reducer: {
    admin: adminSlice.reducer,
    products: productSlices.reducer,
    auth: authReducer,
  },
});

export const { addProduct, deleteProduct, editProduct } = productSlices.actions;
export default store;
