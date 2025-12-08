import React from 'react'
import OrderTables from './OrderTable'

const Orders = () => {
  return (
    <div>
      <h1 className='font-bold mb-5 text-xl'>All Orders</h1>
        <OrderTables/>
    </div>
  )
}

export default Orders