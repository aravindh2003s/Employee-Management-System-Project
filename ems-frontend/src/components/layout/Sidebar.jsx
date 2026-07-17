import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import authService from '../../services/auth.service';
import notificationService from '../../services/notification.service';

const Sidebar = () => {
    const user = authService.getCurrentUser();
    const isAdmin = user && user.role === 'ROLE_ADMIN';
    const navigate = useNavigate();

    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getMyNotifications();
            setNotifications(data || []);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Polling every 30 seconds for new notifications
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleLogout = (e) => {
        e.preventDefault();
        authService.logout();
        navigate('/login');
    };

    const handleNotificationClick = async (notif) => {
        if (!notif.isRead) {
            try {
                await notificationService.markAsRead(notif.id);
                fetchNotifications(); // Refresh to update badge
            } catch (error) {
                console.error("Failed to mark notification as read", error);
            }
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <aside className="sidebar">
            <div className="brand-logo">
                <div className="brand-icon">
                    <i className="fa-solid fa-bolt"></i>
                </div>
                <span>GlowTech<br/><span style={{fontSize: '12px', fontWeight: '400'}}>EMS</span></span>
            </div>
            
            <ul className="nav-menu">
                {isAdmin ? (
                    <>
                        <li>
                            <NavLink to="/admin-dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <i className="fa-solid fa-border-all"></i> Admin Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/employees" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <i className="fa-solid fa-users"></i> Employees
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/departments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <i className="fa-solid fa-sitemap"></i> Departments
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/attendance" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <i className="fa-regular fa-clock"></i> Attendance
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/leaves" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <i className="fa-regular fa-calendar-check"></i> Leave Requests
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/payroll" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <i className="fa-solid fa-wallet"></i> Payroll
                            </NavLink>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <NavLink to="/employee-dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <i className="fa-solid fa-border-all"></i> My Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/attendance" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <i className="fa-regular fa-clock"></i> My Attendance
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/leaves" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <i className="fa-regular fa-calendar-check"></i> My Leaves
                            </NavLink>
                        </li>
                        <li>
                            <a href="#" className="nav-item">
                                <i className="fa-solid fa-wallet"></i> Salary Slips
                            </a>
                        </li>
                    </>
                )}

                <li>
                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); setShowNotifications(true); }}>
                        <i className="fa-regular fa-bell"></i> Notifications
                        {unreadCount > 0 && (
                            <span style={{ background: 'var(--accent-orange)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', marginLeft: 'auto' }}>
                                {unreadCount}
                            </span>
                        )}
                    </a>
                </li>
                <li style={{ marginTop: 'auto' }}>
                    <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <i className="fa-solid fa-gear"></i> Settings
                    </NavLink>
                </li>
                <li>
                    <a href="#" className="nav-item" onClick={handleLogout}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
                    </a>
                </li>
            </ul>

            {/* Notifications Modal */}
            <AnimatePresence>
            {showNotifications && (
                <div className="modal-overlay active">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="modal-content" style={{ maxWidth: '400px', padding: '20px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h2 style={{ fontSize: '18px', margin: 0 }}>Notifications</h2>
                            <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowNotifications(false)}></i>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                            {notifications.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0' }}>No notifications found.</p>
                            ) : (
                                notifications.map(notif => (
                                    <div 
                                        key={notif.id} 
                                        onClick={() => handleNotificationClick(notif)}
                                        style={{ 
                                            padding: '12px', 
                                            borderRadius: '8px', 
                                            background: notif.isRead ? 'var(--bg-color)' : 'rgba(249, 115, 22, 0.05)',
                                            border: notif.isRead ? '1px solid var(--surface-border)' : '1px solid rgba(249, 115, 22, 0.2)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: notif.isRead ? 'var(--text-primary)' : 'var(--accent-orange)' }}>
                                            {notif.title}
                                            {!notif.isRead && <span style={{ width: '8px', height: '8px', background: 'var(--accent-orange)', borderRadius: '50%', display: 'inline-block', marginLeft: '5px' }}></span>}
                                        </h4>
                                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{notif.message}</p>
                                        <small style={{ display: 'block', marginTop: '5px', fontSize: '10px', color: '#94a3b8' }}>
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </small>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
            </AnimatePresence>
        </aside>
    );
};

export default Sidebar;
