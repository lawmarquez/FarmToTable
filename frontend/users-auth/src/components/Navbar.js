import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ isUserSignedIn, isAdmin, handleSignOut }) {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <nav className="NavigationBar">
            <h1 className="headerTitle">FarmToTable</h1>
            <div className="navsContainer">
                {/* <Link to="/">Home</Link> */}
                <button className="navButton" onClick={() => handleNavigation("/")}>Home</button>
                
                {/**Check if the user is Signed In using isUserSigned comning from the App.js */}
                {isUserSignedIn ? (
                    <>
                        {/** Check if the user logging in is an "admin" to change NavBar accordingly*/}
                        {isAdmin ? (
                            <>      
                                    {/* <Link to="/admin/sales-reports">Admin Account</Link> */}
                                    <button className="navButton" onClick={()=> handleNavigation("/admin/sales-reports")}>Sales Reports</button>
                                    {/* <Link to="/admin/product-listings">Admin Account</Link> */}
                                    <button  className="navButton" onClick={()=> handleNavigation("/admin/product-listings")}>Product Listings</button>
                                    {/* <Link to="/admin/order-fulfillment">Admin Account</Link> */}
                                    <button className="navButton" onClick={()=> handleNavigation("/admin/order-fulfillment")}>Order Fulfillment</button>
                                    {/* <Link to="/admin/users-management">Admin Account</Link> */}
                                    <button className="navButton" onClick={()=> handleNavigation("/admin/users-management")}>User Management</button>
                                    {/* <Link to="/admin/account">Admin Account</Link> */}
                                    <button className="navButton" onClick={() => handleNavigation("/admin/account")}>Admin Account</button>
                            </>
                            
                        ) : (
                            <>
                                    {/* <Link to='/account'>Account</Link> */}
                                    <button className="navButton" onClick={() => handleNavigation("/account")}>Account</button>
                                    {/* <Link to='/shop'>Shop</Link> */}
                                    <button className="navButton" onClick={() => handleNavigation("/shop")}>Shop</button>
                            </>
                        )}
                        <button className="navButton" id="signOut" onClick={handleSignOut}>Sign out</button>
                    </>
                ) : (
                    <>
                            {/* <Link to='/login'>Login</Link> */}
                            <button className="navButton" onClick={() => handleNavigation("/login")}>Login</button>
                            {/* <Link to='/signup'>Signup</Link> */}
                            <button className="navButton" onClick={() => handleNavigation("/signup")}>Signup</button>
                    </>
                )}

            </div>
        </nav>
    );
}

export default Navbar;
