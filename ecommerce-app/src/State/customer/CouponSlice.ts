import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Cart } from "../../types/CartTypes";
import { Coupon, CouponState } from "../../types/CouponTypes";

const API_URL = "/admin/coupons";

/* ================= APPLY / REMOVE COUPON ================= */
export const applyCoupon = createAsyncThunk<
  Cart,
  {
    apply: string;
    code: string;
    orderValue: number;
    jwt: string;
  },
  { rejectValue: string }
>(
  "coupon/applyCoupon",
  async ({ apply, code, orderValue, jwt }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        `${API_URL}/apply`,
        null,
        {
          headers: { Authorization: jwt },
          params: { apply, code, orderValue },
        }
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to apply coupon"
      );
    }
  }
);

/* ================= CREATE COUPON (ADMIN) ================= */
export const createCoupon = createAsyncThunk<
  Coupon,
  { coupon: Coupon; jwt: string },
  { rejectValue: string }
>("coupon/createCoupon", async ({ coupon, jwt }, { rejectWithValue }) => {
  try {
    const res = await api.post(`${API_URL}/create`, coupon, {
      headers: { Authorization: jwt },
    });
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "Failed to create coupon"
    );
  }
});

/* ================= GET ALL COUPONS ================= */
export const getAllCoupons = createAsyncThunk<
  Coupon[],
  string,
  { rejectValue: string }
>("coupon/getAllCoupons", async (jwt, { rejectWithValue }) => {
  try {
    const res = await api.get(`${API_URL}/all`, {
      headers: { Authorization: jwt },
    });
    return res.data;
  } catch (error: any) {
    return rejectWithValue("Failed to fetch coupons");
  }
});

/* ================= DELETE COUPON ================= */
export const deleteCoupon = createAsyncThunk<
  number,
  { id: number; jwt: string },
  { rejectValue: string }
>("coupon/deleteCoupon", async ({ id, jwt }, { rejectWithValue }) => {
  try {
    await api.delete(`${API_URL}/delete/${id}`, {
      headers: { Authorization: jwt },
    });
    return id;
  } catch (error: any) {
    return rejectWithValue("Failed to delete coupon");
  }
});

/* ================= INITIAL STATE ================= */
const initialState: CouponState = {
  coupons: [],
  cart: null,
  loading: false,
  error: null,
  couponCreated: false,
  couponApplied: false,
};

/* ================= SLICE ================= */
const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    resetCouponState: (state) => {
      state.couponCreated = false;
      state.couponApplied = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ----- APPLY COUPON ----- */
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.couponApplied = false;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.couponApplied = true;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Coupon apply failed";
      })

      /* ----- CREATE COUPON ----- */
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.couponCreated = false;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons.push(action.payload);
        state.couponCreated = true;
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Coupon create failed";
      })

      /* ----- GET ALL COUPONS ----- */
      .addCase(getAllCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Fetch coupons failed";
      })

      /* ----- DELETE COUPON ----- */
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(
          (c) => c.id !== action.payload
        );
      });
  },
});

export const { resetCouponState } = couponSlice.actions;
export default couponSlice.reducer;
