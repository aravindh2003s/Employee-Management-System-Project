import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import authService from '../services/auth.service';
import attendanceService from '../services/attendance.service';

const EmployeeDashboard = () => {
    const user = authService.getCurrentUser();
    const navigate = useNavigate();

    const [isCheckedIn, setIsCheckedIn] = useState(false);

    const fetchAttendance = async () => {
        try {
            const data = await attendanceService.getMyAttendance();
            const today = new Date().toISOString().split('T')[0];
            const activeRecord = data.find(record => record.date === today && !record.checkOutTime);
            setIsCheckedIn(!!activeRecord);
        } catch (error) {
            console.error("Error fetching attendance:", error);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const handleCheckIn = async () => {
        try {
            await attendanceService.checkIn();
            setIsCheckedIn(true);
            toast.success('Successfully checked in!');
            fetchAttendance();
        } catch (error) {
            toast.error('Failed to check in: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleCheckOut = async () => {
        try {
            await attendanceService.checkOut();
            setIsCheckedIn(false);
            toast.success('Successfully checked out!');
            fetchAttendance();
        } catch (error) {
            toast.error('Failed to check out: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <>
            <div className="hero-section">
                <div>
                    <h1 className="hero-title">Welcome back, {user?.username} 👋</h1>
                    <p className="hero-subtitle">Here is your personal employee overview.</p>
                </div>
                <div className="hero-actions">
                    <button 
                        className="btn btn-primary" 
                        onClick={handleCheckIn}
                        disabled={isCheckedIn}
                        style={{ opacity: isCheckedIn ? 0.5 : 1, cursor: isCheckedIn ? 'not-allowed' : 'pointer' }}
                    >
                        <i className="fa-solid fa-right-to-bracket"></i> Check In
                    </button>
                    <button 
                        className="btn btn-secondary" 
                        onClick={handleCheckOut}
                        disabled={!isCheckedIn}
                        style={{ opacity: !isCheckedIn ? 0.5 : 1, cursor: !isCheckedIn ? 'not-allowed' : 'pointer' }}
                    >
                        <i className="fa-solid fa-right-from-bracket"></i> Check Out
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate('/leaves')}><i className="fa-regular fa-calendar-plus"></i> Request Leave</button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper icon-blue"><i className="fa-regular fa-id-badge"></i></div>
                        My Profile
                    </div>
                    <div className="stat-value-row">
                        <div className="stat-value" style={{ fontSize: '18px' }}>EMP-{user?.employeeId}</div>
                    </div>
                    <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Department: Engineering<br/>
                        Role: {user?.role === 'ROLE_EMPLOYEE' ? 'Standard Employee' : 'Admin'}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper icon-green"><i className="fa-solid fa-calendar-check"></i></div>
                        Leave Balance
                    </div>
                    <div className="stat-value-row">
                        <div className="stat-value">12 Days</div>
                        <div className="trend up"><i className="fa-solid fa-arrow-trend-up"></i> Available</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper icon-purple"><i className="fa-solid fa-business-time"></i></div>
                        Hours This Week
                    </div>
                    <div className="stat-value-row">
                        <div className="stat-value">32.5h</div>
                    </div>
                </div>
            </div>

            <div className="widgets-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="widget-card">
                    <div className="widget-title">Recent Activity</div>
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-text">Clocked In</div>
                            <div className="timeline-time">Today, 09:00 AM</div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-text">Leave Request Approved</div>
                            <div className="timeline-time">Yesterday, 14:30 PM</div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-text">Clocked Out</div>
                            <div className="timeline-time">Yesterday, 17:15 PM</div>
                        </div>
                    </div>
                </div>

                <div className="widget-card">
                    <div className="widget-title">Upcoming Holidays</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Independence Day</span>
                            <span style={{ color: 'var(--text-secondary)' }}>Jul 4th</span>
                        </li>
                        <li style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Labor Day</span>
                            <span style={{ color: 'var(--text-secondary)' }}>Sep 2nd</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="table-card" style={{ padding: '40px', marginTop: '30px', lineHeight: '1.8' }}>
                <h2 style={{ marginBottom: '30px', color: 'var(--text-primary)', borderBottom: '2px solid var(--accent-orange)', paddingBottom: '10px', display: 'inline-block' }}>About GrowTech</h2>
                
                <h3 style={{ marginTop: '10px', marginBottom: '15px', color: 'var(--GrowTech-secondary)' }}>Welcome to GrowTech</h3>
                <p style={{ marginBottom: '15px', color: 'var(--text-secondary)', fontSize: '15px' }}>At GrowTech, we are passionate about building innovative, reliable, and user-friendly software solutions that empower businesses to grow in the digital world. Our team specializes in developing modern web applications, mobile applications, and custom software tailored to meet real business needs.</p>
                <p style={{ marginBottom: '30px', color: 'var(--text-secondary)', fontSize: '15px' }}>As part of our commitment to improving workplace productivity, we developed our own Employee Management System (EMS)—a centralized platform designed to simplify employee management and enhance organizational efficiency.</p>

                <h3 style={{ marginTop: '20px', marginBottom: '15px', color: 'var(--GrowTech-secondary)' }}>About the Employee Management System (EMS)</h3>
                <p style={{ marginBottom: '30px', color: 'var(--text-secondary)', fontSize: '15px' }}>The Employee Management System is an all-in-one platform that helps organizations manage their workforce with ease. It enables employees and administrators to access essential information, streamline daily operations, and improve communication within the organization.</p>

                <h3 style={{ marginTop: '20px', marginBottom: '15px', color: 'var(--GrowTech-secondary)' }}>Key Features</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px', marginBottom: '40px' }}>
                    {[
                        'Secure employee login and role-based access',
                        'Employee profile management',
                        'Attendance and leave management',
                        'Task and project tracking',
                        'Document and information management',
                        'Dashboard with real-time insights',
                        'Responsive design for desktop and mobile devices'
                    ].map((feature, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-orange)' }}></i>
                            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{feature}</span>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                    <div style={{ background: 'rgba(49, 77, 120, 0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(49, 77, 120, 0.1)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--GrowTech-secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', fontSize: '18px' }}>
                            <i className="fa-solid fa-rocket"></i>
                        </div>
                        <h3 style={{ marginBottom: '10px', color: 'var(--GrowTech-secondary)' }}>Our Mission</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>To deliver high-quality digital solutions that simplify business processes, improve productivity, and create lasting value for our clients and employees.</p>
                    </div>
                    <div style={{ background: 'rgba(252, 170, 41, 0.05)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(252, 170, 41, 0.1)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-orange)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', fontSize: '18px' }}>
                            <i className="fa-solid fa-eye"></i>
                        </div>
                        <h3 style={{ marginBottom: '10px', color: 'var(--accent-orange)' }}>Our Vision</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>To become a trusted technology partner by delivering innovative, scalable, and reliable software solutions that make a positive impact on businesses worldwide.</p>
                    </div>
                </div>

                <h3 style={{ marginTop: '20px', marginBottom: '20px', color: 'var(--GrowTech-secondary)' }}>Our Core Values</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '40px' }}>
                    {['Innovation', 'Quality', 'Transparency', 'Collaboration', 'Continuous Learning', 'Customer Success'].map(value => (
                        <span key={value} style={{ background: 'white', border: '1px solid var(--accent-orange)', color: 'var(--accent-orange)', padding: '8px 20px', borderRadius: '30px', fontSize: '14px', fontWeight: '600' }}>
                            {value}
                        </span>
                    ))}
                </div>

                <div style={{ textAlign: 'center', padding: '40px 20px', background: 'linear-gradient(135deg, var(--GrowTech-secondary) 0%, #1a2a40 100%)', color: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                    <i className="fa-solid fa-quote-left" style={{ fontSize: '30px', color: 'var(--accent-orange)', marginBottom: '20px', opacity: '0.8' }}></i>
                    <p style={{ fontSize: '18px', fontWeight: '500', margin: '0 auto', maxWidth: '800px', lineHeight: '1.6' }}>
                        Thank you for being a part of GrowTech. Together, we are building technology that drives growth, efficiency, and innovation.
                    </p>
                </div>
            </div>
        </>
    );
};

export default EmployeeDashboard;
