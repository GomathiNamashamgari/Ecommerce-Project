import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { HomeData, HomeCategory } from "../../types/HomeCategoryTypes";

/* export const fecthHomePageData = createAsyncThunk<HomeData>(
    'home/fetchHomePageData',
    async (_, { rejectWithValue}) => {
        try{
            const response = await api.get(`/home-page`);
            console.log("home-page ", response.data)
            return response.data;
        }catch(error:any){
            const errorMessge = error.response.data?.message || error.message ||'Failed to fetch home-page';
            console.log("error ",errorMessge,error)
            return rejectWithValue(errorMessge);
        }
    }
); */

export const createHomeCategories = createAsyncThunk<HomeData, HomeCategory[]>(
    'home/createHomeCategories',
    async (homeCategories, { rejectWithValue }) => {
        try {
            const response = await api.post(`/home/categories`, homeCategories);
            console.log("home categories created ", response.data)
            return response.data;
        } catch(error: any){
            const errorMessge = error.response.data?.message || error.message || "Failed to create Home Categories";
            console.log("error ", errorMessge, error)
            return rejectWithValue(errorMessge)
        }
    }
);

interface HomeState {
    homePageData : HomeData | null;
    homeCategories: HomeCategory[];
    loading: boolean;
    error: string |null;
}
const initialState: HomeState = {
    homePageData: null,
    homeCategories:[],
    loading:false,
    error:null,

}

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers:{},
    extraReducers: (builder) =>{
        /* builder.addCase(fecthHomePageData.pending,(state) =>{
            state.error = null;
        });
        builder.addCase(fecthHomePageData.fulfilled, (state, action: PayloadAction<HomeData>) =>{
            state.loading = false;
            state.homePageData = action.payload;
        });
        builder.addCase(fecthHomePageData.rejected, (state, action) =>{
            state.loading=false;
            state.error=action.error.message || 'Failed to load home page data';
        }); */
        builder.addCase(createHomeCategories.pending, (state) =>{
            state.loading= true;
            state.error= null;
        });
        builder.addCase(createHomeCategories.fulfilled, (state, action)=> {
            state.loading=false;
            state.homePageData =  action.payload;
        });
        builder.addCase(createHomeCategories.rejected, (state, action) => {
            state.loading=false;
            state.error = action.error.message || 'Failed to create home Categories';
        });
    },
});

export default homeSlice.reducer;
