import React, { useState } from "react";
import { useFormik } from "formik";
import Grid from "@mui/material/Grid";
import { AddPhotoAlternate, Category, Close } from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { uploadToCloudinary } from "../../../Util/UploadtoCloudinary";
import { mainCategory } from "../../../data/category/mainCategory";
import { colors } from "../../../data/Filter/color";
import { menLevelTwo } from "../../../data/category/levelTwo/menLevelTwo";
import { menLevelThree } from "../../../data/category/levelThree/menLevelThree";
import { womenLevelTwo } from "../../../data/category/levelTwo/womenLevelTwo";
import { womenLevelThree } from "../../../data/category/levelThree/womenLevelThree";
import { homeLevelTwo } from "../../../data/category/levelTwo/homeLevelTwo";
import { homeLevelThree } from "../../../data/category/levelThree/homeLevelThree";
import { electronicsLevelTwo } from "../../../data/category/levelTwo/electronicsLevelTwo";
import { electronicsLevelThree } from "../../../data/category/levelThree/electronicsLevelThree";
import { createProduct } from "../../../State/seller/sellerProductSlice";
import { useAppDispatch, useAppSelector } from "../../../State/Store";

// Level Two Mapping
export const categoryTwo: Record<string, any[]> = {
  men: menLevelTwo,
  women: womenLevelTwo,
  home: homeLevelTwo,
  electronics: electronicsLevelTwo,
};

// Level Three Mapping
export const categoryThree: Record<string, any[]> = {
  men: menLevelThree,
  women: womenLevelThree,
  home: homeLevelThree,
  electronics: electronicsLevelThree,
};


const AddProducts = () => {
   const dispatch = useAppDispatch();
   const { loading, error } = useAppSelector((state) => state.sellerProduct); 
  const [uploadImage, setUploadingImage] = useState(false);
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];
    setUploadingImage(true);
    const image = await uploadToCloudinary(file);
    formik.setFieldValue("images", [...formik.values.images, image]);
    setUploadingImage(false);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  const childCategory = (category: any, parentCategoryId: any) => {
    return category.filter((child: any) => {
      return child.parentCategoryId === parentCategoryId;
    });
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      mrpPrice: 0,        // start as number
    sellingPrice: 0, 
    discountPercent:"",
    quantity: 0,
      color: "",
      images: [],
      category: "",
      category2: "",
      category3: "",
      sizes: "",
    },

    onSubmit: (values) => {
      console.log("Form submitted:", values);
      const request = {
    ...values,
    mrpPrice: Number(values.mrpPrice),
    sellingPrice: Number(values.sellingPrice),
    quantity: Number(values.quantity),
  };

  console.log("Form submitted:", request);

  dispatch(createProduct({ request, jwt: localStorage.getItem("jwt") }));
   setOpenSnackbar(true); 
}
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
        <Grid container spacing={2}>
          <Grid className="flex flex-wrap gap-5 " size={{ xs: 12 }}>
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />

            <label className="relative" htmlFor="fileInput">
              <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-400">
                <AddPhotoAlternate className="text-gray-700" />
              </span>
              {uploadImage && (
                <div className="absolute left-0 tight-0 top-0 bttom-0 w-24 h-24 flex justify-between items-center">
                  <CircularProgress />
                </div>
              )}
            </label>

            <div className="flex flex-wrap gap-2">
              {formik.values.images.map((image, index) => (
                <div className="relative">
                  <img
                    className="w-24 h-24 object-cover"
                    key={index}
                    src={image}
                    alt={`ProductImage ${image + 1}`}
                  />

                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    className=""
                    size="small"
                    color="error"
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      outline: "none",
                    }}
                  >
                    <Close sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </div>
              ))}
            </div>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              required
            />
          </Grid>

          <Grid size={{ xs: 12}}>
            <TextField
            fullWidth
              multiline
              rows={4}
              id="description"
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md:4, lg:3 }}>
            <TextField
  fullWidth
  id="mrpPrice"
  name="mrpPrice"
  label="MRP Price"
  value={formik.values.mrpPrice}
  onChange={formik.handleChange}
  error={formik.touched.mrpPrice && Boolean(formik.errors.mrpPrice)}
  helperText={formik.touched.mrpPrice && formik.errors.mrpPrice}
  required
/>

          </Grid>

          <Grid size={{ xs: 12, md:4, lg:3}}>
            <TextField
              fullWidth
              id="sellingPrice"
              name="sellingPrice"
              label="Selling Price"
              value={formik.values.sellingPrice}
              onChange={formik.handleChange}
              error={
                formik.touched.sellingPrice &&
                Boolean(formik.errors.sellingPrice)
              }
              helperText={
                formik.touched.sellingPrice && formik.errors.sellingPrice
              }
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
  <TextField
    fullWidth
    id="discountPerncent"
    name="discountPercent"
    label="Discount (%)"
    value={formik.values.discountPercent}
    onChange={formik.handleChange}
    error={formik.touched.discountPercent && Boolean(formik.errors.discountPercent)}
    helperText={formik.touched.discountPercent && formik.errors.discountPercent}
    required
  />
