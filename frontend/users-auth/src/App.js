import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar.js';
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import SignUp from './pages/SignUp.js';
import Account from './pages/Account.js';
import AdminAccount from './pages/admin_pages/AdminAccount.js';
import UsersManagement from './pages/admin_pages/UsersManagement.js';
import ProductListings from './pages/admin_pages/ProductListings.js';
import OrderFulfillment from './pages/admin_pages/OrderFulfillment.js';
import SalesReports from './pages/admin_pages/SalesReports.js';

function App() {
  // Checking if user is signed in or not by checking session token
  const [isUserSignedIn, setIsUserSignedIn] = useState(!!localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(false);

  {/**Check for isAdminProp to check is user is signed in for later checks*/}
  const handleLoginSuccess = (isAdminProp) => {
    setIsAdmin(isAdminProp);
    setIsUserSignedIn(true);
  };

  {/**Handles logging out */}
  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsUserSignedIn(false);
    setIsAdmin(false);
  };

  return (
    <div className="App">
      <Navbar isAdmin={isAdmin} isUserSignedIn={isUserSignedIn} handleSignOut={handleSignOut} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path='/signup' element={<SignUp />} />
        {/* Only render the following routes if the user is signed in */}
        {isUserSignedIn ? (
          <>
            {isAdmin ? (
              <Route path='/admin-account' element={<AdminAccount />}>
                <Route path='users-management' element={<UsersManagement />} />
                <Route path='product-listings' element={<ProductListings />} />
                <Route path='order-fullfillment' element={<OrderFulfillment />} />
                <Route path='sales-reports' element={<SalesReports />} />
              </Route>
                
            ) : (
              <Route path='/account' element={<Account />} />
            )}
          </>
        ) : (
          // Redirect to the home page if the user is not signed in (maybe insert to error page later on)
          <Route path='/*' element={<Navigate to='/' />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
