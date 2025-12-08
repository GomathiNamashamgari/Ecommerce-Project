import { Box, Button, TextField, Grid } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddressForm = ({ onSaveAddress }: any) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      pinCode: "",
      address: "",
      locality: "",
      city: "",
      state: "",
    },
    validationSchema: Yup.object({}), // replace with your schema
    onSubmit: (values) => onSaveAddress(values),
  });

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <p className="text-xl font-bold text-center pb-5">Contact Details</p>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField fullWidth label="Name" name="name" value={formik.values.name} onChange={formik.handleChange} />
          </Grid>
          <Grid size={6}>
            <TextField fullWidth label="Mobile" name="mobile" value={formik.values.mobile} onChange={formik.handleChange} />
          </Grid>
          <Grid size={6}>
            <TextField fullWidth label="Pin Code" name="pinCode" value={formik.values.pinCode} onChange={formik.handleChange} />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth label="Address" name="address" value={formik.values.address} onChange={formik.handleChange} />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth label="Locality" name="locality" value={formik.values.locality} onChange={formik.handleChange} />
          </Grid>
          <Grid size={6}>
            <TextField fullWidth label="City" name="city" value={formik.values.city} onChange={formik.handleChange} />
          </Grid>
          <Grid size={6}>
            <TextField fullWidth label="State" name="state" value={formik.values.state} onChange={formik.handleChange} />
          </Grid>
          <Grid size={12}>
            <Button fullWidth type="submit" variant="contained">
              Save Address
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddressForm;
