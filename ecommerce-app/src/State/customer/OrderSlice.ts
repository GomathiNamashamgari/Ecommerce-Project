import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../config/Api";
import { Order, OrderItem, OrderState } from "../../types/OrderTypes";
import { Address } from "../../types/UserTypes";
import { RootState } from "../Store";

const initialState: OrderState = {
    order: [],
    orderItems: null,
    currentOrder: null,
    paymentOrder: null,
    loading: false,
    error: null,
    orderCanceled: false,
};

const API_URL = "/orders";

export const fetchUserOrderHistory = createAsyncThunk<Order[], string>(
    "orders/fetchUserOrderHistory",
    async (jwt, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/user`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            console.log("order History fetched ", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error ", error.response);
            return rejectWithValue("failed to fetch user order history");
        }
    }
);

export const fetchOrderById = createAsyncThunk<Order, { jwt: string; orderId: number }>(
    "orders/fetchOrderById",
    async ({ jwt, orderId }, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/${orderId}`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            console.log("order fetched ", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error ", error.response);
            return rejectWithValue("failed to fetch order by id");
        }
    }
);

export const createOrder = createAsyncThunk<any, { address: Address; jwt: string; paymentGateway: string }>(
    "orders/createOrder",
    async ({ address, jwt, paymentGateway }, { rejectWithValue }) => {
        // ADDED: Input validation to prevent invalid requests causing 400s.
        if (!address || !address.locality|| !jwt || !paymentGateway) {
            return rejectWithValue("Invalid input: address, jwt, or paymentGateway missing");
        }

        try {
            const response = await api.post(`${API_URL}`, address, {
                headers: { Authorization: `Bearer ${jwt}` },
                params: { paymentMethod: paymentGateway }
            });
            console.log("order created ", response.data);
            if (response.data.payment_link_url) {
                // CHANGED: Use window.location.href for better mobile compatibility (avoids webview issues that skip OTP).
                window.location.href = response.data.payment_link_url;
                //window.open(response.data.payment_link_url, '_blank');
                // Note: After redirect, handle in a component (e.g., check URL params and dispatch paymentSuccess).
            } else {
                // ADDED: Better error handling for missing payment link.
                return rejectWithValue("Payment link URL not found in response");
            }
            return response.data;
        } catch (error: any) {
            // ADDED: Capture server error details for debugging 400s.
            console.log("error ", error.response);
            return rejectWithValue(error.response?.data?.message || "failed to create order");
        }
    }
);

export const fetchOrderItemById = createAsyncThunk<OrderItem, { jwt: string; orderItemId: number }>(
    "orders/fetchOrderItemById",
    async ({ jwt, orderItemId }, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/item/${orderItemId}`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            console.log("order item fetched ", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error ", error.response);
            return rejectWithValue("failed to fetch order item by id");
        }
    }
);

// In OrderSlice.ts, update the paymentSuccess thunk:
export const paymentSuccess = createAsyncThunk<any,
  { orderId: string; paymentId: string; paymentLinkId: string; jwt: string },
  { rejectValue: string }
>(
  "orders/paymentSuccess",
  async ({ orderId, paymentId, paymentLinkId, jwt }, { rejectWithValue }) => {
    if (!orderId || !paymentId || !paymentLinkId || !jwt) {
      return rejectWithValue("Invalid input: missing orderId, paymentId, paymentLinkId, or jwt");
    }

    // Small delay for Razorpay settling
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // CHANGED: Use full backend URL to bypass proxy
      const response = await api.get(`/payment-success/${orderId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
        params: { razorpay_payment_id: paymentId, razorpay_payment_link_id: paymentLinkId }
      });
      console.log("Payment Success!", response.data);
      return response.data;
    } catch (error: any) {
      console.log("Payment verification error:", error);
      if (error.code === 'ERR_TOO_MANY_REDIRECTS' || error.response?.status === 429) {
        console.log("Retrying in 2 seconds...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
          const retryResponse = await axios.get(`/payment-success/${orderId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
            params: { razorpay_payment_id: paymentId, razorpay_payment_link_id: paymentLinkId }
          });
          return retryResponse.data;
        } catch (retryError: any) {
          return rejectWithValue(retryError.response?.data?.message || "Retry failed");
        }
      }
      return rejectWithValue(error.response?.data?.message || "Payment verification failed");
    }
  }
);


export const cancelOrder = createAsyncThunk<Order, { orderId: number; jwt: string }>(
    "orders/cancelOrder",
    async ({ orderId, jwt }, { rejectWithValue }) => {
        try {
            const response = await api.put(`${API_URL}/${orderId}/cancel`, {}, {
                // CHANGED: Pass JWT as parameter instead of localStorage for consistency.
                headers: { Authorization: `Bearer ${jwt}` },
            });
            console.log("order canceled ", response.data);
            return response.data;
        } catch (error: any) {
            // ADDED: Capture server error details.
            console.log("error ", error.response);
            return rejectWithValue(error.response?.data?.message || "failed to cancel order");
        }
    }
);

const OrderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserOrderHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.orderCanceled = false;
            })
            .addCase(fetchUserOrderHistory.fulfilled, (state, action: PayloadAction<Order[]>) => {
                state.order = action.payload;
                state.loading = false;
            })
            .addCase(fetchUserOrderHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
                state.currentOrder = action.payload;
                state.loading = false;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action: PayloadAction<any>) => {
                state.paymentOrder = action.payload;
                state.loading = false;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchOrderItemById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderItemById.fulfilled, (state, action) => {
                state.loading = false;
                // CHANGED: Accumulate order items instead of overwriting.
                state.orderItems = state.orderItems ? [...state.orderItems, action.payload] : [action.payload];
            })
            .addCase(fetchOrderItemById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(paymentSuccess.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(paymentSuccess.fulfilled, (state, action) => {
                state.loading = false;
                console.log("payment successful :", action.payload);
            })
            .addCase(paymentSuccess.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(cancelOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.orderCanceled = false;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = state.order.map((order) =>
                    order.id === action.payload.id ? action.payload : order
                );
                state.orderCanceled = true;
                state.currentOrder = action.payload;
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default OrderSlice.reducer;

// ADDED: Uncommented selectors for better state access.
export const selectOrders = (state: RootState) => state.order.order;
export const selectCurrentOrder = (state: RootState) => state.order.currentOrder;
export const selectPaymentOrder = (state: RootState) => state.order.paymentOrder;
export const selectOrdersLoading = (state: RootState) => state.order.loading;
export const selectOrdersError = (state: RootState) => state.order.error;