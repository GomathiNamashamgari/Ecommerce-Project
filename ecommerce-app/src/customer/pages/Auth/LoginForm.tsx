import { Button, TextField, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { sendLoginSignupOtp, signin } from '../../../State/AuthSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((store) => store);

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    onSubmit: (values) => {
      console.log("form data", values);

      const loginPayload = {
        email: values.email,
        otp: Number(values.otp), // convert otp to number
      };

      dispatch(signin(loginPayload));
    },
  });

  const handleSendOtp = () => {
    if (!formik.values.email.trim()) {
      alert("Please enter your email first");
      return;
    }
    dispatch(sendLoginSignupOtp({ email: formik.values.email }));
  };

  return (
    <div>
      <h1 className="text-center font-bold text-xl text-primary-color pb-8">
        Login
      </h1>

      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-5">

          {/* EMAIL */}
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

          {/* OTP FIELD (only show after OTP sent) */}
          {auth.otpSent && (
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

          {/* BUTTONS */}
          {!auth.otpSent ? (
            <Button
              onClick={handleSendOtp}
              fullWidth
              variant="contained"
              sx={{ py: "11px" }}
              disabled={!formik.values.email} // disable if email empty
            >
              {auth.loading ? <CircularProgress size={22} /> : "Send Otp"}
            </Button>
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ py: "11px" }}
              disabled={!formik.values.otp} // require otp
            >
              Login
            </Button>
          )}

        </div>
      </form>
    </div>
  );
};

export default LoginForm;
