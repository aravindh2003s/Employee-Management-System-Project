import React, { useState } from 'react';

const Header = ({ onMenuToggle }) => {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="top-header">
            <button className="mobile-menu-btn" onClick={onMenuToggle} style={{ display: 'none' }}>
                <i className="fa-solid fa-bars"></i>
            </button>
            <div className="search-container">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" className="search-input" placeholder="Search..." />
            </div>
            
            <div className="header-actions">
                <div className="notification-container" style={{ position: 'relative' }}>
                    <div 
                        className="icon-btn" 
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <i className="fa-regular fa-bell"></i>
                    </div>
                    
                    {showNotifications && (
                        <div className="notification-dropdown" style={{
                            position: 'absolute',
                            top: '50px',
                            right: '0',
                            width: '280px',
                            background: '#fff',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            border: '1px solid #e2e8f0',
                            padding: '16px',
                            zIndex: '100'
                        }}>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#111827' }}>Notifications</h4>
                            <div style={{ fontSize: '13px', color: '#64748B', textAlign: 'center', padding: '20px 0' }}>
                                No new notifications
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
