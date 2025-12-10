import { Divider } from "@mui/material";

interface PricingCardProps {
  subtotal: number;
  discount: number;
  shipping: number;
  platformFee?: string | number;
}

const PricingCard = ({
  subtotal,
  discount,
  shipping,
  platformFee = "Free",
}: PricingCardProps) => {
  // Convert platformFee to number if it's a number, otherwise 0
  const platformFeeNumber = typeof platformFee === "number" ? platformFee : 0;

  const total = subtotal - discount + shipping + platformFeeNumber;

  return (
    <>
      <div className="space-y-3 p-5">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Discount</span>
          <span>₹{discount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Shipping</span>
          <span>₹{shipping}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Platform fee</span>
          <span style={{ color: "#e74292" }}>
            {typeof platformFee === "number" ? `₹${platformFee}` : platformFee}
          </span>
        </div>
      </div>

      <Divider />

      <div className="flex justify-between items-center p-5 font-bold">
        <span>Total</span>
        <span>₹{total}</span>
      </div>
    </>
  );
};

export default PricingCard;
