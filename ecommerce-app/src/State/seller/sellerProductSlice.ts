import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Product } from "../../types/ProductTypes";

export const fetchSellerProducts=createAsyncThunk<Product[],any>(
    "/sellerProduct/fetchSellerProducts",
    async (jwt , { rejectWithValue }) => {
    try {
      const response = await api.get("/sellers/products", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
            const data=await response.data;
            console.log("seller product ", data);
            console.log("Products loaded successfully");
            console.log("full response status: ", response.status);
            return data;
        }
        catch (error) {
            console.log("erroe - - -", error);
            console.error("Failed to load products"); // Notification
            throw error;
        }
    }
);

export const createProduct=createAsyncThunk<Product,{request:any, jwt:string | null}>(
    "/sellerProduct/createProduct",
    async(args, {rejectWithValue})=>{
        const{request, jwt} = args;
        try{
            const response = await api.post(`/sellers/products`, request,{
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            })
            console.log("product created ", response.data);
            console.log("Product created successfully");
            return response.data;
        }
        catch(error){
            console.log("error - - -", error);
             console.error("Failed to create product"); //
            //throw error;
        }
    }
);

interface sellerProductState{
    products: Product[];
    loading: boolean;
    error: string|null|undefined;
}
const initialState: sellerProductState={
    products:[],
    loading:false,
    error:null,
}
const sellerProductSlice = createSlice({
    name:"sellerProduct",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchSellerProducts.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        builder.addCase(fetchSellerProducts.fulfilled,(state,action)=>{
            state.loading=false;
            state.products=action.payload;
             console.log("State updated with products:", state.products)

        })
        builder.addCase(fetchSellerProducts.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
            
        })
        builder.addCase(createProduct.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        builder.addCase(createProduct.fulfilled,(state,action)=>{
            state.loading=false;
            state.products = [...state.products, action.payload];
        })
        builder.addCase(createProduct.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        })
    },
});

export default sellerProductSlice.reducer;
