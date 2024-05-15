import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ isAdmin }) {
    // Check if local session (token) is available
    const isUserSignedIn = !!localStorage.getItem("token");
    console.log("isUserSignedIn:", isUserSignedIn); // Add this line to check the value
    const navigate = useNavigate();

    // Handles Sign Out function that will void created token from Sign In
    const handleSignOut = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <nav className="NavigationBar">
            <Link to="/">Home</Link>
            <ul>
                {/* renderint only the "Account" link if the user is signed in */}
                {isUserSignedIn && (
                    <>
                        {isAdmin ? (
                            <li>Admin Account</li>
                        ) : (
                            <li>
                                {/* display of user navbar */}
                                <Link to='/account'>Account</Link>
                            </li>
                        )}
                        <li>
                            <button onClick={handleSignOut}>Sign Out</button>
                        </li>
                    </>
                )}
                {/* showing the login and signup links if the user is not signed in */}
                {!isUserSignedIn && (
                    <>
                        <Link to='/login'><li>Login</li></Link>
                        <Link to='/signup'><li>Signup</li></Link>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
