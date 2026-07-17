import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const data = await authService.login(email, password);
            toast.success('Login successful!');
            setEmail('');
            setPassword('');
            if (data.role === 'ROLE_ADMIN') {
                navigate('/admin-dashboard');
            } else {
                navigate('/employee-dashboard');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data || 'Login failed. Please check your credentials.';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            {/* Top Navigation Bar */}
            <div className="auth-top-nav">
                <div className="auth-nav-logo">Logo</div>
                <div className="auth-nav-links">
                    <a href="#">Home</a>
                    <a href="#">About</a>
                    <a href="#">Services</a>
                    <a href="#">Contact</a>
                    <button className="auth-nav-btn">Login</button>
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

                <h1 className="auth-title">Login</h1>
                
                <form onSubmit={handleLogin} autoComplete="off">
                    {error && <div className="auth-error">{error}</div>}
                    
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
                    
                    <div className="auth-options">
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#">Forget Password?</a>
                    </div>
                    
                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <div className="auth-footer-link">
                    Don't have an account? <Link to="/signup">Register</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
