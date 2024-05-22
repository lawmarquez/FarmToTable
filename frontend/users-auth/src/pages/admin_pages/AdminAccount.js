import React from 'react'
import '../pages_css/AdminAccount.css'
import UsersManagement from './UsersManagement.js'
import ProductListings from './ProductListings.js'
import OrderFulfillment from './OrderFulfillment.js'
import SalesReports from './SalesReports.js'

function AdminAccount() {
  return (
    <>
      <div className='dashboard'>
        <UsersManagement />
        <ProductListings />
        <OrderFulfillment />
        <SalesReports />
      </div>
      
    </>
  )
}

export default AdminAccount