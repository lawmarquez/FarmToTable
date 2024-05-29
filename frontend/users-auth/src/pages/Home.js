import React, { useState, useEffect } from "react";
import axios from "axios";
import "./pages_css/Home.css"; // Import the CSS file

function Home() {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ fname: "", mname: "", lname: "" });

  const fetchUserInfo = async (email) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/user-info/${email}`
      );
      setUserInfo(response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("userEmail");
    setIsUserSignedIn(!!token);
    if (storedEmail) {
      fetchUserInfo(storedEmail);
    }
  }, []);

  return (
    <div className="container">
      {isUserSignedIn && (
        <div className="user-greeting">
          <h2>Hello {userInfo.fname}!</h2>
        </div>
      )}
      <div className="heading">
        <h1 className="title">Farm To Table</h1>
        <h2 className="subtitle">
        The Fresh Path to Your Plate
        </h2>
      </div>

      <div className="contact">
        <h1>Contact Us</h1>
        <h3>
          We're grateful for your interest in our website and are here to assist
          you. If you have any questions or feedback, don't hesitate to contact
          us via email at farmtotable@gmail.com. Your input is important to us,
          and we'll do our best to promptly address any inquiries or reviews you
          send our way.
        </h3>
      </div>
    </div>
  );
}

export default Home;
