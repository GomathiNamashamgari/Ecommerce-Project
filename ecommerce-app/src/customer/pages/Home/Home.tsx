import { Button } from "@mui/material";
import React from "react";
import CategoryGrid from "./CategoryGrid/CategoryGrid";
import Deal from "./Deal/Deal";
import ElectricCategory from "./ElectricCategory/ElectricCategory";
import ShopByCategory from "./ShopByCategory/ShopByCategory";
import StorefrontIcon from '@mui/icons-material/Storefront';


const Home = () => {
  return (
    <>
<div className='space-y-5 lg:space-y-10 relative pb-20'>
    
    <ElectricCategory/>
    <CategoryGrid/>
    
    <div className='pt-10'>
      <h1 className='text-lg lg:text-4xl font-bold text-primary-color pb-5 lg:pb-10 text-center'>TODAY'S DEALS</h1>
      <Deal/>
    </div>


    <section className='pt-10'>
      <h1 className='text-lg lg:text-4xl font-bold text-primary-color pb-5 lg:pb-10 text-center'>SHOP BY CATEGORY</h1>
      <ShopByCategory/> 
    </section>

    <section className=" pt-20 relative px-4 lg:px-20">
    <img className="w-full h-auto object-contain rounded-lg"
      src="https://api.imghippo.com/files/Md2643hzA.jpg"
      alt=""/>

      <div className='absolute top-1/2 left-4 lg:left-[15rem] transform-translate-y-1/2 font-semibold lg:text-4xl space-y-3'>
      <h1>Sell You Product</h1>
      <p className= 'text-lg md:text-2xl'>With <span className='logo'>Grid Store</span></p>
      
      <div className='pt-6 flex justify-center'>
        <Button startIcon={<StorefrontIcon />} variant="contained" size="large">
          Become Seller
        </Button>
      </div>
      </div>
    </section>

    
</div>
    </>
  );
}

export default Home;
