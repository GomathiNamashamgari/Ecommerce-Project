import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { create } from "domain";
import { stat } from "fs";
import { api } from "../../config/Api";
import { Wishlist, WishlistState } from "../../types/WishlistTypes";

const initialState: WishlistState = {
    wishlist: null,
    loading: false,
    error: null,
};

export const getWishlistByUserId = createAsyncThunk(
    "wishlist/getWishlistByUserId",
    async(_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/wishlist`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    },
                });
                    console.log("Wishlist response:", response.data);
            return response.data;
            } catch (error: any) {
                console.log("error ", error);
                return rejectWithValue(error.response.data.message || "Failed to fetch wishlist");
        }
    }
);

export const addProductToWishlist = createAsyncThunk(
    "wishlist/addProductToWishlist",
    async (
        { productId }: { productId: number },
        { rejectWithValue }
    ) =>{
        try {
            const response = await api.post(`/wishlist/add-product/${productId}`,
                { },
                {
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    }
                }
            );
            console.log("add product ", response.data);
            return response.data;
        }catch (error: any) {
            console.log("error ", error);
            return rejectWithValue(error.response.data.message || "Failed to add product to wishlist");
        }
    }
);

const WishlistSlice =  createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        resetWishlistState: (state) => {
            state.wishlist = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getWishlistByUserId.pending, (state) =>{
                state.loading = true;
                state.error = null;
            });
            builder.addCase
            (getWishlistByUserId.fulfilled, (state, action: PayloadAction<Wishlist>) =>{
                state.wishlist = action.payload;
                state.loading = false;
            });
            builder.addCase
            (getWishlistByUserId.rejected, (state, action: PayloadAction<any>) =>{
                state.loading = false;
                state.error = action.payload;
            });
            builder
            .addCase(addProductToWishlist.pending, (state) =>{
                state.loading = true;
                state.error = null;
            });
            builder.addCase
            (addProductToWishlist.fulfilled, (state, action: PayloadAction<Wishlist>) =>{
                state.wishlist = action.payload;
                state.loading = false;
            });
            builder.addCase
            (addProductToWishlist.rejected, (state, action: PayloadAction<any>) =>{
                state.loading = false;
                state.error = action.payload;
            }
        );
    },
});

export const { resetWishlistState } = WishlistSlice.actions;

export default WishlistSlice.reducer;