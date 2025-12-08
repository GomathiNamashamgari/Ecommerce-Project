import React from 'react'
import { useAppSelector } from '../../../State/Store';
import HomeCategoryTables from './HomeCategoryTable'

const ElectronicTable = () => {
  const { customer } = useAppSelector(store => store);
  return (
    <div>
        <HomeCategoryTables data={customer.homePageData?.electricCategories || []}/>
    </div>
  )
}

export default ElectronicTable