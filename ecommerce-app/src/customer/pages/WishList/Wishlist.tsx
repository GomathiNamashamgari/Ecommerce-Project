import React, { useEffect } from 'react'
import { getWishlistByUserId } from '../../../State/customer/WishlistSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import WishlistProductCard from './WishlistProductCard'

const Wishlist = () => {
  const dispatch=useAppDispatch();
  const {wishlist}=useAppSelector(store => store);

  useEffect(()=>{
    dispatch(getWishlistByUserId())
  },[])

  return (
    <div className='h-[85vh] p-5 lg:p-20'>
      <section >
        <h1><strong>My WishList</strong> 5 items</h1>

        <div className='pt-10 flex felx-wrap gap-5'>
          {wishlist.wishlist?.products.map((item) => <WishlistProductCard item={item}/>)}
        </div>
      </section>
    </div>
  )
}

export default Wishlist