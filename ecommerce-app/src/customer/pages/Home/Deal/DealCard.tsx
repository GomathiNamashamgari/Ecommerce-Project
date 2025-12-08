import React from 'react'
import { Deal } from '../../../../types/DealTypes'

const DealCard = ({item}: {item:Deal}) => {
  return (
    <div className='w-[13rem] cursor-pointer'>
        <img className='border-x-[7px] border-t-[7px] border-pink-600 w-full h-[12rem] object-cover object-top' 
        src={item.category.image}
        alt="" />
        <div className='border-4 border-black bg-black text-white p-2 text-center'>
            <p className='text-lg font-semibold'>{item.category.name}</p>
            <p className='text-2x1 font-bold'>{item.discount}% OFF</p>
            <p className='text-balance text-lg'>Shop now</p>
        </div>
    </div>
  )
}

export default DealCard