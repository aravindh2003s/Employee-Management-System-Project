import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import authService from '../services/auth.service';
import profileService from '../services/profile.service';
import { toast } from 'react-hot-toast';

const Settings = () => {
    const user = authService.getCurrentUser() || {};
    const isAdmin = user.role === 'ROLE_ADMIN';
    const fileInputRef = useRef(null);

    // ==========================================
    // ADMIN SETTINGS STATES
    // ==========================================
    const [companyInfo, setCompanyInfo] = useState({
        name: 'GrowTech EMS',
        email: 'contact@GrowTech.com',
        phone: '+1 (555) 123-4567',
        address: '123 Innovation Drive, Tech City, TC 90210'
    });

    const [adminProfile, setAdminProfile] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phoneNumber || ''
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
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        employeeId: user.employeeId || 'EMP-001',
        department: user.departmentName || 'Not Assigned',
        position: user.designation || 'Not Assigned'
    });

    const [empNotifications, setEmpNotifications] = useState({
        emailNotifications: true,
        appNotifications: true
    });

    // ==========================================
    // PASSWORD MODAL STATE
    // ==========================================
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: ''
    });

    // ==========================================
    // HANDLERS
    // ==========================================
    const handleSaveCompanyInfo = (e) => {
        e.preventDefault();
        toast.success('Company Information saved successfully!');
    };

    const handleSaveNotifications = (e) => {
        e.preventDefault();
        toast.success('Notification preferences saved!');
    };

    const handleProfileUpdate = async (e, isAd) => {
        e.preventDefault();
        const profileData = isAd ? adminProfile : empProfile;
        try {
            const res = await profileService.updateProfileInfo({
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                email: profileData.email,
                phoneNumber: profileData.phone
            });
            authService.updateCurrentUser(res.data);
            toast.success('Profile updated successfully!');
            // If email changed, we might want to tell them to re-login, but let's keep it simple
            if (profileData.email !== user.email) {
                toast.error('Email changed! Please log in again.');
                authService.logout();
                window.location.href = '/login';
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating profile');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            await profileService.changePassword(passwordData);
            toast.success('Password changed successfully!');
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '' });
        } catch (error) {
            toast.error(error.response?.data || 'Error changing password');
        }
    };

    const handlePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const res = await profileService.uploadProfilePicture(file);
            authService.updateCurrentUser(res.data);
            toast.success('Profile picture updated!');
            // Force a re-render or reload to show the image if needed, but since we use authService.getCurrentUser() 
            // inside components, it might need a page reload to reflect globally if context isn't used.
            window.location.reload(); 
        } catch (error) {
            toast.error('Error uploading picture');
        }
    };

    // Helper to get image URL or initial
    const renderAvatar = () => {
        if (user.profilePhotoUrl) {
            return (
                <img 
                    src={`http://localhost:8080${user.profilePhotoUrl}`} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
            );
        }
        return (user.firstName ? user.firstName.charAt(0) : 'U');
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <h2>Settings</h2>
                <div className="header-actions">
                </div>
            </div>

            <div className="settings-grid">
                
                {/* Hidden File Input */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*" 
                    onChange={handlePictureUpload} 
                />

                {isAdmin ? (
                    <>
                        {/* 1. Company Information */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="table-card" style={{ padding: '24px' }}>
                            <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>1. Company Information</h3>
                            <form onSubmit={handleSaveCompanyInfo} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
                            <form onSubmit={(e) => handleProfileUpdate(e, true)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                                    <div style={{ width: '60px', height: '60px', background: 'var(--accent-orange)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                                        {renderAvatar()}
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => fileInputRef.current.click()}>Change Picture</button>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>First Name</label>
                                        <input type="text" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box' }} value={adminProfile.firstName} onChange={(e) => setAdminProfile({...adminProfile, firstName: e.target.value})} required />
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Last Name</label>
                                        <input type="text" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box' }} value={adminProfile.lastName} onChange={(e) => setAdminProfile({...adminProfile, lastName: e.target.value})} required />
                                    </div>
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Email</label>
                                    <input type="email" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box' }} value={adminProfile.email} onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})} required />
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Phone Number</label>
                                    <input type="text" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box' }} value={adminProfile.phone} onChange={(e) => setAdminProfile({...adminProfile, phone: e.target.value})} />
                                </div>
                                
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button type="submit" className="btn btn-primary">Update Profile</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(true)}>Change Password</button>
                                </div>
                            </form>
                        </motion.div>

                        {/* 3. Notifications */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="table-card" style={{ padding: '24px' }}>
                            <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>3. Notifications</h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Choose which notifications you would like to receive via email.</p>
                            
                            <form onSubmit={handleSaveNotifications} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
                            <form onSubmit={(e) => handleProfileUpdate(e, false)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                                    <div style={{ width: '60px', height: '60px', background: 'var(--accent-cyan)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                                        {renderAvatar()}
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => fileInputRef.current.click()}>Change Picture</button>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>First Name</label>
                                        <input type="text" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box' }} value={empProfile.firstName} onChange={(e) => setEmpProfile({...empProfile, firstName: e.target.value})} required />
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Last Name</label>
                                        <input type="text" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box' }} value={empProfile.lastName} onChange={(e) => setEmpProfile({...empProfile, lastName: e.target.value})} required />
                                    </div>
                                </div>

                                <div className="form-row">
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
                                    <input type="email" className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box' }} value={empProfile.email} onChange={(e) => setEmpProfile({...empProfile, email: e.target.value})} required />
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
                                <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(true)}>Change Password</button>
                            </motion.div>

                            {/* 3. Notifications */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="table-card" style={{ padding: '24px' }}>
                                <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>3. Notifications</h3>
                                <form onSubmit={handleSaveNotifications} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
                            <span style={{ fontWeight: '500', fontSize: '14px' }}>GrowTech EMS</span>
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
                                <span style={{ fontWeight: '500', fontSize: '14px' }}>hr@GrowTech.com</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '5px' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Copyright</span>
                            <span style={{ fontWeight: '500', fontSize: '14px' }}>&copy; 2026 GrowTech Inc.</span>
                        </div>
                    </div>
                </motion.div>

            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="modal-overlay">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-content">
                        <div className="modal-header">
                            <h3>Change Password</h3>
                            <button className="close-btn" onClick={() => setShowPasswordModal(false)}><i className="fa-solid fa-times"></i></button>
                        </div>
                        <form onSubmit={handlePasswordChange}>
                            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Current Password</label>
                                    <input type="password" required className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box' }} value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} />
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>New Password</label>
                                    <input type="password" required className="form-control" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--surface-border)', width: '100%', boxSizing: 'border-box' }} value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} />
                                </div>
                            </div>
                            <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Change Password</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Settings;
