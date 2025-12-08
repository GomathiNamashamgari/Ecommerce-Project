import { Close } from '@mui/icons-material'
import { Button } from '@mui/material'
import { pink } from '@mui/material/colors'
import React from 'react'
import { addProductToWishlist } from '../../../State/customer/WishlistSlice'
import { useAppDispatch } from '../../../State/Store'
import { Product } from '../../../types/ProductTypes'

const WishlistProductCard = ({item}: {item:Product}) => {

  const dispatch=useAppDispatch();
  const handleWishlist =() =>{
        item.id && dispatch(addProductToWishlist({productId: item.id }))
    }

  return (
    <div className='w-60 relative'>
      <div className='w-full'>

        <img className='object-top w-full'
         src={item.images[0]} alt="" />

      </div>

      <div className='pt-3 space-y-1 '>
        <p >{item.title}</p>

        <div className='price flex items-center gap-3'>
                    <span className='font-sans text-gray-800'>₹ {item.sellingPrice}</span>
                    <span className='thin-line-through text-gray-400'>₹ {item.mrpPrice}</span>
                    <span className='text-primary-color font-semibold'>{item.discountPercent}%</span>
        </div>
      </div>

      <div className='absolute top-1 right-1'>
        <Button  onClick={handleWishlist}>
          <Close className='cursor-pointer bg-white rounded-full p-1' sx={{color:pink[500], fontSize:"2rem"}}/>
        </Button>
      </div>

      

    </div>
  )
}

export default WishlistProductCard