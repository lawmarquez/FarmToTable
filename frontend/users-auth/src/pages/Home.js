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
      <section id="home" className="hero">
        <div className="heading">
          <h1 className="title">Farm To Table</h1>
          <h2 className="subtitle">The Fresh Path to your plate</h2>
          <br/>
            {isUserSignedIn && (
            <div className="user-greeting">
            <h2>Hello {userInfo.fname}!</h2>
            </div>
            )}
        </div>
      </section>

      <section id="about" className="about">
        <div className="about-us-half">
          <h1>About Us</h1>
        </div>

        <div className="about-content-half">
        <p>We are more than just an online grocery. Our mission is to deliver 100% real and healthy produce from our local farmers straight to your doorsteps, allowing city folk access to farm-table experiences in the comfort of your home. We collaborate with local farmers who struggle to get their fresh produce to the Metro safely. We carefully pick the produce ourselves without damaging the quality of the fruits and vegetables, while handling distribution and logistics via our refrigerated trucks.</p>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="about-content-half">
        <p>
          We're grateful for your interest in our website and are here to assist you. If you have any questions or feedback, don't hesitate to contact us via email at <a href="mailto:farmtotable@gmail.com">farmtotable@gmail.com</a>. Your input is important to us, and we'll do our best to promptly address any inquiries or reviews you send our way.
        </p>
        </div>
        <div className="contact-us-half">
          <h1>Contact Us</h1>
        </div>
        
      </section>
    </div>
  );
}

export default Home;
