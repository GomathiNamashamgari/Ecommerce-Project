import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Order, OrderStatus } from "../../types/OrderTypes";

interface SellerOrderState {
    orders: Order[];
    loading: boolean;
    error: string | null;
}
const initialState: SellerOrderState = {
    orders: [],
    loading: false,
    error: null,
};

export const fetchSellerOrders = createAsyncThunk<Order[],string>(
    "sellerOrders/fetchSellerOrders",
    async(jwt,{rejectWithValue})=>{
        try{
            const response = await api.get(`/sellers/orders`,{
                headers:{
                    Authorization:`Bearer ${jwt}`
                },
            });
            console.log("fetch seller orders ",response.data);
            return response.data;
        } catch (error: any) {
            console.log("error ",error.response);
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateOrderStatus = createAsyncThunk<Order,
{ jwt:string,
    orderId:number,
    orderStatus:OrderStatus
}>(
    "sellerOrders/updateOrderStatus",
    async ({jwt,orderId,orderStatus},{rejectWithValue}) =>{
        try{
            const response = await api.patch(`/sellers/orders/${orderId}/status/${orderStatus}`,null,{
                headers:{
                    Authorization:`Bearer ${jwt}`
                },
            });
            console.log("order status updated ",response.data);
            return response.data;
        } catch (error: any) {
            console.log("error ",error.response);
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteOrder = createAsyncThunk<any, {jwt:string, orderId:number}>(
    "sellerOrders/deleteOrder",
    async ({jwt, orderId}, {rejectWithValue}) =>{
        try{
            const response = await api.delete(`/sellers/orders/${orderId}`,{
                headers:{
                    Authorization:`Bearer ${jwt}`
                },
            });
            console.log("order deleted ",response.data);
            return response.data;
        }catch (error: any) {
            console.log("error ",error.response);
            return rejectWithValue(error.response.data);
        }
    }
);

const sellerOrderSlice = createSlice({
    name: "sellerOrders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSellerOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            });
            builder
            .addCase(fetchSellerOrders.fulfilled, (state, action:PayloadAction<Order[]>) => {
                state.loading = false;
                state.orders = action.payload;
            });
            builder.addCase(fetchSellerOrders.rejected, (state, action:PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });

            builder
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            });
            builder.addCase(updateOrderStatus.fulfilled, (state, action:PayloadAction<Order>) => {
                state.loading = false;
                const index = state.orders.findIndex(order => order.id === action.payload.id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            });
            builder.addCase(updateOrderStatus.rejected, (state, action:PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
            builder
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            });
            builder.addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter(order => order.id !== action.meta.arg.orderId);
            });
            builder.addCase(deleteOrder.rejected, (state, action:PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default sellerOrderSlice.reducer;