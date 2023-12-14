import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import myImage from "./images/planner.jpg";
import "./css/style.css"; // Import your custom CSS file

function LandingPage() {
  return (
    <div className="intro-container">
      <div className="image-container">
        <img src={myImage} alt="Calendar" className="background-image" />
      </div>
      <h1>Welcome to Schedule Genius</h1>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/login"
        style={{ marginRight: "10px" }}
      >
        Login
      </Button>
      <Button
        variant="contained"
        color="secondary"
        component={Link}
        to="/signup"
      >
        Sign Up
      </Button>
    </div>
  );
}

export default LandingPage;
