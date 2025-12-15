import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { createCoupon, resetCouponState } from "../../../State/customer/CouponSlice";

interface CouponFormValues {
  code: string;
  discountPercentage: number;
  validityStartDate: Dayjs | null;
  validityEndDate: Dayjs | null;
  minimumOrderValue: number;
}

const AddNewCouponForm = () => {
  const dispatch = useAppDispatch();
  const { coupons} = useAppSelector(store => store);
  const jwt = localStorage.getItem("jwt") || "";
   const [loading, setLoading] = useState(false)

  const formik = useFormik<CouponFormValues>({
    initialValues: {
      code: "",
      discountPercentage: 0,
      validityStartDate: null,
      validityEndDate: null,
      minimumOrderValue: 0,
    },
    onSubmit: (values, { resetForm }) => {
      const payload = {
        code: values.code,
        discountPercentage: values.discountPercentage,
        validityStartDate: dayjs(values.validityStartDate).toISOString(),
        validityEndDate: dayjs(values.validityEndDate).toISOString(),
        minimumOrderValue: values.minimumOrderValue,
        active: true,
      };

      dispatch(createCoupon({ coupon: payload as any, jwt }));
      resetForm();
    },
  });

  useEffect(() => {
    if (coupons) {
      dispatch(resetCouponState());
    }
  }, [coupons, dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-color pb-5 text-center">
        Create New Coupon
      </h1>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12} >
              <TextField
                fullWidth
                label="Coupon Code"
                name="code"
                value={formik.values.code}
                onChange={formik.handleChange}
                required
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                type="number"
                label="Discount %"
                name="discountPercentage"
                value={formik.values.discountPercentage}
                onChange={formik.handleChange}
                required
              />
            </Grid>

            <Grid size={12} >
              <DatePicker
                label="Start Date"
                value={formik.values.validityStartDate}
                onChange={(value) =>
                  formik.setFieldValue("validityStartDate", value)
                }
                sx={{ width: "100%" }}
              />
            </Grid>

            <Grid size={12} >
              <DatePicker
                label="End Date"
                value={formik.values.validityEndDate}
                onChange={(value) =>
                  formik.setFieldValue("validityEndDate", value)
                }
                sx={{ width: "100%" }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                type="number"
                label="Minimum Order Value"
                name="minimumOrderValue"
                value={formik.values.minimumOrderValue}
                onChange={formik.handleChange}
                required
              />
            </Grid>

            <Grid size={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ py: 1 }}
              >
                Create Coupon
              </Button>
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
    </div>
  );
};

export default AddNewCouponForm;
