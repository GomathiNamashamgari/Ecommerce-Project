import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendLoginSignupOtp, signin } from "../../../State/AuthSlice";
import { sellerLogin } from "../../../State/seller/sellerAuthSlice";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
// 👆 adjust the path if you defined the thunk inside sellerSlice.ts

const SellerLoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { auth } = useAppSelector((store) => store);
  const sellerAuth = useAppSelector((store) => store.seller); // or store.sellerAuth

  // Redirect to seller dashboard after successful login
  useEffect(() => {
    navigate("/seller")
  })

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    onSubmit: (values) => {
      console.log("form data", values);
      dispatch(sellerLogin(values))
    },
  });

  const handleSendOtp = () => {
  dispatch(sendLoginSignupOtp({ email: formik.values.email }));  // Add role here
};
const handleLogin=()=>{
  //dispatch(signin)
}

  return (
    <div>
      <h1 className="text-center font-bold text-xl text-primary-color pb-5">
        Login As Seller
      </h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-5">
          <TextField
            fullWidth
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched?.email && Boolean(formik.errors?.email)}
            helperText={formik.touched?.email && formik.errors?.email}
          />

          {true && (
            <div className="space-y-2">
              <p className="font-medium text-sm opacity-60">
                Enter OTP sent to your email
              </p>
              <TextField
                fullWidth
                name="otp"
                label="Otp"
                value={formik.values.otp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched?.otp && Boolean(formik.errors?.otp)}
                helperText={formik.touched?.otp && formik.errors?.otp}
              />
            </div>
          )}

          <Button
            onClick={handleSendOtp}
            fullWidth
            variant="contained"
            sx={{ py: "11px" }}
          >
            Send Otp
          </Button>

          <Button type="submit" 
          fullWidth variant="contained" sx={{ py: "11px" }}>
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SellerLoginForm;
