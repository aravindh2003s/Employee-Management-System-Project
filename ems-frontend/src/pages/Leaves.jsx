import React, { useState, useEffect } from 'react';
import leaveService from '../services/leave.service';
import authService from '../services/auth.service';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Leaves = () => {
    const user = authService.getCurrentUser();
    const isAdmin = user && user.role === 'ROLE_ADMIN';
    
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal state for Employee applying for leave
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [newLeave, setNewLeave] = useState({
        startDate: '',
        endDate: '',
        leaveType: 'SICK_LEAVE',
        reason: ''
    });

    // Modal state for Admin approving/rejecting leave
    const [showActionModal, setShowActionModal] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [actionPayload, setActionPayload] = useState({ status: 'APPROVED', adminRemarks: '' });

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const data = isAdmin ? await leaveService.getAllLeaves() : await leaveService.getMyLeaves();
            setLeaves(data);
        } catch (error) {
            console.error("Error fetching leaves:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleApplySubmit = async (e) => {
        e.preventDefault();
        try {
            await leaveService.applyLeave(newLeave);
            setShowApplyModal(false);
            setNewLeave({ startDate: '', endDate: '', leaveType: 'SICK_LEAVE', reason: '' });
            toast.success('Leave request submitted!');
            fetchLeaves();
        } catch (error) {
            toast.error('Failed to apply for leave. ' + (error.response?.data?.message || ''));
        }
    };

    const openActionModal = (leave) => {
        setSelectedLeave(leave);
        setActionPayload({ status: 'APPROVED', adminRemarks: '' });
        setShowActionModal(true);
    };

    const handleActionSubmit = async (e) => {
        e.preventDefault();
        try {
            await leaveService.updateLeaveStatus(selectedLeave.id, actionPayload.status, actionPayload.adminRemarks);
            setShowActionModal(false);
            toast.success(`Leave request ${actionPayload.status.toLowerCase()}!`);
            fetchLeaves();
        } catch (error) {
            toast.error('Failed to update leave status. ' + (error.response?.data?.message || ''));
        }
    };

    const getStatusPillClass = (status) => {
        switch(status) {
            case 'APPROVED': return 'status-active';
            case 'REJECTED': return 'status-leave';
            default: return 'status-pending'; // you can add css for pending
        }
    };

    return (
        <>
            <div className="hero-section" style={{ marginBottom: '20px' }}>
                <div>
                    <h1 className="hero-title">{isAdmin ? 'Leave Management' : 'My Leaves'}</h1>
                    <p className="hero-subtitle">{isAdmin ? 'Review and manage employee time-off requests.' : 'Request time off and view your leave history.'}</p>
                </div>
                {!isAdmin && (
                    <div className="hero-actions">
                        <button className="btn btn-primary" onClick={() => setShowApplyModal(true)}>
                            <i className="fa-solid fa-plus"></i> Request Leave
                        </button>
                    </div>
                )}
            </div>

            <div className="table-card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {isAdmin && <th>Employee</th>}
                            <th>Leave Type</th>
                            <th>Dates</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>HR Remarks</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={isAdmin ? 7 : 5} style={{textAlign: 'center', padding: '20px'}}>Loading leaves...</td></tr>
                        ) : leaves.length === 0 ? (
                            <tr><td colSpan={isAdmin ? 7 : 5} style={{textAlign: 'center', padding: '20px'}}>No leave requests found.</td></tr>
                        ) : (
                            leaves.slice().reverse().map(leave => (
                                <tr key={leave.id}>
                                    {isAdmin && (
                                        <td>
                                            <strong>{leave.user ? `${leave.user.firstName} ${leave.user.lastName}` : `User ${leave.userId}`}</strong>
                                        </td>
                                    )}
                                    <td>{leave.leaveType ? leave.leaveType.replace('_', ' ') : 'N/A'}</td>
                                    <td>{leave.startDate} to {leave.endDate}</td>
                                    <td>
                                        <div style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {leave.reason}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${getStatusPillClass(leave.status)}`}>
                                            {leave.status || 'PENDING'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-secondary)' }}>
                                            {leave.adminRemarks || '-'}
                                        </div>
                                    </td>
                                    {isAdmin && (
                                        <td>
                                            {leave.status === 'PENDING' && (
                                                <button className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '12px' }} onClick={() => openActionModal(leave)}>Review</button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Apply Leave Modal (Employee) */}
            <AnimatePresence>
            {showApplyModal && (
                <div className="modal-overlay active">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="modal-content" style={{ maxWidth: '500px' }}
                    >
                        <h2>Request Leave</h2>
                        <form onSubmit={handleApplySubmit}>
                            <div className="form-group">
                                <label>Leave Type</label>
                                <select className="form-control" value={newLeave.leaveType} onChange={(e) => setNewLeave({...newLeave, leaveType: e.target.value})} required>
                                    <option value="SICK_LEAVE">Sick Leave</option>
                                    <option value="CASUAL_LEAVE">Casual Leave</option>
                                    <option value="ANNUAL_LEAVE">Annual Leave</option>
                                    <option value="MATERNITY_LEAVE">Maternity Leave</option>
                                    <option value="UNPAID_LEAVE">Unpaid Leave</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input type="date" className="form-control" value={newLeave.startDate} onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input type="date" className="form-control" value={newLeave.endDate} onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Reason</label>
                                <textarea className="form-control" rows="3" value={newLeave.reason} onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})} required></textarea>
                            </div>
                            
                            <div className="modal-actions" style={{ marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowApplyModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Submit Request</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            </AnimatePresence>

            {/* Review Leave Modal (Admin) */}
            <AnimatePresence>
            {showActionModal && (
                <div className="modal-overlay active">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="modal-content" style={{ maxWidth: '500px' }}
                    >
                        <h2>Review Leave Request</h2>
                        <div style={{ padding: '15px', backgroundColor: 'var(--bg-color)', borderRadius: '8px', marginBottom: '15px' }}>
                            <p><strong>Employee:</strong> {selectedLeave?.user?.firstName} {selectedLeave?.user?.lastName}</p>
                            <p><strong>Dates:</strong> {selectedLeave?.startDate} to {selectedLeave?.endDate}</p>
                            <p><strong>Reason:</strong> {selectedLeave?.reason}</p>
                        </div>
                        <form onSubmit={handleActionSubmit}>
                            <div className="form-group">
                                <label>Action</label>
                                <select className="form-control" value={actionPayload.status} onChange={(e) => setActionPayload({...actionPayload, status: e.target.value})}>
                                    <option value="APPROVED">Approve</option>
                                    <option value="REJECTED">Reject</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Remarks (Optional)</label>
                                <input type="text" className="form-control" placeholder="E.g. Approved, enjoy your time off!" value={actionPayload.adminRemarks} onChange={(e) => setActionPayload({...actionPayload, adminRemarks: e.target.value})} />
                            </div>
                            
                            <div className="modal-actions" style={{ marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowActionModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Confirm Action</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            </AnimatePresence>
        </>
    );
};

export default Leaves;
