import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Link } from 'react-router-dom';
import myImage from "./images/planner.jpg";
import "./css/style.css"; // Import your custom CSS file


function SignupPage() {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [securityQuestion, setSecurityQuestion] = useState(''); 
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Create a navigate function

  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleLastNameChange = (e) => setLastName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handleSecurityQuestion = (e) => setSecurityQuestion(e.target.value);
  const handleSecurityAnswer = (e) => setSecurityAnswer(e.target.value);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const securityQuestions = [
    'What is your mother\'s maiden name?',
    'In which city were you born?',
    'What is the name of your first pet?',
    // Add more security questions as needed
  ];
  
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        console.log('Passwords do not match');
        // Display an error message to the user
        alert('Passwords do not match');
        return;
      }
      
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstname, lastname, email, password, securityQuestion, securityAnswer }),
      });
      
      const data = await response.json();
      if (response.ok) {
        console.log('Signup successful:', data);
        navigate('/login'); // Redirect to the login page
      } else {
        alert(data.message)
        console.log('Signup failed:', data.message);
        // Display an error message to the user
      }
    } catch (error) {
      console.error('Error during signup:', error);
      // Display a network error message to the user
    }
  };

  return (
    <div className="container">
      <div className="image-container">
        <img src={myImage} alt="Calendar" className="background-image" />
      </div>
      <div className='inner-box-signup'>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignupSubmit}>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="First Name" 
            value={firstname} 
            onChange={handleFirstNameChange} 
          />
        </div>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Last Name" 
            value={lastname} 
            onChange={handleLastNameChange} 
          />
        </div>
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
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="input-group">
          <input
          type={showPassword ? 'text' : 'password'}
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
          />{' '}
          Show Password
        </div>
        <div className="input-group">
          <label>
            Security Question:
            <select value={securityQuestion} onChange={handleSecurityQuestion}>
              <option value="" disabled>Select a Security Question</option>
              {securityQuestions.map((question, index) => (
                <option key={index} value={question}>{question}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="input-group">
          <label>
            Answer:
            <input
              type="text"
              placeholder="Security Answer"
              value={securityAnswer}
              onChange={handleSecurityAnswer}
            />
          </label>
        </div>
        <div className="button-group">
        <button type="submit">Sign Up</button> 
        <Link to='/'>
        <button type="back">back</button>
        </Link>
        </div>
      </form>
      </div>
    </div>
  );
}

export default SignupPage;