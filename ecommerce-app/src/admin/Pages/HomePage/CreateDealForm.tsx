import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { clearDealStatus, createDeal } from "../../../State/admin/DealSlice";

const CreateDealForm = () => {
  const dispatch = useAppDispatch();

  // Only select the slices you need → prevents "Selector unknown returned the root state" warning
  const deals = useAppSelector((state) => state.deal.deals);
  const dealCreated = useAppSelector((state) => state.deal.dealCreated);
  const error = useAppSelector((state) => state.deal.error);

  const dealCategories =
  useAppSelector((state) => state.customer.homePageData?.dealCategories) || [];


  const formik = useFormik({
    initialValues: {
      discount: 0,
      category: "",
    },
    onSubmit: (values) => {
      // Check if deal for this category already exists
      const existingDeal = deals.find((d) => d.category.id === values.category);
      if (existingDeal) {
        alert("A deal for this category already exists!");
        return;
      }

      const reqData = {
        discount: Number(values.discount), // ensure number
        category: { id: values.category },
      };

      dispatch(createDeal(reqData))
  .unwrap()
  .then(() => {
    alert("Deal created successfully!");
    dispatch(clearDealStatus()); // now works
    formik.resetForm();
  })
  .catch((err) => alert("Error creating deal: " + err));
    },
  });

  return (
    <Box component={"form"} onSubmit={formik.handleSubmit} className="space-y-6">
      <Typography variant="h4" className="text-center">
        Create Deal
      </Typography>

      <TextField
        fullWidth
        name="discount"
        label="Discount"
        type="number"
        value={formik.values.discount}
        onChange={formik.handleChange}
        error={formik.touched.discount && Boolean(formik.errors.discount)}
        helperText={formik.touched.discount && formik.errors.discount}
      />

      <FormControl fullWidth>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={formik.values.category}
          label="Category"
          name="category"
          onChange={formik.handleChange}
        >
          {dealCategories.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button fullWidth sx={{ py: ".9rem" }} type="submit" variant="contained">
        Create Deal
      </Button>

      {error && <Typography color="error">{error}</Typography>}
      {dealCreated && <Typography color="success.main">Deal created successfully!</Typography>}
    </Box>
  );
};

export default CreateDealForm;
