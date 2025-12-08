import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";

export const fetchSellerProfile = createAsyncThunk(
  "/sellers/fetchSellerProfile",
  async (jwt: string, { rejectWithValue }) => {
    try {
      const response = await api.get("sellers/profile", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("fetch seller profile", response.data);
      return response.data; // return the data so Redux can use it
    } catch (error: any) {
      console.log("error - - -", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

interface SellerState{
    sellers: any[],
    selectedSeller:any,
    profile: any,
    report: any,
    loading: boolean,
    error: any
}

const initialState:SellerState={
    sellers:[],
    selectedSeller:null,
    profile:null,
    report:null,
    loading: false,
    error:null,
}

const sellerSlice=createSlice({
    name:"sellers",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchSellerProfile.pending,(state)=>{
            state.loading=true;
        })
        .addCase(fetchSellerProfile.fulfilled,(state, action)=>{
            state.loading=false;
            state.profile=action.payload;
        })
        .addCase(fetchSellerProfile.rejected,(state, action)=>{
            state.loading=false;
            state.error=action.payload;
        })
    }
})

export default sellerSlice.reducer;