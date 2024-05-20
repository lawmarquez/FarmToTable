import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar.js';
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import SignUp from './pages/SignUp.js';
import Account from './pages/Account.js';

import Shop from './pages/shop_pages/Shop.js';


import AdminAccount from './pages/admin_pages/AdminAccount.js';
import UsersManagement from './pages/admin_pages/UsersManagement.js';
import ProductListings from './pages/admin_pages/ProductListings.js';
import OrderFulfillment from './pages/admin_pages/OrderFulfillment.js';
import SalesReports from './pages/admin_pages/SalesReports.js';

import ProtectedRoute from './components/RouteProtection.js'; // Importing the HOC (explanation in RouteProtection.js)


function App() {
  {/**Added initial state */}
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

    {/**Read values from localStorage (coming from Login.js) */}
    useEffect(() => {
      const token = localStorage.getItem('token');
      const adminStatus = localStorage.getItem('isAdmin') === 'true'; // Ensure it's a boolean
      setIsUserSignedIn(!!token);
      setIsAdmin(adminStatus);
    }, []); {/**effect should run once after initial render */}

  {/**Check for isAdminProp to check is user is signed in for later checks*/}
  const handleLoginSuccess = (token, isAdminProp) => {
    localStorage.setItem('token', token); // Set token for successful login
    localStorage.setItem('isAdmin', isAdminProp); //Set whether isAdmin or not
    setIsUserSignedIn(true); //Changing State if Login is a success
    setIsAdmin(isAdminProp);
  };

  {/**Handles logging out */}
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isAdmin');
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
        {/* Protected routes */}
        {isUserSignedIn ? (
          <>
            {isAdmin ? (
              <>
              <Route path='/admin-account' element={<ProtectedRoute isAllowed={isAdmin} redirectPath='/'> <AdminAccount /> </ProtectedRoute>} />
                <Route path='users-management' element={<ProtectedRoute isAllowed={isAdmin} redirectPath='/'> <UsersManagement /> </ProtectedRoute>} />
                <Route path='product-listings' element={<ProtectedRoute isAllowed={isAdmin} redirectPath='/'> <ProductListings /> </ProtectedRoute>}/>
                <Route path='order-fullfillment' element={<ProtectedRoute isAllowed={isAdmin} redirectPath='/'> <OrderFulfillment /> </ProtectedRoute>} />
                <Route path='sales-reports' element={<ProtectedRoute isAllowed={isAdmin} redirectPath='/'> <SalesReports /> </ProtectedRoute>} />
              
              </>
            ) : (
              <>
              <Route path='/account' element={<Account />} />
              <Route path='/shop' element={<ProtectedRoute isAllowed={!isAdmin} redirectPath='/'> <Shop /> </ProtectedRoute>} />
              </>
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
