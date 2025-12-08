import { Radio } from '@mui/material';
import React from 'react';

interface AddressCardProps {
  address: any;                   // the address object
  selected?: boolean;             // whether this address is selected
  onSelect?: () => void;          // callback to select this address
}

const AddressCard = ({ address, selected = false, onSelect }: AddressCardProps) => {
  return (
    <div 
      className={`p-5 border rounded-md flex cursor-pointer ${selected ? "border-primary-color" : ""}`}
      onClick={onSelect}  // click anywhere on card to select
    >
      <div>
        <Radio
          checked={selected}
          onChange={onSelect} // notify parent
          value=""
          name="radio-button"
        />
      </div>
      <div className='space-y-3 pt-3'>
        <h1>{address.name}</h1>
        <p className='w-[320px]'>{address.address}, {address.locality}, {address.city}, {address.state} - {address.pinCode}</p>
        <p><strong>Mobile:</strong> {address.mobile}</p>
      </div>
    </div>
  );
};

export default AddressCard;
