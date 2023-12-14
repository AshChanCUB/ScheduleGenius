import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import myImage from "../images/planner.jpg";
import "../css/style.css"; // Import your custom CSS file

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        console.log("Passwords do not match");
        // Display an error message to the user
        alert("Passwords do not match");
        return;
      }

      const response = await fetch("http://localhost:3001/resetpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Password reset successful");
        navigate("/login"); // Redirect to the login page
      } else {
        alert(data.message);
        console.log("Password reset failed:", data.message);
        // Display an error message to the user
      }
    } catch (error) {
      console.error("Error during signup:", error);
      // Display a network error message to the user
    }
  };

  return (
    <div className='container'>
      <div className="image-container">
        <img src={myImage} alt="Calendar" className="background-image" />
      </div>
      <div className="inner-box-login">
        <h1>Reset password</h1>
        <form onSubmit={handleSignupSubmit}>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          <div className="input-group">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={toggleShowPassword}
            />{" "}
            Show Password
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

export default ResetPassword;
