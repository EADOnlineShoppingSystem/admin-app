import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import orderService from "./orderService";

export const getAllOrders = createAsyncThunk(
  "orders/get-orders",
  async (thunkAPI) => {
    try {
      return await orderService.getOrders();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getOrdersByUserId = createAsyncThunk(
  "orders/get-order",
  async (userId, thunkAPI) => {
    try {
      return await orderService.getOrder(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getMonthlyAmountsAndCounts = createAsyncThunk(
  "order/get-monthly-stats",
  async (_, thunkAPI) => {
    try {
      return await orderService.getMonthlyAmountsAndCounts();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getLast10DaysOrderCounts = createAsyncThunk(
  "order/get-last-10-days",
  async (_, thunkAPI) => {
    try {
      return await orderService.getLast10DaysOrderCounts();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
  orders: [],
  orderbyuser: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
        state.message = "success";
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })

      // Fetch user orders
      .addCase(getOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrdersByUserId.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.orderbyuser = action.payload;
        state.message = "success";
      })
      .addCase(getOrdersByUserId.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      .addCase(getMonthlyAmountsAndCounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMonthlyAmountsAndCounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.monthlyStats = action.payload;
      })
      .addCase(getMonthlyAmountsAndCounts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      // Get Last 10 Days Stats
      .addCase(getLast10DaysOrderCounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLast10DaysOrderCounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.last10DaysStats = action.payload;
      })
      .addCase(getLast10DaysOrderCounts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      });
  },
});
export default orderSlice.reducer;
