import React from "react";
import { Divider, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ProfileFieldCard from "../../../component/ProfileFieldCard";

const Profile = () => {
  return (
    <div
      className="flex flex-col bg-white rounded-md shadow-md space-y-8 w-full lg:w-[80%]"
      style={{
        padding: "16px",
      }}
    >
      {/* Personal Details */}
      <section>
        {/* Header with title and edit icon */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-bold text-gray-700">Personal Details</h1>
          <IconButton
            sx={{
              backgroundColor: "#3a8e7c",
              color: "white",
              "&:hover": { backgroundColor: "#357a67" },
              width: 36,
              height: 36,
            }}
            aria-label="edit personal details"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </div>

        {/* Profile image below heading */}
        <div className="flex justify-start mb-6">
          <img
            src="https://images.pexels.com/photos/27041597/pexels-photo-27041597.png?_gl=1*1b428kf*_ga*NTYxNjc3ODAxLjE3NjMyMTE5NzU.*_ga_8JE65Q40S6*czE3NjM4MTkwODkkbzUkZzEkdDE3NjM4MTkwOTQkajU1JGwwJGgw"
            alt="Profile"
            style={{
              width: 80,
              height: 80,
              borderRadius: "60%",
              objectFit: "cover",
              border: "2px solid #e74292",
            }}
          />
        </div>

        {/* Profile details below image */}
        <div>
          <ProfileFieldCard keys="Seller Name" value="Gomathi" />
          <Divider />
          <ProfileFieldCard keys="Seller Email" value="gomathinamashamgari@gmail.com" />
          <Divider />
          <ProfileFieldCard keys="Seller Mobile" value="1234567889" />
        </div>
      </section>


      {/* Business Details */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-700">Business Details</h2>
          {/* Circular green edit button like in the image */}
          <IconButton
            sx={{
              backgroundColor: "#3a8e7c",
              color: "white",
              "&:hover": { backgroundColor: "#357a67" },
              width: 40,
              height: 40,
            }}
            aria-label="edit business details"
          >
            <EditIcon />
          </IconButton>
        </div>

        <div>
          <ProfileFieldCard keys="Business Name/Brand Name" value="Virani Clothing" />
          <Divider />
          <ProfileFieldCard keys="GSTIN" value="GSTIN3447633" />
          <Divider />
          <ProfileFieldCard keys="Account Status" value="PENDING" />
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-700">PickUp Address</h2>
          {/* Circular green edit button like in the image */}
          <IconButton
            sx={{
              backgroundColor: "#3a8e7c",
              color: "white",
              "&:hover": { backgroundColor: "#357a67" },
              width: 40,
              height: 40,
            }}
            aria-label="edit pickup address"
          >
            <EditIcon />
          </IconButton>
        </div>

        <div>
          <ProfileFieldCard keys="Address" value="Mumbai new shivam building" />
          <Divider />
          <ProfileFieldCard keys="City" value="Mumbai" />
          <Divider />
          <ProfileFieldCard keys="State" value="Maharastra" />
          <Divider />
          <ProfileFieldCard keys="Mobile" value="1234567889" />
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-700">Bank Details</h2>
          {/* Circular green edit button like in the image */}
          <IconButton
            sx={{
              backgroundColor: "#3a8e7c",
              color: "white",
              "&:hover": { backgroundColor: "#357a67" },
              width: 40,
              height: 40,
            }}
            aria-label="edit bank details"
          >
            <EditIcon />
          </IconButton>
        </div>

        <div>
          <ProfileFieldCard keys="Account Holdler Name" value="Gomathi" />
          <Divider />
          <ProfileFieldCard keys="Account Number" value="67893447633" />
          <Divider />
          <ProfileFieldCard keys="IFSC CODE" value="YES798" />
        </div>
      </section>

    </div>
    
  );
};

export default Profile;
