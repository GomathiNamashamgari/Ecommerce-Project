import { Close, LocalOffer } from '@mui/icons-material';
import { Button, IconButton, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserCart } from '../../../State/customer/CartSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import CartItem from './CartItemCard';
import PricingCard from './PricingCard';

const Cart = () => {
  const [couponCode, setCouponCode] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cart } = useAppSelector((store) => store);

  useEffect(() => {
    dispatch(fetchUserCart(localStorage.getItem('jwt') || ''));
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
  };

  // Calculate amounts from cart dynamically
  const subtotal = cart.cart?.cartItems.reduce(
    (acc, item) => acc + item.product.sellingPrice * item.quantity,
    0
  ) || 0;

  const discount = cart.cart?.discount || 0; // from DB
  const shipping = cart.cart?.shipping || 60; // from DB or default
  const platformFee = cart.cart?.platformFee || 'Free'; // from DB or default

  return (
    <div className="pt-10 px-5 sx:px-10 md:px-60 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cart Items Section */}
        <div className="cartItemSection lg:col-span-2 space-y-3">
          {cart.cart?.cartItems?.length ? (
            cart.cart.cartItems.map((item) => <CartItem key={item.id} item={item} />)
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        {/* Pricing and Coupons Section */}
        <div className="cols-span-1 space-y-3">
          {/* Coupons */}
          <div className="border rounded-md px-5 py-4 space-y-5">
            <div className="flex gap-3 text-sm items-center">
              <LocalOffer sx={{ color: '#e74292', fontSize: '17px' }} />
              <span>Apply Coupons</span>
            </div>
            {true ? (
              <div className="flex justify-between items-center">
                <TextField
                  value={couponCode}
                  onChange={handleChange}
                  placeholder="Coupon code"
                  size="small"
                  variant="outlined"
                  fullWidth
                />
                <Button size="small" sx={{ ml: 2 }}>
                  Apply
                </Button>
              </div>
            ) : (
              <div className="flex">
                <div className="p-1 pl-5 pr-3 border flex gap-2 items-center">
                  <span>Zosh30 Applied</span>
                  <IconButton size="small">
                    <Close className="text-red-600" />
                  </IconButton>
                </div>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="border rounded-md mt-4">
            <PricingCard
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              platformFee={platformFee}
            />
            <div className="p-5">
              <Button
                onClick={() => navigate('/checkout')}
                fullWidth
                variant="contained"
                sx={{ py: '11px' }}
              >
                Buy now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
