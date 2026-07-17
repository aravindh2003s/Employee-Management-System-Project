import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import './Auth.css';

const Signup = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            await authService.signup(firstName, lastName, email, password);
            toast.success('Registration successful! Please sign in.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || err.response?.data?.message || 'Registration failed.');
            toast.error('Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            {/* Top Navigation Bar */}
            <div className="auth-top-nav">
                <div className="auth-nav-logo">
                    <img src="/logo.png" alt="GrowTech Logo" style={{ height: '40px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                </div>
                <div className="auth-nav-links">
                    <a href="#">Home</a>
                    <a href="#">About</a>
                    <a href="#">Services</a>
                    <a href="#">Contact</a>
                    <button className="auth-nav-btn" onClick={() => navigate('/login')}>Login</button>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="auth-glass-card"
            >
                {/* Close Button */}
                <Link to="/" className="auth-close-btn">
                    <i className="fa-solid fa-xmark"></i>
                </Link>

                <h1 className="auth-title">Register</h1>
                
                <form onSubmit={handleSignup} autoComplete="off">
                    {error && <div className="auth-error">{error}</div>}
                    
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div className="auth-input-group" style={{ flex: 1 }}>
                            <label>First Name</label>
                            <input 
                                type="text" 
                                className="auth-input" 
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required 
                                autoComplete="off"
                            />
                            <i className="fa-solid fa-user auth-input-icon"></i>
                        </div>
                        <div className="auth-input-group" style={{ flex: 1 }}>
                            <label>Last Name</label>
                            <input 
                                type="text" 
                                className="auth-input" 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required 
                                autoComplete="off"
                            />
                            <i className="fa-solid fa-user auth-input-icon"></i>
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            className="auth-input" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            autoComplete="off"
                        />
                        <i className="fa-solid fa-envelope auth-input-icon"></i>
                    </div>
                    
                    <div className="auth-input-group">
                        <label>Password</label>
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            className="auth-input" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            autoComplete="new-password"
                        />
                        <i 
                            className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} auth-input-icon`}
                            style={{ cursor: 'pointer', zIndex: 10 }}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    </div>
                    
                    <button type="submit" className="auth-submit-btn" disabled={loading} style={{ marginTop: '10px' }}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                
                <div className="auth-footer-link">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
