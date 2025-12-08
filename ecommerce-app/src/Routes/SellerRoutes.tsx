import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Profile from '../seller/pages/Account/Profile'
import Orders from '../seller/pages/Orders/Orders'
import Payments from '../seller/pages/Payment/Payments'
import Transaction from '../seller/pages/Payment/Transaction'
import AddProducts from '../seller/pages/Products/AddProducts'
import Products from '../seller/pages/Products/Products'
import Dashboard from '../seller/pages/SellerDashboard/Dashboard'

const SellerRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/products' element={<Products/>}/>
            <Route path='/add-product' element={<AddProducts/>}/>
            <Route path='/orders' element={<Orders/>}/>
            <Route path='/account' element={<Profile/>}/>
            <Route path='/payment' element={<Payments/>}/>
            <Route path='/transaction' element={<Transaction/>}/>
        </Routes>
    </div>
  )
}

export default SellerRoutes