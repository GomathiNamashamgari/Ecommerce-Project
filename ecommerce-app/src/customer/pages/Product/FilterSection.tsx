import { Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Divider } from '@mui/material';
import { pink, teal } from '@mui/material/colors';
import React, { useState } from 'react';
import { colors } from '../../../data/Filter/color';
import { discount } from '../../../data/Filter/discount'; // Example: [{ name: '10%', value: '10' }, { name: '20%', value: '20' }, ...]
import { price } from '../../../data/Filter/price'; // Example: [{ name: '0-100', value: '0-100' }, { name: '100-500', value: '100-500' }, ...]
import { useSearchParams } from 'react-router-dom';

const FilterSection = () => {
  const [expendColor, setExpendColor] = useState(false);
  const [expendDiscount, setExpendDiscount] = useState(false); // New state for discount expansion
  const [expendPrice, setExpendPrice] = useState(false); // New state for price expansion
  const [searchParams, setSearchParams] = useSearchParams();

  const handleColorToggle = () => {
    setExpendColor(!expendColor);
  };

  const handleDiscountToggle = () => { // New toggle for discount
    setExpendDiscount(!expendDiscount);
  };

  const handlePriceToggle = () => { // New toggle for price
    setExpendPrice(!expendPrice);
  };

  const updateFilterParams = (e: any) => {
    const { value, name } = e.target;
    if (value) {
      searchParams.set(name, value);
    } else {
      searchParams.delete(name);
    }
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    console.log("clearAllFilters", searchParams);
    // Clear all search params by setting an empty object
    setSearchParams({});
  };

  return (
    <div className='-z-50 space-y-5 bg-white'>
      <div className='flex items-center justify-between h-[40px] px-8 lg:border-r'>
        <p className='text-lg font-semibold'>Filters</p>
        <Button onClick={clearAllFilters} size='small' className='text-teal-600 cursor-pointer font-semibold'>
          clear all
        </Button>
      </div>

      <Divider />
      <div className='px-9 space-y-6'>
        {/* Color Section */}
        <section>
          <FormControl>
            <FormLabel
              sx={{ fontSize: "16px", fontWeight: "bold", color: '#E74292', pb: "14px" }}
              className='text-2xl font-semibold'
              id="color"
            >
              Color
            </FormLabel>
            <RadioGroup
              aria-labelledby="color"
              value={searchParams.get('color') || ''}  // Now controlled
              name="color"
              onChange={updateFilterParams}
            >
              {colors.slice(0, expendColor ? colors.length : 5).map((item) => (
                <FormControlLabel
                  key={item.name}
                  value={item.name}
                  control={<Radio />}
                  label={
                    <div className='flex items-center gap-3'>
                      <p>{item.name}</p>
                      <p
                        style={{ backgroundColor: item.hex }}
                        className={`h-5 w-5 rounded-full ${item.name === "White" ? "border" : ""}`}
                      ></p>
                    </div>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
          <div>
            <button
              onClick={handleColorToggle}
              className='text-primary-color cursor-pointer hover:text-pink-900 flex items-center'
            >
              {expendColor ? "less" : `+${colors.length - 5} more`}
            </button>
          </div>
        </section>

        {/* Discount Section */}
        <section>
          <FormControl>
            <FormLabel
              sx={{ fontSize: "16px", fontWeight: "bold", color: '#E74292', pb: "14px" }}
              className='text-2xl font-semibold'
              id="discount"
            >
              Discount
            </FormLabel>
            <RadioGroup
              aria-labelledby="discount"
              value={searchParams.get('discount') || ''}  // Now controlled
              name="discount"
              onChange={updateFilterParams}
            >
              {discount.slice(0, expendDiscount ? discount.length : 5).map((item) => (
                <FormControlLabel
                  key={item.value}
                  value={item.value}
                  control={<Radio />}
                  label={<p>{item.name}</p>}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <div>
            <button
              onClick={handleDiscountToggle}
              className='text-primary-color cursor-pointer hover:text-pink-900 flex items-center'
            >
              {expendDiscount ? "less" : `+${discount.length - 5} more`}
            </button>
          </div>
        </section>

        {/* Price Section */}
        <section>
          <FormControl>
            <FormLabel
              sx={{ fontSize: "16px", fontWeight: "bold", color: '#E74292', pb: "14px" }}
              className='text-2xl font-semibold'
              id="price"
            >
              Price
            </FormLabel>
            <RadioGroup
              aria-labelledby="price"
              value={searchParams.get('price') || ''}  // Now controlled
              name="price"
              onChange={updateFilterParams}
            >
              {price.slice(0, expendPrice ? price.length : 5).map((item) => (
                <FormControlLabel
                  key={item.value}
                  value={item.value}
                  control={<Radio />}
                  label={<p>{item.name}</p>}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <div>
            <button
              onClick={handlePriceToggle}
              className='text-primary-color cursor-pointer hover:text-pink-900 flex items-center'
            >
              {expendPrice ? "less" : `+${price.length - 5} more`}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FilterSection;
