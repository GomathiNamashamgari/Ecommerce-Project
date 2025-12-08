import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AddNewCouponForm from '../admin/Pages/Coupon/AddNewCouponForm'
import Coupon from '../admin/Pages/Coupon/Coupon'
import Deal from '../admin/Pages/HomePage/Deal'
import ElectronicTable from '../admin/Pages/HomePage/ElectronicTable'
import GridTable from '../admin/Pages/HomePage/GridTable'
import ShopByCategory from '../admin/Pages/HomePage/ShopByCategoryTable'
import SellerTable from '../admin/Pages/Seller/SellerTable'

const AdminRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<SellerTable/>}/>
            <Route path='/coupon' element={<Coupon/>}/>
            <Route path='/add-coupon' element={<AddNewCouponForm/>}/>
            <Route path='/home-grid' element={<GridTable/>}/>
            <Route path='/electronic' element={<ElectronicTable/>}/>
            <Route path='/shop-by-category' element={<ShopByCategory/>}/>
            <Route path='/deals' element={<Deal/>}/>


        </Routes>
    </div>
  )
}

export default AdminRoutes
