import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config/Api";
import { User } from "../types/UserTypes";


export const sendLoginSignupOtp = createAsyncThunk(
  "/auth/sendLoginSignupOtp",
  async ({email}:{email:string}, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/sent/login-signup-otp", {email});
      console.log("response", response.data);
       return response.data; // return the data so Redux can use it 
    } catch (error: any) {
      console.log("error - - -", error);
       return rejectWithValue(error.response?.data || "Something went wrong"); 
    }
  }
);

export const signin = createAsyncThunk<any,any>(
  "/auth/signin",
  async (loginRequest, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signin", loginRequest)
      console.log("login otp", response.data);
      localStorage.setItem("jwt",response.data.jwt)
       return response.data.jwt; // return the data so Redux can use it 
    } catch (error: any) {
      console.log("error - - -", error);
      return rejectWithValue(error.response?.data || "Something went wrong"); 
    }
  }
);

export const signup = createAsyncThunk<any,any>(
  "/auth/signup",
  async (signupRequest, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signup", signupRequest)
      console.log("login otp", response.data);
      localStorage.setItem("jwt",response.data.jwt)
       return response.data.jwt; // return the data so Redux can use it 
    } catch (error: any) {
      console.log("error - - -", error);
      return rejectWithValue(error.response?.data || "Something went wrong"); 
    }
  }
);

export const fetchUserProfile = createAsyncThunk<any,any>(
  "/auth/fetchUserProfile",
  async ({jwt}: {jwt?: string}, { rejectWithValue }) => {
    try {
      // fallback to localStorage if jwt is not provided
      const token = jwt || localStorage.getItem("jwt");
      if (!token) throw new Error("No JWT found");

      const response = await api.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("user profile ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error - - -", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);



export const logout=createAsyncThunk<any, any>("/auth/logout",
  async(navigate, {rejectWithValue}) => {
    try {
      localStorage.clear()
      console.log("logout success")
      navigate("/")
    }
    catch (error){
      console.log("error - - - ", error);
    }
  }
)

interface AuthState{
  jwt:string | null,
  otpSent:boolean,
  isLoggedIn:boolean,
  user: User | null,
  loading:boolean,
}

const initialState : AuthState={
  jwt:null,
  otpSent:false,
  isLoggedIn:false,
  user:null,
  loading:false,
}

const authSlice=createSlice({
  name:"auth",
  initialState,
  reducers:{},
  extraReducers:(builder)=>{

    builder.addCase(sendLoginSignupOtp.pending,(state)=>{
      state.loading=true
    })

     builder.addCase(sendLoginSignupOtp.fulfilled,(state)=>{
      state.loading=false
      state.otpSent=true
    })

     builder.addCase(sendLoginSignupOtp.rejected,(state)=>{
      state.loading=false
    })

    builder.addCase(signin.fulfilled,(state,action)=>{
      state.jwt=action.payload
      state.isLoggedIn=true
    })

    builder.addCase(signup.fulfilled,(state,action)=>{
      state.jwt=action.payload
      state.isLoggedIn=true 
    })
    builder.addCase(fetchUserProfile.fulfilled,(state,action)=>{
      state.user=action.payload
      state.isLoggedIn=true
    })
    builder.addCase(logout.fulfilled,(state)=>{
      state.jwt=null
      state.isLoggedIn=false
      state.user=null
    })
  }
})

export default authSlice.reducer;