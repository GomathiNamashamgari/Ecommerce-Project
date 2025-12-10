import { Button, FormControlLabel, Modal, Radio, RadioGroup,Grid, Box } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { createOrder } from "../../../State/customer/OrderSlice";
import PricingCard from "../Cart/PricingCard";
import AddressForm from "./AddressForm";

// Modal style
const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

// Payment gateway options
const paymentGateWayList = [
  { value: "RAZORPAY", image: "https://i.ibb.co/1Yv2qNyn/Razorpay-1.jpg", label: "Razorpay" },
];

// Address card component
const AddressCard = ({ address, selected, onSelect }: any) => (
  <div
    className={`p-5 border rounded-md flex cursor-pointer ${selected ? "border-blue-500" : ""}`}
    onClick={onSelect}
  >
    <input type="radio" checked={selected} readOnly className="mr-3" />
    <div>
      <h1>{address.name}</h1>
      <p>{address.address}, {address.locality}, {address.city} - {address.pinCode}</p>
      <p><strong>Mobile:</strong> {address.mobile}</p>
    </div>
  </div>
);

const Checkout = () => {
  const { cart } = useAppSelector(store => store);
  const dispatch = useAppDispatch();

  const subtotal = cart.cart?.cartItems.reduce(
  (acc, item) => acc + item.product.sellingPrice * item.quantity,
  0
) || 0;

const discount = cart.cart?.discount || 0;
const shipping = cart.cart?.shipping || 60;
const platformFee = cart.cart?.platformFee || "Free";
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [paymentGateWay, setPaymentGateWay] = useState("RAZORPAY");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePaymentChange = (event: any) => {
    setPaymentGateWay(event.target.value);
  };

  const handleSaveAddress = (address: any) => {
    setAddresses([...addresses, address]);
    setSelectedAddress(address);
    handleClose();
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      alert("Please select an address!");
      return;
    }
    dispatch(
      createOrder({
        address: selectedAddress,
        jwt: localStorage.getItem("jwt") || "",
        paymentGateway: paymentGateWay,
      })
    );
  };

  return (
    <>
      <div className="pt-10 px-5 sx:px-10 md:px-44 lg:px-60 min-h-screen">
        <div className="space-y-5 lg:space-y-0 lg:grid grid-cols-3 lg:gap-9">
          {/* Address Section */}
          <div className="col-span-2 space-y-5">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Select Address</h1>
              <Button onClick={handleOpen}>Add new Address</Button>
            </div>

            <div className="text-xs font-medium space-y-5">
              <p>Saved Addresses</p>
              <div className="space-y-3">
                {addresses.map((item, idx) => (
                  <AddressCard
                    key={idx}
                    address={item}
                    selected={selectedAddress === item}
                    onSelect={() => setSelectedAddress(item)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Payment & Summary Section */}
          <div>
            <div className="border p-2 rounded-md">
              <h1 className="text-primary-color font-medium text-center">Choose Payment Gateway</h1>
              <RadioGroup
                row
                aria-label="payment"
                name="payment-radio-group"
                value={paymentGateWay}
                onChange={handlePaymentChange}
                className="flex justify-between pr-0"
              >
                {paymentGateWayList.map((item) => (
                  <FormControlLabel
                    key={item.value}
                    value={item.value}
                    control={<Radio />}
                    label={
                      <img
                        className={`object-contain ${item.value === "stripe" ? "h-20 w-28" : "h-20 w-20"}`}
                        src={item.image}
                        alt={item.label}
                      />
                    }
                  />
                ))}
              </RadioGroup>
            </div>

            <div className="border rounded-md mt-4">
              <PricingCard
  subtotal={subtotal}
  discount={discount}
  shipping={shipping}
  platformFee={platformFee}
/>

              <div className="p-5">
                <Button fullWidth variant="contained" sx={{ py: "11px" }} onClick={handleCheckout}>
                  CHECKOUT
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding new address */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <AddressForm onSaveAddress={handleSaveAddress} />
        </Box>
      </Modal>
    </>
  );
};

export default Checkout;
