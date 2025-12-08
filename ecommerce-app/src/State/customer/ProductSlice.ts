import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Product } from "../../types/ProductTypes";

const API_URL="/products";

export const fetchProductById = createAsyncThunk<any, number>(
  "products/fetchProductById",
  async (ProductId, { rejectWithValue }) => {
    // Add validation here
   /*  if (!ProductId || isNaN(ProductId) || ProductId <= 0) {
      console.error("❌ Invalid ProductId:", ProductId);
      return rejectWithValue("Invalid product ID provided");
    }
 */
    try {
      const response = await api.get(`${API_URL}/${ProductId}`);
      const data = response.data;  // No need for await here, as response.data is already resolved
      console.log("data ", data);
      return data;
    } catch (error: any) {
      console.log("error - - - ", error);
      // Extract a cleaner error message for the state
      const errorMessage = error?.response?.data?.message || error.message || "Failed to fetch product";
      return rejectWithValue(errorMessage);
    }
  }
);

export const searchProduct=createAsyncThunk("products/searchProduct",
    async(query, {rejectWithValue})=>{
        try {
            const response=await api.get(`${API_URL}/search`,{
                params: {
                    query,
                },
            });
            const data = await response.data;
            console.log("search product data ", data)
            return data;
        }
        catch (error){
            console.log("error - - - ", error)
            rejectWithValue(error)
        }
    }
)

export const fetchAllProducts=createAsyncThunk<any, any>("products/fetchAllProducts",
    async(params, {rejectWithValue})=>{
        try {
            const response=await api.get(`${API_URL}`,{
                params: {
                    ...params,
                    pageNumber:params.pageNumber || 0
                }
        });
            const data = await response.data;
            console.log(" All Product data ", data)
            return data;
        }
        catch (error){
            console.log("error - - - ", error)
            rejectWithValue(error)
        }
    }
)

interface ProductState{
    product : Product | null;
    products: Product[];
    searchProduct:Product[];
    totalPages:number;
    loading: boolean;
    error:string|null|undefined |any;
    
}

const initialState:ProductState={
    product:null,
    products:[],
    totalPages:1,
    loading:false,
    error:null,
    searchProduct:[],
}

const ProductSlice=createSlice({
    name: "products",
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder.addCase(fetchProductById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchProductById.fulfilled, (state,action) => {
            state.loading = false;
            state.product=action.payload;
        });
         builder.addCase(fetchProductById.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(searchProduct.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(searchProduct.fulfilled, (state, action) => {
  state.loading = false;
  state.searchProduct = action.payload;  // ✅ Fixed: Use the correct state property
});
         builder.addCase(searchProduct.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(fetchAllProducts.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchAllProducts.fulfilled, (state,action) => {
            state.loading = false;
            const content = action.payload.content || action.payload || [];
      state.products = content;
        });
         builder.addCase(fetchAllProducts.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
})

export default ProductSlice.reducer;