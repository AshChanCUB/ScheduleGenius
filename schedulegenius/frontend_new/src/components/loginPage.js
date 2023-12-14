import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/reducers/userSlice";
import { Link } from "react-router-dom";
import myImage from "./images/planner.jpg";
import "./css/style.css"; // Import your custom CSS file

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Fetch response received:", response);
      const data = await response.json();
      if (response.ok) {
        console.log("Redirecting to home page:", data);

        // Dispatch user_id to Redux store and save it to local storage
        dispatch(setUser({ user_id: data.user_id }));
        localStorage.setItem("userId", data.user_id);

        navigate("/home"); // Redirect to the home page
      } else {
        console.log("Login failed:", data.message);
        // Display an error message to the user
        alert(
          "Login failed. Please check your email or password and try again."
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Display a network error message to the user
      //alert('Network error. Please try again later.');
    }
  };

  return (
    <div className="container">
      <div className="image-container">
        <img src={myImage} alt="Calendar" className="background-image" />
      </div>
      <form onSubmit={handleLoginSubmit}>
        <div className="inner-box-login">
          <h1>Login</h1>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
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
            <button type="submit">Login</button>
            <Link to="/">
              <button type="back">back</button>
            </Link>
          </div>
          <div className = "misc-group">
          <Link to="/forgotpass">Forgot password?</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
