import { ElectricBolt } from '@mui/icons-material'
import { Avatar } from '@mui/material'
import React, { use } from 'react'
import { useNavigate } from 'react-router-dom'
import { Order, OrderItem } from '../../../types/OrderTypes'

const OrderItemCard = ({item, order}:{item:OrderItem, order:Order}) => {
    const navigate= useNavigate();
  return (
    <div onClick={()=>navigate(`/account/order/${order.id}/${item.id}`)} 
    className='text-sm bg-white p-5 space-y-4 border rounded-md cursor-pointer'>
        
        <div className='flex items-center gap-5'>

            <div>
                <Avatar sizes='small' sx={{bgcolor:"#e74292"}}>
                    <ElectricBolt/>
                </Avatar>
            </div>
            <div>
                <h1 className='font-bold text-primary-color'> PENDING</h1>
                <p>Arriving By {order.deliverDate}</p>
            </div>

        </div>
        <div className='p-5 bg-#e74292 flex gap-3'>

            <div>
                <img className='w-[70px]'
                src={item.product.images[0]} alt="" />
            </div>
            <div className='w-full space-y-3'>
                <h1 className='font-bold'>{item.product.seller?.businessDetails.businessName}</h1>
                <p className='text-sm'>{item.product.title} </p>
                <p>
                    <strong>Size:</strong>
                    {item.product.size}
                </p>
            </div>

        </div>

    </div>
  )
}

export default OrderItemCard
