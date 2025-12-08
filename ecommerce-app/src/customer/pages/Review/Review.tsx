import { Divider } from '@mui/material'
import React from 'react'
import ReviewCard from './ReviewCard'

const Review = () => {
  return (
    <div className='p-5 lg:px:20 flex flex-col lg:flex-row gap-20'>

        <section className='w-full md:w-1/2 lg:w-[30%] space-y-2'>

        <img src="https://m.media-amazon.com/images/I/817+bBHt7JL._SY879_.jpg" 
        alt="" />

        <div>
            <div>
                <p className='font-bold text-2xl'>VJ Fashion Store</p>
                <p className='text-lg text-gray-600'>VJ Fashion Women Kerala Silk Blend Saree With Blouse Piece_freesize</p>
            </div>
            <div>
          <div className='price flex items-center gap-3 mt-5 text-2xl'>

          <span className='font-sans text-gray-800'>
           ₹ 375
          </span>
          <span className='line-through text-gray-400'>
           ₹ 1199
          </span>
          <span className='text-primary-color font-semibold'>
           69%
          </span>
        </div>
        
        </div>

        </div>

        </section>

        <section className='space-y-5 w-full'>
            {[1,1,1,1,1,1].map((item)=><div className='space-y-3'> <ReviewCard/>
            <Divider/>
            </div>)}
        </section>

    </div>
  )
}

export default Review