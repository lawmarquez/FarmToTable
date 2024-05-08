import React from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Navbar.css";

function Navbar(){
    //Check if local session (token) is available
    const isUserSignedIn = !!localStorage.getItem("token");
    const navigate = useNavigate();

    //Handles Sign Out function that will void created token from Sign In
    const handleSignOut = () => {
        localStorage.removeItem("token");
        navigate("/");
    }

    return(
        <nav className="NavigationBar">
            <Link to="/">Home</Link>
            <ul>
                {isUserSignedIn ? (
                    <>
                    <Link to='/account'><li>Account</li></Link>
                    {/**Action that catches when user click the Sign out from NavBar */}
                    <li><button onClick={handleSignOut}>Sign Out</button></li>
                    </>
                ) : (
                    <>
                    <Link to='/login'><li>Login</li></Link>
                    <Link to='/signup'><li>Signup</li></Link>
                    </>
                )}
            </ul>
        </nav>
    )
}

export default Navbar;