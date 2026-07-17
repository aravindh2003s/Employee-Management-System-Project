import React, { useState } from 'react';
import { motion } from 'framer-motion';
import authService from '../services/auth.service';
import { toast } from 'react-hot-toast';

const Settings = () => {
    const user = authService.getCurrentUser() || {};
    const isAdmin = user.role === 'ROLE_ADMIN';

    // ==========================================
    // ADMIN SETTINGS STATES
    // ==========================================
    const [companyInfo, setCompanyInfo] = useState({
        name: 'GlowTech EMS',
        email: 'contact@glowtech.com',
        phone: '+1 (555) 123-4567',
        address: '123 Innovation Drive, Tech City, TC 90210'
    });

    const [adminProfile, setAdminProfile] = useState({
        fullName: `${user.firstName || 'Aravindhan'} ${user.lastName || 'S'}`,
        email: user.email || 'aravindh2003s@gmail.com',
        phone: user.phoneNumber || '+91 9876543210'
    });

    const [adminNotifications, setAdminNotifications] = useState({
        employeeAdded: true,
        leaveRequest: true,
        attendanceAlerts: false
    });

    // ==========================================
    // EMPLOYEE SETTINGS STATES
    // ==========================================
    const [empProfile, setEmpProfile] = useState({
        fullName: `${user.firstName || 'Employee'} ${user.lastName || 'Name'}`,
        email: user.email || 'employee@glowtech.com',
        phone: user.phoneNumber || '+1 555-0000',
        employeeId: user.employeeId || 'EMP-001',
        department: 'Engineering', // Would come from user info ideally
        position: 'Software Engineer' // Would come from user info ideally
    });

    const [empNotifications, setEmpNotifications] = useState({
        emailNotifications: true,
        appNotifications: true
    });

    // ==========================================
    // SHARED / HANDLERS
    // ==========================================
    const handleSave = (e, message) => {
        e.preventDefault();
        toast.success(message);
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        toast.success('Password changed successfully!');
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <h2>Settings</h2>
                <div className="header-actions">
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', paddingBottom: '30px' }}>
                
                {isAdmin ? (
                    <>
                        {/* 1. Company Information */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="table-card" style={{ padding: '24px' }}>
                            <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>1. Company Information</h3>
                            <form onSubmit={(e) => handleSave(e, 'Company Information saved successfully!')} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                                    <div style={{ width: '60px', height: '60px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-orange)', fontSize: '24px' }}>
                                        <i className="fa-solid fa-bolt"></i>
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Upload Logo</button>
                                    </div>
                                </div>
                                
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Company Name</label>
                                    <input type="text" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box' }} value={companyInfo.name} onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})} />
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Company Email</label>
                                    <input type="email" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box' }} value={companyInfo.email} onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})} />
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Phone Number</label>
                                    <input type="text" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box' }} value={companyInfo.phone} onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})} />
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Address</label>
                                    <textarea className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', resize: 'none', height: '80px', width: '100%', boxSizing: 'border-box' }} value={companyInfo.address} onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', alignSelf: 'flex-start' }}>Save Changes</button>
                            </form>
                        </motion.div>

                        {/* 2. Admin Profile */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="table-card" style={{ padding: '24px' }}>
                            <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>2. Admin Profile</h3>
                            <form onSubmit={(e) => handleSave(e, 'Admin Profile updated successfully!')} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                                    <div style={{ width: '60px', height: '60px', background: 'var(--accent-orange)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                                        {adminProfile.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Change Picture</button>
                                    </div>
                                </div>

                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Full Name</label>
                                    <input type="text" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box' }} value={adminProfile.fullName} onChange={(e) => setAdminProfile({...adminProfile, fullName: e.target.value})} />
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Email</label>
                                    <input type="email" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box' }} value={adminProfile.email} onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})} />
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Phone Number</label>
                                    <input type="text" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box' }} value={adminProfile.phone} onChange={(e) => setAdminProfile({...adminProfile, phone: e.target.value})} />
                                </div>
                                
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button type="submit" className="btn btn-primary">Update Profile</button>
                                    <button type="button" className="btn btn-secondary" onClick={handleChangePassword}>Change Password</button>
                                </div>
                            </form>
                        </motion.div>

                        {/* 3. Notifications */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="table-card" style={{ padding: '24px' }}>
                            <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>3. Notifications</h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Choose which notifications you would like to receive via email.</p>
                            
                            <form onSubmit={(e) => handleSave(e, 'Notification preferences saved!')} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
                                    <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: 'var(--accent-orange)' }} checked={adminNotifications.employeeAdded} onChange={(e) => setAdminNotifications({...adminNotifications, employeeAdded: e.target.checked})} />
                                    Employee Added
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
                                    <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: 'var(--accent-orange)' }} checked={adminNotifications.leaveRequest} onChange={(e) => setAdminNotifications({...adminNotifications, leaveRequest: e.target.checked})} />
                                    Leave Request Submitted
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
                                    <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: 'var(--accent-orange)' }} checked={adminNotifications.attendanceAlerts} onChange={(e) => setAdminNotifications({...adminNotifications, attendanceAlerts: e.target.checked})} />
                                    Attendance Alerts (Late/Absent)
                                </label>

                                <button type="submit" className="btn btn-primary" style={{ marginTop: '20px', alignSelf: 'flex-start' }}>Save Preferences</button>
                            </form>
                        </motion.div>
                    </>
                ) : (
                    <>
                        {/* ---------------- EMPLOYEE SETTINGS ---------------- */}

                        {/* 1. My Profile */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="table-card" style={{ padding: '24px' }}>
                            <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>1. My Profile</h3>
                            <form onSubmit={(e) => handleSave(e, 'Profile updated successfully!')} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                                    <div style={{ width: '60px', height: '60px', background: 'var(--accent-cyan)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                                        {empProfile.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Change Picture</button>
                                    </div>
                                </div>

                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Full Name</label>
                                    <input type="text" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box' }} value={empProfile.fullName} onChange={(e) => setEmpProfile({...empProfile, fullName: e.target.value})} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Employee ID</label>
                                        <input type="text" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-bg)', color: 'var(--text-secondary)' }} value={empProfile.employeeId} readOnly />
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Department</label>
                                        <input type="text" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-bg)', color: 'var(--text-secondary)' }} value={empProfile.department} readOnly />
                                    </div>
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Position</label>
                                    <input type="text" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-bg)', color: 'var(--text-secondary)' }} value={empProfile.position} readOnly />
                                </div>

                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Email</label>
                                    <input type="email" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box' }} value={empProfile.email} onChange={(e) => setEmpProfile({...empProfile, email: e.target.value})} />
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Phone Number</label>
                                    <input type="text" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box' }} value={empProfile.phone} onChange={(e) => setEmpProfile({...empProfile, phone: e.target.value})} />
                                </div>
                                
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', alignSelf: 'flex-start' }}>Update Profile</button>
                            </form>
                        </motion.div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* 2. Security */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="table-card" style={{ padding: '24px' }}>
                                <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>2. Security</h3>
                                <button type="button" className="btn btn-secondary" onClick={handleChangePassword}>Change Password</button>
                            </motion.div>

                            {/* 3. Notifications */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="table-card" style={{ padding: '24px' }}>
                                <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>3. Notifications</h3>
                                <form onSubmit={(e) => handleSave(e, 'Notification preferences saved!')} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
                                        <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: 'var(--accent-orange)' }} checked={empNotifications.emailNotifications} onChange={(e) => setEmpNotifications({...empNotifications, emailNotifications: e.target.checked})} />
                                        Email Notifications
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
                                        <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: 'var(--accent-orange)' }} checked={empNotifications.appNotifications} onChange={(e) => setEmpNotifications({...empNotifications, appNotifications: e.target.checked})} />
                                        App Notifications
                                    </label>
                                    <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', alignSelf: 'flex-start' }}>Save Preferences</button>
                                </form>
                            </motion.div>
                        </div>
                    </>
                )}

                {/* 4. About */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="table-card" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>4. About</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--surface-border)', paddingBottom: '10px' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Application Name</span>
                            <span style={{ fontWeight: '500', fontSize: '14px' }}>GlowTech EMS</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--surface-border)', paddingBottom: '10px' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Version</span>
                            <span style={{ fontWeight: '500', fontSize: '14px' }}>v1.0.0</span>
                        </div>
                        {isAdmin ? (
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--surface-border)', paddingBottom: '10px' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Developer</span>
                                <span style={{ fontWeight: '500', fontSize: '14px' }}>HRMS Dev Team</span>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--surface-border)', paddingBottom: '10px' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Contact HR</span>
                                <span style={{ fontWeight: '500', fontSize: '14px' }}>hr@glowtech.com</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '5px' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Copyright</span>
                            <span style={{ fontWeight: '500', fontSize: '14px' }}>&copy; 2026 GlowTech Inc.</span>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default Settings;
