import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { sendLoginSignupOtp } from '../../../State/AuthSlice';
import { useAppDispatch } from '../../../State/Store';

const RegisterForm = () => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
      fullname: "",
      mobile: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log("form data", values);
    },
  });

  const handleSendOtp = () => {
    dispatch(sendLoginSignupOtp({ email: formik.values.email }));
  };

  return (
    <div>
      <h1 className="text-center font-bold text-xl text-primary-color pb-8">
        Signup
      </h1>

      <form onSubmit={formik.handleSubmit} className="space-y-3">

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

        {/* OTP */}
        <div className="space-y-3">
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

          {/* SEND OTP BUTTON */}
          <Button
            onClick={handleSendOtp}
            fullWidth
            variant="contained"
            sx={{ py: "11px" }}
          >
            Send Otp
          </Button>
        </div>

        {/* FULL NAME */}
        <TextField
          fullWidth
          name="fullname"
          label="Full Name"
          value={formik.values.fullname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched?.fullname && Boolean(formik.errors?.fullname)}
          helperText={formik.touched?.fullname && formik.errors?.fullname}
        />

        {/* MOBILE */}
        <TextField
          fullWidth
          name="mobile"
          label="Mobile"
          value={formik.values.mobile}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched?.mobile && Boolean(formik.errors?.mobile)}
          helperText={formik.touched?.mobile && formik.errors?.mobile}
        />

        {/* PASSWORD */}
        <TextField
          fullWidth
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched?.password && Boolean(formik.errors?.password)}
          helperText={formik.touched?.password && formik.errors?.password}
        />

        {/* SIGNUP */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ py: "11px" }}
        >
          Signup
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
