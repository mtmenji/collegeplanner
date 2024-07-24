import React, { useRef, useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const emailRef = useRef();
    const { resetPassword } = useAuth();
    const [error, setError] = useState('');
    const [message, setMessage] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();        
        try {
            setMessage('');
            setError('');
            setLoading(true);
            await resetPassword(emailRef.current.value);
            setMessage('Check your inbox for further instructions.');
        } catch (error) {
            setError('Failed to reset password.');
        }
        setLoading(false);
    }

    return (
        <>
            <div>
                <div>
                    <h2>Password Reset</h2>
                    {error && <div>{error}</div>}
                    {message && <div>{message}</div>}
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Email</label>
                            <input type="email" ref={emailRef} required />
                        </div>
                        <button type="submit" disabled={loading}>
                            Reset Password
                        </button>
                    </form>
                    <div>
                        <Link to="/login">Login</Link>
                    </div>
                </div>
            </div>
            <div>
                Need an account? <Link to="/signup">Sign Up</Link>
            </div>
        </>
    );
}