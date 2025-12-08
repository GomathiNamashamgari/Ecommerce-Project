import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import exp from "constants";
import { number } from "yup";
import { api } from "../../config/Api";
import { Cart } from "../../types/CartTypes";
import { CouponState } from "../../types/CouponTypes";

const API_URL ="/api/coupons";

export const applyCoupon = createAsyncThunk<
Cart,
{ 
    apply: string ; code: string;
    orderValue: number; jwt: string
},
{ rejectValue: string }>(
    "coupon/applyCoupon",
    async({ apply, code, orderValue, jwt},{ rejectWithValue }) => {
        try {
            const response= await api.post(`${API_URL}/apply`, null,{
                headers:{Authorization: `Bearer ${jwt}`},
            });
            console.log("apply coupon ", response.data);
            return response.data;
        } catch (error:any) {
            console.log("error ", error);
            return rejectWithValue(error.response?.data.error || "Failed to apply coupon");
        }
    }
);

const initialState: CouponState ={
    coupons: [],
    cart: null,
    loading: false,
    error: null,
    couponCreated:false,
    couponApplied: false,
}

const CouponSlice = createSlice({
    name:"coupon",
    initialState,
    reducers: {},
    extraReducers: (builder) =>{
        builder
        .addCase(applyCoupon.pending,(state) => {
            state.loading=true;
            state.error=null;
            state.couponApplied=false;
        })
        .addCase(applyCoupon.fulfilled,(state, action) => {
            state.loading=false;
            state.cart = action.payload;
            if(action.meta.arg.apply=="true"){
                state.couponApplied=true
            }
        })
        .addCase(applyCoupon.rejected,
            (state, action: PayloadAction<string | undefined>) => {
                state.loading=false;
                state.error= action.payload || "Failed to apply coupon";
                state.couponApplied=false;
            }
        );
    },
});

export default CouponSlice.reducer;

