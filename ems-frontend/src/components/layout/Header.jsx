import React from 'react';

const Header = () => {
    return (
        <header className="top-header">
            <div className="search-container">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" className="search-input" placeholder="Search..." />
            </div>
            
            <div className="header-actions">
                <div className="icon-btn"><i className="fa-regular fa-bell"></i></div>
                
                <span className="date-display">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                
                <div className="user-profile">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" />
                </div>
            </div>
        </header>
    );
};

export default Header;
