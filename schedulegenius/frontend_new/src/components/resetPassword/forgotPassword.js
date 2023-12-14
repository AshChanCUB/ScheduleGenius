import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import myImage from "../images/planner.jpg";
import "../css/style.css"; // Import your custom CSS file

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const navigate = useNavigate();
  const securityQuestions = [
    "What is your mother's maiden name?",
    "In which city were you born?",
    "What is the name of your first pet?",
    // Add more security questions as needed
  ];

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleSecurityQuestion = (e) => setSecurityQuestion(e.target.value);
  const handleSecurityAnswer = (e) => setSecurityAnswer(e.target.value);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/sendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, securityQuestion, securityAnswer }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/verifyotp");
      } else {
        if (data.message.includes("email")) {
          alert("Incorrect email");
        } else if (data.message.includes("question")) {
          alert("Incorrect security question");
        } else {
          alert("Incorrect security answer");
        }
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  return (
    <div className="container">
      <div className="image-container">
        <img src={myImage} alt="Calendar" className="background-image" />
      </div>
      <div className="inner-box-forgot">
        <h1>Forgot Password</h1>
        <form onSubmit={handleFormSubmit}>
          <div className="input-group">
            <label>Email: </label>
            <input type="email" value={email} onChange={handleEmailChange} />
          </div>
          <div className="input-group">
            <label>Security Question: </label>
            <select value={securityQuestion} onChange={handleSecurityQuestion}>
              <option value="" disabled>
                Select a Security Question
              </option>
              {securityQuestions.map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Answer: </label>
            <input
              type="text"
              placeholder="Security Answer"
              value={securityAnswer}
              onChange={handleSecurityAnswer}
            />
          </div>
          <div className="button-group">
            <button type="submit">send otp</button>
            <Link to="/login">
              <button type="back">back</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPass;
