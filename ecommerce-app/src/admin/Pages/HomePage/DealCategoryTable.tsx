import React from 'react'
import { useAppSelector } from '../../../State/Store';
import HomeCategoryTables from './HomeCategoryTable'

const DealCategoryTable = () => {
  const { customer } = useAppSelector(store => store);
  return (
    <div>
      <HomeCategoryTables data={customer.homePageData?.dealCategories || [] }/>
    </div>
  )
}

export default DealCategoryTable