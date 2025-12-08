import { Close, LocalOffer } from '@mui/icons-material'
import { Button, IconButton, TextField } from '@mui/material'
import React,{useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchUserCart } from '../../../State/customer/CartSlice'
import store, { useAppDispatch, useAppSelector } from '../../../State/Store'
import CartItem from './CartItemCard'
import PricingCard from './PricingCard'

const Cart = () => {
    const [couponCode, setCouponCode]=useState("")
    const handleChange=(e:any)=>{
        setCouponCode(e.target.value)
    }
    const navigate=useNavigate()
    const dispatch=useAppDispatch()
    const { cart } = useAppSelector(store=>store)
    useEffect(()=> {
        dispatch(fetchUserCart(localStorage.getItem("jwt") || ""))
    },[])
  return (
    <div className='pt-10 px-5 sx:px-10 md:px-60 min-h-screen'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
            <div className='cartItemSection lg:col-span-2 space-y-3'>
                {cart.cart?.cartItems.map((item)=><CartItem item={item}/>)}
            </div>
            <div className='cols-span-1 text-space-y-3 '>

                <div className='border rounded-md px-5 py-4 space-y-5'>
                    
                        <div className='flex gap-3 text-sm items-center'>
                            <div className='flex gap-3 text-sm items-center'>
                            <LocalOffer sx={{color:"#e74292", fontSize:"17px"}}/>
                        </div>
                        <span>Apply Coupons</span>
                        </div>
                        { true ? <div className='flex justify-between items-center'>
                            <TextField onChange={handleChange} id="outlined-basic" placeholder='coupon code' size='small' variant="outlined" />
                            <Button  size='small'>
                                Apply
                            </Button>
                        </div>
                        :<div className='flex'>
                            <div className='p-1 pl-5 pr-3 border-md flex gap-2 items-center'>
                                <span className=''>Zosh30 Applied</span>
                                <IconButton size='small'>
                                    <Close className='text-red-600'/>
                                </IconButton>
                            </div>

                            </div>}
                    
                </div>
                 
                <div className='border rounded-md mt-4'>
                    <PricingCard/>
                    <div className='p-5'>
                        <Button onClick={()=> navigate("/checkout")} 
                        fullWidth variant='contained' sx={{py:"11px"}}>Buy now</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Cart