</Grid>

          <Grid size={{ xs: 12,md:4, lg:4 }}>
            <TextField
              fullWidth
              id="quantity"
              name="quantity"
              label="Quantity"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={formik.touched.quantity && formik.errors.quantity}
              required
            />
          </Grid>
          <Grid size={{ xs: 12,md:4, lg:3 }}>
            <FormControl
              fullWidth
              error={formik.touched.color && Boolean(formik.errors.color)}
              required>

                <InputLabel id="color-label">Color</InputLabel>
                <Select
                labelId="color-label"
                id="color"
                name="color"
                value={formik.values.color}
                onChange={formik.handleChange}
                label="Color">

                  <MenuItem value="">
                  <em>None</em>
                  </MenuItem>

                  {colors.map((color, index) => <MenuItem value={color.name}>
                  <div className="flex gap-3">
                    <span style={{backgroundColor: color.hex}} className={`h-5 w-5 rounded-full 
                    ${color.name === "white" ? "border" : ""}`}></span>
                    <p>{color.name}</p>
                  </div>
                  </MenuItem>)}
                </Select>
                {formik.touched.color && formik.errors.color && (
                  <FormHelperText>{formik.errors.color}</FormHelperText>
                )}
            </FormControl>
          </Grid>
          
          <Grid size={{xs:12,md:4, lg:3}}>
          <FormControl
          fullWidth
          error={formik.touched.sizes && Boolean(formik.errors.sizes)}
            required
            >
            <InputLabel id="sizes-label">Sizes</InputLabel>
            <Select 
            labelId="sizes-label"
            id="sizes"
            name="sizes"
            value={formik.values.sizes}
            onChange={formik.handleChange}
            label="Sizes"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="FREE">FREE</MenuItem>
              <MenuItem value="S">S</MenuItem>
              <MenuItem value="M">M</MenuItem>
              <MenuItem value="L">L</MenuItem>
              <MenuItem value="XL">XL</MenuItem>
              <MenuItem value="XXL">XXL</MenuItem>
            </Select>
            {formik.touched.sizes && formik.errors.sizes && (
              <FormHelperText>{formik.errors.sizes}</FormHelperText>
            )}
            </FormControl>
          </Grid>

          <Grid size={{xs:12,md:4, lg:4}}>
            <FormControl
            fullWidth
            error={formik.touched.category && Boolean(formik.errors.category)}
            required
            >
              <InputLabel id="category-label">Category</InputLabel>
              <Select 
              labelId="category-label"
              id="category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              label="Category"
              >
                {/* <MenuItem value=""><em>None</em></MenuItem> */}
                {mainCategory.map((item) =>(
                  <MenuItem value={item.categoryId}>{item.name}</MenuItem>
                ))}
              </Select>
              {formik.touched.category && formik.errors.category && (
                <FormHelperText>{formik.errors.category}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid size={{xs:12,md:4, lg:4}}>
            <FormControl
            fullWidth
            error={formik.touched.category && Boolean(formik.errors.category)}
            required
            >
              <InputLabel id="category2-label"> Second Category</InputLabel>
              <Select 
              labelId="category2-label"
              id="category2"
              name="category2"
              value={formik.values.category2}
              onChange={formik.handleChange}
              label="Second Category"
              >
                {/* <MenuItem value=""><em>None</em></MenuItem> */}
                {formik.values.category &&
                categoryTwo[formik.values.category]?.map((item: any) =>(
                  <MenuItem value={item.categoryId}>{item.name}</MenuItem>
                ))}
              </Select>
              {formik.touched.category && formik.errors.category && (
                <FormHelperText>{formik.errors.category}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid size={{xs:12,md:4, lg:4}}>
            <FormControl
            fullWidth
            error={formik.touched.category && Boolean(formik.errors.category)}
            required
            >
              <InputLabel id="category3-label">Third Category</InputLabel>
              <Select 
              labelId="category3-label"
              id="category3"
              name="category3"
              value={formik.values.category3}
              onChange={formik.handleChange}
              label="Third Category"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {formik.values.category2 && 
                childCategory(
                  categoryThree[formik.values.category],
                  formik.values.category2
                )?.map((item: any) =>(
                  <MenuItem value={item.categoryId}>{item.name}</MenuItem>
                ))}
              </Select>
              {formik.touched.category && formik.errors.category && (
                <FormHelperText>{formik.errors.category}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid size={{xs:12}}>
            <Button sx={{p:"14px"}}
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={loading}
            >
              {loading ? <CircularProgress size="small"
              sx={{width:"27px", height:"27px"}}/> : "AddProduct"}
            </Button>
          </Grid>
        </Grid>
      </form>
       <Snackbar
      anchorOrigin={{vertical:"top",horizontal:"right"}}
      open={snackbarOpen} autoHideDuration={6000}
      onClose={handleCloseSnackbar}
      >
        <Alert
        onClose={handleCloseSnackbar}
        severity={error ? "error" : "success"}
        variant="filled"
        sx={{width:'100%'}}
        >
          {error ? error : "Product created successfully"}
        </Alert>
      </Snackbar> 
    </div>
  );
};

export default AddProducts;
