import React, { useEffect, useState } from 'react'
import StarIcon from '@mui/icons-material/Star';
import { Button, Divider } from '@mui/material';
import { Add, Favorite, LocalShipping, Remove, Shield, Wallet, WorkspacePremium } from '@mui/icons-material';
import AddShoppingCart from '@mui/icons-material/AddShoppingCart';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import SimilarProduct from './SimilarProduct';
import ReviewCard from '../Review/ReviewCard';
import store, { useAppDispatch, useAppSelector } from '../../../State/Store';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../../../State/customer/ProductSlice';

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const {  productId } = useParams<{  productId: string }>();
  const [activeImage, setActiveImage] = useState(0);
  const product = useAppSelector(store => store.product.product);

  // Fetch product
  useEffect(() => {
     if (!productId) return;
    const id = Number(productId);
    if (isNaN(id)) return;
     console.log('Fetching product for ID:', id);
    dispatch(fetchProductById(id));
  }, [productId, dispatch]);

  const handleActiveImage = (index: number) => () => {
    setActiveImage(index);
  };

  return (
    <div className="px-5 lg:px-20 pt-10">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT SIDE IMAGES */}
        <section className="flex flex-col lg:flex-row gap-5">

          {/* Thumbnail Sidebar */}
          <div className="w-full lg:w-[15%] flex flex-row lg:flex-col gap-3">
            {product?.images?.map((img:string, index:number) => (
              <img
                key={index}
                onClick={handleActiveImage(index)}
                src={img }
                alt=""
                className={`w-20 h-28 object-cover rounded-md border cursor-pointer hover:border-pink-500
                ${index === activeImage ? "border-pink-500" : "border-gray-300"}`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="w-full lg:w-[85%]">
            <img
              className="w-full rounded-md object-cover"
              src={product?.images?.[activeImage] }
              alt=""
            />
          </div>

        </section>

        {/* RIGHT SIDE DETAILS */}
        <section>

          <h1 className='font-bold text-lg text-primary-color'>
            {product?.seller?.businessDetails?.businessName}
          </h1>

          <p className='text-black-500 font-semibold'>
            {product?.title}
          </p>

          <div className='flex justify-between items-center py-2 border w-[180px] px-3 mt-5'>
            <div className='flex gap-1 items-center'>
              <span>4</span>
              <StarIcon sx={{ color: "#E74292", fontSize: "17px" }} />
            </div>
            <Divider orientation='vertical' flexItem />
            <span>234 Ratings</span>
          </div>

          {/* Price */}
          <div className='price flex items-center gap-3 mt-5 text-2xl'>
            <span className='font-sans text-gray-800'>₹ {product?.sellingPrice}</span>
            <span className='line-through text-gray-400'>₹ {product?.mrpPrice}</span>
            <span className='text-primary-color font-semibold'>
              {product?.discountPercent}%
            </span>
          </div>

          <p className='text-sm'>Inclusive of all taxes. Free Shipping above ₹1500.</p>

          {/* Badges */}
          <div className='mt-7 space-y-3'>
            <div className='flex items-center gap-4'><Shield sx={{ color: "#e74292" }} /><p>Authentic & Quality Assured</p></div>
            <div className='flex items-center gap-4'><WorkspacePremium sx={{ color: "#e74292" }} /><p>100% money back guarantee</p></div>
            <div className='flex items-center gap-4'><LocalShipping sx={{ color: "#e74292" }} /><p>Free Shipping & Returns</p></div>
            <div className='flex items-center gap-4'><Wallet sx={{ color: "#e74292" }} /><p>Pay on delivery might be available</p></div>
          </div>

          {/* Quantity */}
          <div className='mt-7 space-y-2'>
            <h1>QUANTITY</h1>
            <div className='flex items-center gap-2 w-[140px] justify-between'>
              <Button disabled={quantity == 1} onClick={() => setQuantity(quantity - 1)}>
                <Remove />
              </Button>
              <span>{quantity}</span>
              <Button onClick={() => setQuantity(quantity + 1)}>
                <Add />
              </Button>
            </div>
          </div>

          {/* Buttons */}
          <div className='mt-12 flex items-center gap-5'>
            <Button fullWidth variant='contained' startIcon={<AddShoppingCart />} sx={{ py: "1rem" }}>
              Add To Bag
            </Button>

            <Button fullWidth variant='outlined' startIcon={<FavoriteBorder />} sx={{ py: "1rem" }}>
              Wishlist
            </Button>
          </div>

          <div className='mt-5'>
            <p>{product?.description}</p>
          </div>

          <div className='mt-12 space-y-5'>
            <ReviewCard />
            <Divider />
          </div>

        </section>
      </div>

      {/* Similar Products */}
      <div className='mt-20'>
        <h1 className='text-lg font-bold'>Similar Product</h1>
        <div className='pt-5'>
          <SimilarProduct />
        </div>
      </div>

    </div>
  )
}

export default ProductDetails;
