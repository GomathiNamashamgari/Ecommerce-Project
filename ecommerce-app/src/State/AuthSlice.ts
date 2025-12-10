import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config/Api";
import { User } from "../types/UserTypes";

// Send Login/Signup OTP
export const sendLoginSignupOtp = createAsyncThunk(
  "/auth/sendLoginSignupOtp",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/sent/login-signup-otp", { email });
      console.log("OTP response:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error - - -", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Signin
export const signin = createAsyncThunk<any, any>(
  "/auth/signin",
  async (loginRequest, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signin", loginRequest);
      console.log("Signin response:", response.data);

      const jwt = response.data.token || response.data.jwt;
      localStorage.setItem("jwt", jwt);

      return jwt;
    } catch (error: any) {
      console.log("error - - -", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Signup
export const signup = createAsyncThunk<any, any>(
  "/auth/signup",
  async (signupRequest, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signup", signupRequest);
      console.log("Signup response:", response.data);

      const jwt = response.data.token || response.data.jwt;
      localStorage.setItem("jwt", jwt);

      return jwt;
    } catch (error: any) {
      console.log("error - - -", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Fetch User Profile
export const fetchUserProfile = createAsyncThunk<any, any>(
  "/auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("No JWT found");

      console.log("JWT sent:", token);

      const response = await api.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("User profile:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error - - -", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Logout
export const logout = createAsyncThunk<any, any>(
  "/auth/logout",
  async (navigate: any, { rejectWithValue }) => {
    try {
      localStorage.removeItem("jwt");
      console.log("Logout success");
      navigate("/");
    } catch (error) {
      console.log("error - - - ", error);
      return rejectWithValue(error);
    }
  }
);

// Auth State
interface AuthState {
  jwt: string | null;
  otpSent: boolean;
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  jwt: localStorage.getItem("jwt"),
  otpSent: false,
  isLoggedIn: !!localStorage.getItem("jwt"),
  user: null,
  loading: false,
};

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(sendLoginSignupOtp.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(sendLoginSignupOtp.fulfilled, (state) => {
      state.loading = false;
      state.otpSent = true;
    });
    builder.addCase(sendLoginSignupOtp.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(signin.fulfilled, (state, action) => {
      state.jwt = action.payload;
      state.isLoggedIn = true;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.jwt = action.payload;
      state.isLoggedIn = true;
    });

    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.jwt = null;
      state.isLoggedIn = false;
      state.user = null;
    });
  },
});

export default authSlice.reducer;
