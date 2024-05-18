import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ isUserSignedIn, isAdmin, handleSignOut }) {
    return (
        <nav className="NavigationBar">
            <ul>
                {/**Check if the user is Signed In using isUserSigned comning from the App.js */}
                {isUserSignedIn ? (
                    <>
                    {/** Check if the user logging in is an "admin" to change NavBar accordingly*/}
                        {isAdmin ? (
                            <li>
                                <Link to="/admin-account">Admin Account</Link>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Link to='/'>Home</Link>
                                </li>
                                <li>
                                    <Link to='/account'>Account</Link>
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
                            <Link to='/login'>Login</Link>
                        </li>
                        <li>
                            <Link to='/signup'>Signup</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
