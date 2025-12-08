import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { HomeCategory } from "../../types/HomeCategoryTypes";

const API_URL = "/admin";

/* ----------------------------------------------
   UPDATE HOME CATEGORY
---------------------------------------------- */
export const updateHomeCategory = createAsyncThunk<
    HomeCategory,                                // return type
    { id: number; data: HomeCategory }           // argument type
>(
    "homeCategory/updateHomeCategory",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`${API_URL}/home-category/${id}`, data);
            console.log("category updated", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error", error);
            return rejectWithValue(
                error.response?.data || "An error occurred while updating home category."
            );
        }
    }
);

/* ----------------------------------------------
   FETCH ALL HOME CATEGORIES
---------------------------------------------- */
export const fetchHomeCategories = createAsyncThunk<
    HomeCategory[],   // return type
    void              // NO arguments
>(
    "homeCategory/fetchHomeCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/home-category`);
            console.log("categories fetched", response.data);
            return response.data;
        } catch (error: any) {
            console.log("error", error.response);
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch home categories."
            );
        }
    }
);

/* ----------------------------------------------
   SLICE STATE
---------------------------------------------- */
interface HomeCategoryState {
    categories: HomeCategory[];
    loading: boolean;
    error: string | null;
    categoryUpdated: boolean;
}

const initialState: HomeCategoryState = {
    categories: [],
    loading: false,
    error: null,
    categoryUpdated: false,
};

/* ----------------------------------------------
   SLICE
---------------------------------------------- */
const homeCategorySlice = createSlice({
    name: "homeCategory",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        
        /* -------- Update Category -------- */
        builder.addCase(updateHomeCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.categoryUpdated = false;
        });

        builder.addCase(updateHomeCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.categoryUpdated = true;

            const updated = action.payload;

            // Find the category by ID
            const index = state.categories.findIndex(
                (category) => category.id === updated.id
            );

            if (index !== -1) {
                // Update existing category
                state.categories[index] = updated;
            } else {
                // Push if it's new
                state.categories.push(updated);
            }
        });

        builder.addCase(updateHomeCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        /* -------- Fetch Categories -------- */
        builder.addCase(fetchHomeCategories.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(fetchHomeCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = action.payload;
        });

        builder.addCase(fetchHomeCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default homeCategorySlice.reducer;
