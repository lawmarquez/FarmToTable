import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ isUserSignedIn, isAdmin, handleSignOut }) {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <nav className="NavigationBar">
            <h1 className="headerTitle">Farm To Table</h1>
            {/* <Link to="/">Home</Link> */}
            <button onClick={() => handleNavigation("/")}>Home</button>
            <ul>
                {/**Check if the user is Signed In using isUserSigned comning from the App.js */}
                {isUserSignedIn ? (
                    <>
                        {/** Check if the user logging in is an "admin" to change NavBar accordingly*/}
                        {isAdmin ? (
                            <li>
                                {/* <Link to="/admin-account">Admin Account</Link> */}
                                <button onClick={() => handleNavigation("/admin-account")}>Admin Account</button>
                            </li>
                        ) : (
                            <>
                                <li>
                                    {/* <Link to='/account'>Account</Link> */}
                                    <button onClick={() => handleNavigation("/account")}>Account</button>

                                </li>
                                <li>
                                    {/* <Link to='/shop'>Shop</Link> */}
                                    <button onClick={() => handleNavigation("/shop")}>Shop</button>
                                </li>
                            </>
                        )}
                        <li>
                            <button onClick={handleSignOut}>Sign Out</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            {/* <Link to='/login'>Login</Link> */}
                            <button onClick={() => handleNavigation("/login")}>Login</button>
                        </li>
                        <li>
                            {/* <Link to='/signup'>Signup</Link> */}
                            <button onClick={() => handleNavigation("/signup")}>Signup</button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
