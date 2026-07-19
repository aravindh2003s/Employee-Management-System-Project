import React, { useState, useEffect } from 'react';
import attendanceService from '../services/attendance.service';
import authService from '../services/auth.service';
import { toast } from 'react-hot-toast';

const Attendance = () => {
    const user = authService.getCurrentUser();
    const isAdmin = user && user.role === 'ROLE_ADMIN';
    
    const [attendanceList, setAttendanceList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Simplistic local state to show clock in/out status on buttons
    const [isCheckedIn, setIsCheckedIn] = useState(false);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            if (isAdmin) {
                const data = await attendanceService.getAllAttendance();
                setAttendanceList(data);
            } else {
                const data = await attendanceService.getMyAttendance();
                setAttendanceList(data);
                
                // Determine if currently checked in based on today's records
                const today = new Date().toISOString().split('T')[0];
                const activeRecord = data.find(record => record.date === today && !record.checkOutTime);
                setIsCheckedIn(!!activeRecord);
            }
        } catch (error) {
            console.error("Error fetching attendance:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const handleClockIn = async () => {
        try {
            await attendanceService.checkIn();
            setIsCheckedIn(true);
            toast.success('Successfully checked in!');
            fetchAttendance();
        } catch (error) {
            toast.error('Failed to check in: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleClockOut = async () => {
        try {
            await attendanceService.checkOut();
            setIsCheckedIn(false);
            toast.success('Successfully checked out!');
            fetchAttendance();
        } catch (error) {
            toast.error('Failed to check out: ' + (error.response?.data?.message || error.message));
        }
    };

    const formatTime = (timeArray) => {
        if (!timeArray) return '--:--';
        // Backend returns [hour, minute, second, nano]
        const [hour, minute] = timeArray;
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        const displayMinute = minute.toString().padStart(2, '0');
        return `${displayHour}:${displayMinute} ${period}`;
    };

    return (
        <>
            <div className="hero-section" style={{ marginBottom: '20px' }}>
                <div>
                    <h1 className="hero-title">{isAdmin ? 'Company Attendance' : 'My Attendance'}</h1>
                    <p className="hero-subtitle">{isAdmin ? 'Monitor employee check-ins and check-outs across the organization.' : 'Manage your daily check-ins and view your attendance history.'}</p>
                </div>
                {!isAdmin && (
                    <div className="hero-actions">
                        {!isCheckedIn ? (
                            <button className="btn btn-primary" onClick={handleClockIn}>
                                <i className="fa-solid fa-right-to-bracket"></i> Clock In
                            </button>
                        ) : (
                            <button className="btn btn-secondary" onClick={handleClockOut} style={{ background: 'var(--accent-orange)', color: 'white', borderColor: 'var(--accent-orange)' }}>
                                <i className="fa-solid fa-right-from-bracket"></i> Clock Out
                            </button>
                        )}
                    </div>
                )}
            </div>


            <div className="table-card">
                <h3 style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', margin: 0 }}>Recent Records</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            {isAdmin && <th>Employee</th>}
                            <th>Status</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={isAdmin ? 6 : 4} style={{textAlign: 'center', padding: '20px'}}>Loading records...</td></tr>
                        ) : attendanceList.length === 0 ? (
                            <tr><td colSpan={isAdmin ? 6 : 4} style={{textAlign: 'center', padding: '20px'}}>No attendance records found.</td></tr>
                        ) : (
                            attendanceList.slice().reverse().map(record => (
                                <tr key={record.id}>
                                    <td><strong>{record.date}</strong></td>
                                    {isAdmin && (
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div className="stat-icon-wrapper icon-purple" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                                    <i className="fa-solid fa-user"></i>
                                                </div>
                                                {record.user ? `${record.user.firstName} ${record.user.lastName}` : `EMP-${record.userId || 'Unknown'}`}
                                            </div>
                                        </td>
                                    )}
                                    <td>
                                        <span className={`status-pill status-active`}>
                                            {record.status || 'PRESENT'}
                                        </span>
                                    </td>
                                    <td><span style={{ color: 'var(--success-color)', fontWeight: '500' }}>{formatTime(record.checkInTime)}</span></td>
                                    <td><span style={{ color: record.checkOutTime ? 'var(--text-color)' : 'var(--text-secondary)' }}>{formatTime(record.checkOutTime)}</span></td>
                                    {isAdmin && (
                                        <td>
                                            <button className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '12px' }}>Edit</button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Attendance;
