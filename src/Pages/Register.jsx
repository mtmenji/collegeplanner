import React, { useState } from 'react';
import './Register.css';
import { useAuth } from '../Contexts/AuthContext'

const Register = () => {
    console.log('Rendering Register Page');

  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth()

  const handleNameChange = (e) => {
    setName(e.target.value);
    setError('');
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
    } else {
      setError('');
      signup(email, password, name)
    }
  };

  const getPasswordConfirmStyle = () => {
    if (passwordConfirm === '') {
      return {};
    }
    return password === passwordConfirm ? { backgroundColor: '#BBFFA7' } : { backgroundColor: '#FFB6A7' };
  };

  return (
    <div className="registrationForm">
        <section id="registrationFormBox">
            <h1>Registration Form</h1>
            <p>Please enter some basic information to create an account.</p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Provide Your Name:</label><br />
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={name}
                  onChange={handleNameChange}
                /><br />
                
                <label htmlFor="email">Enter Email:</label><br />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                /><br />
            
                <label htmlFor="password">Create Password:</label><br />
                <input
                type="password"
                id="password"
                name="password"
                required
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must contain at least one number, one uppercase letter, one lowercase letter, and at least 8 characters"
                value={password}
                onChange={handlePasswordChange}
                /><br />
                
                <label htmlFor="passwordConfirm">Confirm Password:</label><br />
                <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                required
                value={passwordConfirm}
                onChange={handlePasswordConfirmChange}
                style={getPasswordConfirmStyle()}
                /><br />
                
                {error && <span id="passwordError">{error}</span>}<br />
                
                <button type="submit">Start Tracking!</button>
            </form>
            <p>Already have an account? <a href="/login">Sign In</a></p>
        </section>
    </div>
  );
}

export default Register;