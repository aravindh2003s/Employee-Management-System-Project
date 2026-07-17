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
        </>
    );
};

export default EmployeeDashboard;
