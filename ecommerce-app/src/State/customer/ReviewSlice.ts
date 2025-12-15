import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { CreateReviewRequest, Review } from "../../types/ReviewTypes";

// Base URL for backend
const API_URL = "/review";

// Fetch reviews by product ID
export const fetchReviewsByProductId = createAsyncThunk(
  "reviews/fetchByProductId",
  async (productId: number) => {
    const response = await axios.get<Review[]>(`${API_URL}/products/${productId}/reviews`);
    return response.data;
  }
);

// Create a new review
export const createReview = createAsyncThunk(
  "reviews/create",
  async ({ productId, review, token }: { productId: number; review: CreateReviewRequest; token: string }) => {
    const response = await axios.post<Review>(
      `${API_URL}/products/${productId}/reviews`,
      review,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data;
  }
);

// Update a review
export const updateReview = createAsyncThunk(
  "reviews/update",
  async ({ reviewId, review, token }: { reviewId: number; review: CreateReviewRequest; token: string }) => {
    const response = await axios.patch<Review>(
      `${API_URL}/reviews/${reviewId}`,
      review,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data;
  }
);

// Delete a review
export const deleteReview = createAsyncThunk(
  "reviews/delete",
  async ({ reviewId, token }: { reviewId: number; token: string }) => {
    await axios.delete(`${API_URL}/review/${reviewId}`, {
      headers: {
        Authorization: token,
      },
    });
    return reviewId;
  }
);

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchReviewsByProductId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByProductId.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsByProductId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch reviews";
      })

      // Create review
      .addCase(createReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.reviews.push(action.payload);
      })

      // Update review
      .addCase(updateReview.fulfilled, (state, action: PayloadAction<Review>) => {
        const index = state.reviews.findIndex(r => r.id === action.payload.id);
        if (index !== -1) state.reviews[index] = action.payload;
      })

      // Delete review
      .addCase(deleteReview.fulfilled, (state, action: PayloadAction<number>) => {
        state.reviews = state.reviews.filter(r => r.id !== action.payload);
      });
  },
});

export default reviewSlice.reducer;
