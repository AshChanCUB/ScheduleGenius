import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import myImage from "../images/planner.jpg";
import "../css/style.css"; // Import your custom CSS file

function VerifyOtp() {
  const [enterOtp, setenterOtp] = useState("");
  const handleEnterOtp = (e) => setenterOtp(e.target.value);
  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/verifyotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enterOtp }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/resetpass");
      } else {
        console.log("Otp incorrect:", data.error);
        alert("Otp incorrect");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      // Display a network error message to the user
    }
  };

  return (
    <div className="container">
      <div className="image-container">
        <img src={myImage} alt="Calendar" className="background-image" />
      </div>
      <div className="inner-box-otp">
        <h1>Enter Otp</h1>
        <form onSubmit={handleSignupSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter Otp"
              value={enterOtp}
              onChange={handleEnterOtp}
            ></input>
          </div>
          <div className="button-group">
            <button type="submit">Submit</button>
            <Link to="/forgotpass">
              <button>back</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
export default VerifyOtp;
