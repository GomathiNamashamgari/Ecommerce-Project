import React from 'react';
import { HomeCategory } from '../../../../types/HomeCategoryTypes';

const ElectricCategoryCard = ({item}:{item:HomeCategory}) => {
  return (
    <div className='flex flex-col gap-2'>
        <img className='object-contain h-10' src={item.image} 
        alt="" />
        <h2 className='font-semibold texts-sm text-center'>{item.name}</h2>
    </div>
  );
}

export default ElectricCategoryCard;