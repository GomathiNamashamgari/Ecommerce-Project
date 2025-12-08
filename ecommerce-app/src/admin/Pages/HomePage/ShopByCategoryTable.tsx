import React from 'react'
import { useAppSelector } from '../../../State/Store';
import HomeCategoryTables from './HomeCategoryTable'

const ShopByCategoryTable = () => {
  const { customer } = useAppSelector(store => store);
  return (
    <div>
      <HomeCategoryTables data={customer.homePageData?.shopByCategories || []}/>
    </div>
  )
}

export default ShopByCategoryTable