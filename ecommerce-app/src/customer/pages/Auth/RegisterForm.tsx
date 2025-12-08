import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react'
import { sendLoginSignupOtp } from '../../../State/AuthSlice';
import { useAppDispatch } from '../../../State/Store';

const RegisterForm = () => {
    const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
      fullname: "",  // Added
      mobile: "",  // Added
      password: "",  // Added
    },
    onSubmit: (values) => {
      console.log("form data", values);
      //values.otp=Number(value.otp)
    },
  });

  const handleSendOtp = () => {
  dispatch(sendLoginSignupOtp({ email: formik.values.email }));  // Add role here
};

  return (
    <div>
        <h1 className='text-center font-bold text-xl text-primary-color pb-8'>Signup</h1>

        <div className="space-y-3">
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
            </div>
        )}

        <TextField
            fullWidth
            name="fallname"  // Added
            label="Full Name"  // Added
            value={formik.values.fullname}  // Added
            onChange={formik.handleChange}  // Added
            onBlur={formik.handleBlur}  // Added
            error={formik.touched?.fullname && Boolean(formik.errors?.fullname)}  // Added
            helperText={formik.touched?.fullname && formik.errors?.fullname}  // Added
          />

          <TextField
            fullWidth
            name="mobile"  // Added
            label="Mobile"  // Added
            value={formik.values.mobile}  // Added
            onChange={formik.handleChange}  // Added
            onBlur={formik.handleBlur}  // Added
            error={formik.touched?.mobile && Boolean(formik.errors?.mobile)}  // Added
            helperText={formik.touched?.mobile && formik.errors?.mobile}  // Added
          />
          <TextField
            fullWidth
            name="password"  // Added
            label="Password"  // Added
            type="password"  // Added for security
            value={formik.values.password}  // Added
            onChange={formik.handleChange}  // Added
            onBlur={formik.handleBlur}  // Added
            error={formik.touched?.password && Boolean(formik.errors?.password)}  // Added
            helperText={formik.touched?.password && formik.errors?.password}  // Added
          />

          {false && <Button
            onClick={handleSendOtp}
            fullWidth
            variant="contained"
            sx={{ py: "11px" }}
          >
            Send Otp
          </Button>}

          <Button type="submit" 
          fullWidth variant="contained" sx={{ py: "11px" }}>
            Signup
          </Button>
        </div>
    </div>
  )
}

export default RegisterForm