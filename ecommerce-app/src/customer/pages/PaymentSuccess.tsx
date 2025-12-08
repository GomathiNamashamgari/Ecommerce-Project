import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../State/Store';
import { paymentSuccess } from '../../State/customer/OrderSlice';

const PaymentSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const paymentId = searchParams.get('razorpay_payment_id');
  const paymentLinkId = searchParams.get('razorpay_payment_link_id');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!orderId || !paymentId || !paymentLinkId) {
      setStatus('error');
      return;
    }

    const jwt = localStorage.getItem('jwt') || '';

    const interval = setInterval(async () => {
      try {
        // Dispatch Redux action to verify payment
        const resultAction = await dispatch(
          paymentSuccess({ orderId, paymentId, paymentLinkId, jwt })
        );

        // If payment verified successfully
        if (resultAction.payload?.success) {
          setStatus('success');
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Payment verification failed, retrying...', err);
        // Keep polling
      }
    }, 3000); // poll every 3 seconds

    return () => clearInterval(interval);
  }, [orderId, paymentId, paymentLinkId, dispatch]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <h2 className="text-2xl font-semibold">Verifying your payment...</h2>;
      case 'success':
        return (
          <>
            <h1 className="text-4xl font-bold mb-4">Congratulations!</h1>
            <h2 className="text-2xl mb-6">Your order was placed successfully!</h2>
            <p className="text-lg mb-8 opacity-90">
              Order ID: <span className="font-bold text-xl">#{orderId}</span>
            </p>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/')}
              style={{ borderColor: 'white', color: 'white' }}
            >
              Continue Shopping
            </Button>
          </>
        );
      case 'error':
        return <h2 className="text-2xl text-red-500">Payment verification failed. Please try again.</h2>;
    }
  };

  return (
    <div className="min-h-[90vh] flex justify-center items-center bg-gray-50">
      <div className="bg-primary-color text-white p-10 rounded-2xl shadow-2xl w-[90%] max-w-md text-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentSuccess;
