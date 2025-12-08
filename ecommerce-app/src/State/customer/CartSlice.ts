import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Cart, CartItem } from "../../types/CartTypes";
import { sumCartItemMrpPrice } from "../../Util/sumCartItemMrpPrice";
import { sumCartItemSellingPrice } from "../../Util/sumCartItemSellingPrice";
import { RootState } from "../Store";
import { applyCoupon } from "./CouponSlice";

interface CartState{
    cart:Cart|null;
    loading:boolean;
    error:string|null;
}
const initialState: CartState={
    cart:null,
    loading:false,
    error:null,
};

const API_URL= "/cart";

export const fetchUserCart = createAsyncThunk<Cart, string>(
    "cart/fetchUserCart",
    async(jwt: string, {rejectWithValue}) =>{
        try {
            const response = await api.get(API_URL,{
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("cart fetched ", response.data);
            return response.data;
        } catch (error:any) {
            console.log("error ", error.response);
            return rejectWithValue("feailed to fetch user cart");
        }
    }
);

interface AddItemRequest {
    productId: number | undefined;
    size: string;
    quantity:number;
}

export const addItemToCart = createAsyncThunk<
  CartItem,                                   // return type
  { jwt: string | null; request: AddItemRequest }, // payload type
  { rejectValue: string }                     // reject type
>(
  "cart/addItemToCart",
  async ({ jwt, request }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/add`, request, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("cart added ", response.data);
      return response.data ;
    } catch (error: any) {
        console.log("error ",error.response);
      return rejectWithValue("Failed to add item to cart");
    }
  }
);

export const deleteCartItem = createAsyncThunk<
  any,                                   // return type
  { jwt: string ; cartItemId:number }
>(
  "cart/deleteCartItem",
  async ({ jwt, cartItemId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_URL}/item/${cartItemId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data ;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return rejectWithValue({ empty: true });
      }
      return rejectWithValue(error.response.data.message ||"Failed to delete cart item ");
    }
  }
);

export const updateCartItem = createAsyncThunk<
  any,                                   // return type
  { jwt: string | null ; cartItemId:number; cartItem:any }
>(
  "cart/updateCartItem",
  async ({ jwt, cartItemId, cartItem }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/item/${cartItemId}`, cartItem, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      //console.log("cart item updated successfully ",response.data)
      return response.data ;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message ||"Failed to delete cart item ");
    }
  }
);

const cartSlice=createSlice({
    name: "cart",
    initialState,
    reducers: {
        resetCartState:(state) => {
            state.cart = null;
            state.loading=false;
            state.error=null;
        },
    },
    
    extraReducers: (builder) =>{
        builder.addCase(fetchUserCart.pending, (state) => {
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchUserCart.fulfilled,
            (state, action:PayloadAction<Cart>) =>{
                state.cart=action.payload;
                state.loading=false;
            }
        )
        .addCase(fetchUserCart.rejected,(state, action) => {
            state.loading= false;
            state.error=action.payload as string;
        })
        .addCase(addItemToCart.pending, (state) => {
            state.loading=true;
            state.error=null;
        })
        .addCase(addItemToCart.fulfilled,
            (state, action:PayloadAction<CartItem>) =>{
                if(state.cart){
                    state.cart.cartItems.push(action.payload);
                }
                state.loading=false;
            }
        )
        .addCase(addItemToCart.rejected,(state, action) => {
            state.loading= false;
            state.error=action.payload as string;
        })

        .addCase(deleteCartItem.pending, (state) => {
            state.loading=true;
            state.error=null;
        })
        .addCase(deleteCartItem.fulfilled,
            (state, action) =>{
                if(state.cart){
                    state.cart.cartItems = state.cart.cartItems.filter(
                        (item:CartItem) => item.id !== action.meta.arg.cartItemId
                    );
                    const mrpPrice=sumCartItemMrpPrice(state.cart?.cartItems || [])
                    const sellingPrice=sumCartItemSellingPrice(state.cart?.cartItems || [])
                    state.cart.totalSellingPrice=sellingPrice;
                    state.cart.totalMrpPrice=mrpPrice;
                }
                state.loading=false;
            }
        )
        .addCase(deleteCartItem.rejected,(state, action) => {
            state.loading= false;
            state.error=action.payload as string;
        })

        .addCase(updateCartItem.pending, (state) => {
            state.loading=true;
            state.error=null;
        })
        .addCase(updateCartItem.fulfilled,
            (state, action) =>{
                if(state.cart){
                    const updatedItem = action.payload; // response from backend

        // update only the changed item
        state.cart.cartItems = state.cart.cartItems.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
        );
                    const mrpPrice=sumCartItemMrpPrice(state.cart?.cartItems || [])
                    const sellingPrice=sumCartItemSellingPrice(state.cart?.cartItems || [])
                    state.cart.totalSellingPrice=sellingPrice;
                    state.cart.totalMrpPrice=mrpPrice;
                }
                state.loading=false;
            }
        )
        .addCase(updateCartItem.rejected,(state, action) => {
            state.loading= false;
            state.error=action.payload as string;
        })
        .addCase(applyCoupon.fulfilled, (state, action) => {
            state.loading=false;
            state.cart=action.payload;
        });
    }

});

export default cartSlice.reducer;
export const { resetCartState } = cartSlice.actions;

//export const selectCart =(state: RootState)=> state.cart.cart;
//export const selectCartLoading = (state:RootState) => state.cart.loading;
//export const selectCartError=(state:RootState) => state.cart.error;