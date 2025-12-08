import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { thunk } from "redux-thunk";
import adminSellerSlice from "./admin/adminSellerSlice";
import adminSlice from "./admin/adminSlice";
import DealSlice from "./admin/DealSlice";
import AuthSlice from "./AuthSlice";
import CartSlice from "./customer/CartSlice";
import CustomerSlice from "./customer/CustomerSlice";
import OrderSlice from "./customer/OrderSlice";
import ProductSlice from "./customer/ProductSlice";
import WishlistSlice from "./customer/WishlistSlice";
import sellerOrderSlice from "./seller/sellerOrderSlice";
import sellerProductSlice from "./seller/sellerProductSlice";
import sellerSlice from "./seller/sellerSlice";
import transactionSlice from "./seller/transactionSlice";



const rootReducer=combineReducers({
    seller:sellerSlice,
    sellerProduct:sellerProductSlice,
    product:ProductSlice,
    auth:AuthSlice,
    cart: CartSlice,
    order: OrderSlice,
    wishlist: WishlistSlice,
    customer:CustomerSlice,

    sellerOrder: sellerOrderSlice,
    transaction: transactionSlice,

    admin:adminSlice,
    deal:DealSlice,
    adminSeller:adminSellerSlice,
})

const store=configureStore({
    reducer:rootReducer,
    /* middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(thunk) */
})

export type AppDispatch=typeof store.dispatch;
export type RootState=ReturnType<typeof rootReducer>;

export const useAppDispatch=()=>useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState>=useSelector;

export default store;