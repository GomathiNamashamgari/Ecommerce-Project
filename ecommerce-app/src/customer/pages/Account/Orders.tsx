import React, { useEffect } from 'react'
import { fetchUserOrderHistory } from '../../../State/customer/OrderSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import OrderItemCard from './OrderItemCard';
import OrderItem from './OrderItemCard'

const Orders = () => {
  const dispatch = useAppDispatch();
  const { order } = useAppSelector(store => store)

  useEffect(() => {
    dispatch(fetchUserOrderHistory(localStorage.getItem("jwt") || ""));
  },[])
  return (
    <div className='text-sm min-h-screen'>
      <div className='pb-5'>
        <h1 className='font-semibold'>All Orders</h1>
        <p>from anytime</p>
      </div>

      <div className='space-y-2'>

       {order.order.map((order) => order.orderItems.map((item)=><OrderItemCard order={order} item={item}/>))}
        
      </div>
    </div>
  )
}

export default Orders