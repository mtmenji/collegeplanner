import React, { useState } from 'react';
import './Login.css';
import { useAuth } from '../Contexts/AuthContext'
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Proceed with form submission or other actions
    console.log('Form submitted');

    try {
      await signIn(email, password); // sign in attempt (see AuthContext.js)
      navigate('/planners');
    }
    catch { // sign in fails with error
      setError('No password match. Check info and try again')
    }
  };

  return (
    <div className="registrationForm">
      <section id="registrationFormBox">
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>            
          <label htmlFor="email">Enter Email:</label><br />
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={handleEmailChange}
            /><br />
            
            <label htmlFor="password">Password:</label><a href="/forgot"> Forgot Password?</a><br />
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={handlePasswordChange}
            /><br />
          
          {error && <span id="passwordError">{error}</span>}<br />
          
          <button type="submit">Sign In</button>
        </form>
        <p>Don't have an account? <a href="/register">Register</a></p>
      </section>
    </div>
  );
}

export default SignIn;