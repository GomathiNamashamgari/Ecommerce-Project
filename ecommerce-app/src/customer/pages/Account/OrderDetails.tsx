import { Box, Button, Divider } from '@mui/material'
import PaymentsIcon from '@mui/icons-material/Payments';
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Orders from './Orders'
import OrderStepper from './OrderStepper'
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { fetchOrderById, fetchOrderItemById } from '../../../State/customer/OrderSlice';

const OrderDetails = () => {
    const navigate=useNavigate()
    const dispatch=useAppDispatch();
    const { orderId,orderItemId}=useParams();
    const { order} = useAppSelector(store => store);
    

    useEffect(()=>{
        dispatch(fetchOrderById({orderId:Number(orderId),jwt:localStorage.getItem("jwt") || ""}))
        dispatch(fetchOrderItemById({orderItemId:Number(orderItemId),jwt:localStorage.getItem("jwt") || ""}))
    },[])
  return (
    <Box className='space-y-5'>

        <section className='flex flex-col gap-5 justify-center items-center'>
            <img className='w-[100px]' src={order.orderItems?.[0].product.images[0]} 
            alt="" />
            <div className='text-sm space-y-1 text-center'>
                <h1 className='font-bold'>{order.orderItems?.[0].product.seller?.businessDetails.businessName}</h1>
                    <p>{order.orderItems?.[0].product.title}</p>
                    <p>s<strong>Size: </strong> {order.orderItems?.[0].size}</p>
            </div>
            <div>
                <Button onClick={()=> navigate(`/reviews/${5}/create`)}>Write Review</Button>
            </div>
        </section>
        <section className='border p-5'>
            <OrderStepper orderStatus={"SHIPPED"}/>
        </section>
        
        <div className='border p-5'>
            <h1 className='font-bold pb-3'> Delivery Address</h1>
            <div className='text-sm space-y-2'>
                <div className='flex gap-5 font-medium'>
                    <p>{order.currentOrder?.shippingAddress.name}</p>
                    <Divider flexItem orientation='vertical'/>
                    <p>{order.currentOrder?.shippingAddress.mobile}</p>
                </div>
                <p>{order.currentOrder?.shippingAddress.address} ,{" "}
                   
                    {order.currentOrder?.shippingAddress.city}, {" "}
                    {order.currentOrder?.shippingAddress.state} -
                    {order.currentOrder?.shippingAddress.pinCode}
                </p>

            </div>
        </div>
        <div className='border space-y-4'>
            <div className='flex justify-between text-sm pt-5 px-5'>
                <div className='space-y-1'>
                    <p className='font-bold'> Total Price</p>
                    <p>You Saved <span className='text-pink-500 font-medium text-xs'>₹{1300}.00</span>on this item</p>
                </div>
                <p className='font-medium'>₹{order.orderItems?.[0].sellingPrice}.00</p>
            </div>
            <div className='px-5'>
                <div className='bg-pink-50 py-2 font-medium flex items-center gap-3'>
                    <PaymentsIcon/>
                    <p>Pay On Delivery</p>
                </div>
            </div>
            <Divider/>
            <div className='px-5 pb-5'>
                <p className='text-sm font-semibold'><strong>Sold by: </strong>{order.orderItems?.[0].product.seller?.businessDetails.businessName}</p>
            </div>
            <div className='p-10'>
                <Button disabled={false}
                //onClick={handleCancelOrder}
                color='error' sx={{py:"0.7rem"}} className='' variant='outlined' fullWidth>
                    {false ? "Cancel Order" : "Cancel Order"}
                </Button>
            </div>
        </div>

    </Box>

  )
}

export default OrderDetails