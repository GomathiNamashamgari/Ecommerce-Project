import React from 'react'
import Divider from '@mui/material/Divider';


const PricingCard = () => {
  return (
    <>
    <div className='space-y-3 p-5 '>
      <div className='flex justify-between items-center'>
        <span>Subtotal</span>
        <span>₹1199</span>
      </div>
      <div className='flex justify-between items-center'>
        <span>Discount</span>
        <span>₹375</span>
      </div>
      <div className='flex justify-between items-center'>
        <span>Shipping</span>
        <span>₹60</span>
      </div>
      <div className='flex justify-between items-center'>
        <span>Plateform fee</span>
        <span style={{ color: '#e74292' }}>Free</span>
      </div>
    </div>

    <Divider/>
      <div className='flex justify-between items-center p-5 font-bold'>
        <span>Total</span>
        <span >₹435</span>
      </div>
      
    </>
  )
}

export default PricingCard
