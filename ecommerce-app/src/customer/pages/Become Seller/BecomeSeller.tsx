import { Button } from "@mui/material";
import React, { useState } from "react";
import SellerAccountForm from "./SellerAccountForm";
import SellerLoginForm from "./SellerLoginForm";

const BecomeSeller = () => {
  const [isLogin, setIsLogin] = useState(false);

  const handleShowpage = () => {
    setIsLogin(!isLogin);
  };
  return (
    <div className="grid md:grid gap-10 grid-cols-3 min-h-screen">
      <section className="lg:col-span-1 md:col-span-2 col-span-3 p-10 shadow-lg rounded-b-md">
        {!isLogin ? <SellerAccountForm /> : <SellerLoginForm />}

        <div className="mt-10 space-y-2">
          <h1 className="text-center text-sm font-medium">Have account</h1>
          <Button
            onClick={handleShowpage}
            fullWidth
            sx={{ py: "11px" }}
            variant="outlined"
          >
            {isLogin ? "Register" : "Login"}
          </Button>
        </div>
      </section>
      <section className="hidden md:col-span-1 lg:col-span-2 md:flex justify-center items-center">

        <div className="lg:w-[70%] px-5 space-y-10">

            <div className="space-y-2 font-bold text-center">
                <p className="text-2xl">Join the Marketplace Revolution</p>
                <p className="text-lg text-primary-color">Boost Your Sales Today</p>
            </div>
            <img src="https://www.bluehost.com/blog/wp-content/uploads/2023/11/how-sell-clothes-online-768x432.png" alt="" />
        </div>

      </section>
    </div>
  );
};

export default BecomeSeller;
