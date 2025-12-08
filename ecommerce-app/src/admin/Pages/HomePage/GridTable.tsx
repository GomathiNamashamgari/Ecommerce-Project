import React from 'react'
import { useAppSelector } from '../../../State/Store';
import HomeCategoryTables from './HomeCategoryTable'

const GridTable = () => {
  const { customer } = useAppSelector(store => store);
  return (
    <div>
        <HomeCategoryTables data={customer.homePageData?.grid || []}/>
    </div>
  )
}

export default GridTable