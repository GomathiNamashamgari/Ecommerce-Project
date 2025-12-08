import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Button,
  Avatar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';

import CategorySheet from './CategorySheet';
import { mainCategory } from '../../../data/category/mainCategory';
import { useNavigate } from 'react-router-dom';
import store, { useAppSelector } from '../../../State/Store';

const Navbar = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const navigate=useNavigate()
  const { auth }=useAppSelector(store=>store)

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId && showCategorySheet) {
      setShowCategorySheet(false);
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
      setShowCategorySheet(true);
    }
  };

  const handleSheetMouseLeave = () => {
    setShowCategorySheet(false);
    setSelectedCategory(null);
  };

  return (
    <Box className="sticky top-0 left-0 right-0 bg-white" sx={{ zIndex: 2 }}>
      <div
        className="flex items-center justify-between flex-nowrap px-5 lg:px-20 h-[70px] border-b"
        style={{ gap: '1rem' }}
      >
        {/* Left: Logo */}
        <h1 onClick={()=> navigate("/")} className="text-primary-color italic font-serif text-3xl cursor-pointer whitespace-nowrap">
          Grid Store
        </h1>

        {/* Center: Main Categories */}
        <ul className="flex items-center gap-6 font-medium text-gray-800 whitespace-nowrap">
          {mainCategory.map((item) => (
            <li
              key={item.categoryId}
              onClick={() => handleCategoryClick(item.categoryId)}
              className={`mainCategory h-[70px] px-4 flex items-center cursor-pointer ${
                selectedCategory === item.categoryId
                  ? 'text-primary-color border-b-2 border-primary-color'
                  : ''
              }`}
            >
              {item.name}
            </li>
          ))}
        </ul>

        {/* Right: Login, icons, Become Seller */}
        <div className="flex items-center gap-4 lg:gap-6 whitespace-nowrap">
          <IconButton>
            <SearchIcon />
          </IconButton>

          {auth.user ? <Button onClick={()=> navigate("/account/orders")} className='flex item-center gap-2'>
            <Avatar sx={{width:29, height:29}} 
            src="https://images.pexels.com/photos/45210/bald-eagle-eagle-raptor-beak-45210.jpeg"></Avatar>
            <h1 className='font-semibold hidden lg:block'>
              {auth.user?.fullName}
            </h1>
        

          </Button> : <Button onClick={()=>navigate("/login")} variant="contained">Login</Button>
          }

          <IconButton onClick={()=>navigate("/wishlist")}>
            <FavoriteBorderIcon sx={{ fontSize: 29 }} />
          </IconButton>

          <IconButton onClick={()=>navigate("/cart")}>
            <AddShoppingCartIcon sx={{ fontSize: 29 }} className="text-gray-700" />
          </IconButton>

          {isLarge && (
            <Button onClick={()=>navigate("become-seller")}
              startIcon={<StorefrontIcon />}
              variant="outlined"
              className="capitalize "
              sx={{ whiteSpace: 'nowrap' }}
            >
              Become Seller
            </Button>
          )}
        </div>
      </div>

      {/* Category dropdown */}
      <div
        onMouseLeave={handleSheetMouseLeave}
        className="categorySheet absolute top-[4.41rem] left-20 right-20 border bg-white"
      >
        {showCategorySheet && selectedCategory && (
          <CategorySheet selectedCategory={selectedCategory} />
        )}
      </div>
    </Box>
  );
};

export default Navbar;
