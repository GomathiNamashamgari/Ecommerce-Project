import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Deal, DealState } from "../../types/DealTypes";

const initialState: DealState = {
  deals: [],
  loading: false,
  error: null,
  dealCreated: false,
  dealUpdated: false,
};

// Create Deal
export const createDeal = createAsyncThunk(
  "deals/createDeal",
  async (deal: Deal, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/deals", deal, {
        headers: {
          "Content-Type": "application/json", // ← Fixed typo
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      console.log("Deal created:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("Error creating deal:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to create deal");
    }
  }
);

// Get All Deals
export const getAllDeals = createAsyncThunk(
  "deals/getAllDeals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/deals", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      console.log("Fetched deals:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("Error fetching deals:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch deals");
    }
  }
);

// Delete Deal (Bonus — you’ll need this!)
/* export const deleteDeal = createAsyncThunk(
  "deals/deleteDeal",
  async (dealId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/deals/${dealId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      return dealId;
    } catch (error: any) {
      return rejectWithValue("Failed to delete deal");
    }
  }
); */

const dealSlice = createSlice({
  name: "deal",
  initialState,
  reducers: {
    clearDealStatus: (state) => {
      state.dealCreated = false;
      state.dealUpdated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Deal
    builder
      .addCase(createDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.dealCreated = false;
      })
      .addCase(createDeal.fulfilled, (state, action) => {
        state.loading = false;
        state.deals.push(action.payload);
        state.dealCreated = true;
      })
      .addCase(createDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get All Deals
    builder
      .addCase(getAllDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload;
      })
      .addCase(getAllDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Deal
    /* builder.addCase(deleteDeal.fulfilled, (state, action) => {
      state.deals = state.deals.filter((deal) => deal.id !== action.payload);
    }); */
  },
});

export const { clearDealStatus } = dealSlice.actions;
export default dealSlice.reducer;