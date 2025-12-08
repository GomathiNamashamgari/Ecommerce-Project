// src/State/admin/adminSellerSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { AxiosError } from "axios";
import { Seller } from "../../types/SellerTypes";

// ----------------------
// State Interface
// ----------------------
interface AdminSellerState {
  sellers: Seller[];
  loading: boolean;
  error: string | null;
}

// ----------------------
// Initial State
// ----------------------
const initialState: AdminSellerState = {
  sellers: [],
  loading: false,
  error: null,
};

// ----------------------
// Thunks
// ----------------------

// Fetch all sellers
export const fetchAllSellers = createAsyncThunk<
  Seller[],
  void,
  { rejectValue: string }
>("admin/fetchAllSellers", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) return rejectWithValue("No JWT token found");

    const { data } = await api.get("/admin/sellers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    const error = err as AxiosError;
    const message =
      error.response?.status === 403
        ? "Forbidden: You do not have access"
        : (error.response?.data as string) || error.message;
    return rejectWithValue(message);
  }
});

// Update seller status
interface UpdateSellerStatusPayload {
  id: number;
  status: string;
}

export const updateSellerStatus = createAsyncThunk<
  Seller,
  UpdateSellerStatusPayload,
  { rejectValue: string }
>(
  "admin/updateSellerStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) return rejectWithValue("No JWT token found");

      const { data } = await api.put(`/admin/seller/${id}/status/${status}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      const error = err as AxiosError;
      const message =
        error.response?.status === 403
          ? "Forbidden: You do not have access"
          : (error.response?.data as string) || error.message;
      return rejectWithValue(message);
    }
  }
);

// ----------------------
// Slice
// ----------------------
const adminSellerSlice = createSlice({
  name: "adminSellers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all sellers
      .addCase(fetchAllSellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSellers.fulfilled, (state, action: PayloadAction<Seller[]>) => {
        state.loading = false;
        state.sellers = action.payload;
      })
      .addCase(fetchAllSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch sellers";
      })

      // Update seller status
      .addCase(updateSellerStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSellerStatus.fulfilled, (state, action: PayloadAction<Seller>) => {
        state.loading = false;
        const updated = action.payload;
        state.sellers = state.sellers.map((s) =>
          s.id === updated.id ? updated : s
        );
      })
      .addCase(updateSellerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update seller status";
      });
  },
});

export default adminSellerSlice.reducer;
