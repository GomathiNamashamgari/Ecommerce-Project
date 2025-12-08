import { useMediaQuery, useTheme, Box, IconButton, Divider } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import FilterSection from './FilterSection';
import ProductCard from './ProductCard';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { fetchAllProducts } from '../../../State/customer/ProductSlice';
import { useParams, useSearchParams } from 'react-router-dom';

const Product = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));

  // FIX 1: Initialize sort state to empty string
  const [sort, setSort] = useState<string>("");

  const [page, setPage] = useState(1);

   const dispatch = useAppDispatch()
   const [searchParam, setSearchParams]= useSearchParams();
   const {category}= useParams();
   const { product } = useAppSelector((store => store))

  const handleSortChange = (event: any) => {
    setSort(event.target.value);
  };

  const handlePageChange = (value: number) => {
    setPage(value);
  };

  useEffect(()=>{
    const [minPrice, maxPrice] = searchParam.get("price")?.split("-") || [];
    const color=searchParam.get("color");
    const minDiscount=searchParam.get("discount")?Number(searchParam.get("discount")):undefined;
    const pageNumber= page-1;

    const newFilter = {
      category,
      color:color ||"",
      minPrice : minPrice?Number(minPrice):undefined,
      maxPrice : maxPrice?Number(maxPrice):undefined,
      minDiscount,
      page: pageNumber,
      sort
    }
    dispatch(fetchAllProducts(newFilter))
  },[category,searchParam,page,sort, dispatch])

  //const { category } = useParams<{ category: string }>();

// Helper to format category nicely
/* const formatCategory = (cat?: string) => {
  if (!cat) return "";
  return cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}; */
const formatCategory = (cat?: string) => {
  if (!cat) return "";
  // remove prefixes like "men_" or "women_"
  let cleaned = cat.replace(/^men_/, "").replace(/^women_/, "");
  // replace underscores with hyphens
  cleaned = cleaned.replace(/_/g, "-");
  // only capitalize the first letter, keep the rest lowercase
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
};


  return (
    <div className="-z-10 mt-10">
      <div>
        <h1 className="text-3xl text-center font-bold text-gray-700 pb-5 px-9 uppercase space-x-2">
          {formatCategory(category)}

        </h1>
      </div>

      <div className="lg:flex">
        <section className="filter_section hidden lg:block w-[20%]">
          <FilterSection />
        </section>

        <div className="w-full lg:w-[80%] space-y-5">
          <div className="flex justify-between items-center px-9 h-[40px]">
            <div className="relative w-[50%]">
              {!isLarge && (
                <IconButton>
                  <FilterAltIcon />
                </IconButton>
              )}
              {!isLarge && (
                <Box>
                  <FilterSection />
                </Box>
              )}
            </div>

            {/* Sort dropdown */}
            <FormControl size="small" sx={{ width: '200px' }}>
              <InputLabel id="sort-select-label">Sort</InputLabel>
              <Select
                labelId="sort-select-label"
                id="sort-select"
                value={sort}
                label="Sort"
                onChange={handleSortChange}
              >
                <MenuItem value="price_low">Price: Low - High</MenuItem>
                <MenuItem value="price_high">Price: High - Low</MenuItem>
              </Select>
            </FormControl>
          </div>

          <Divider />

          {/* FIX 2: Add key to mapped items */}
          <section className="products_section grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 px-5 justify-center">
            {product.products.map((item, index) => (
              <ProductCard item = {item} />
            ))}
          </section>

          <div className="flex justify-center py-10">
            <Pagination
              onChange={(e, value) => handlePageChange(value)}
              count={10}
              variant="outlined"
              color="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
