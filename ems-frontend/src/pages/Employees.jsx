import React, { useState, useEffect } from 'react';
import employeeService from '../services/employee.service';
import departmentService from '../services/department.service';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmp, setCurrentEmp] = useState({ firstName: '', lastName: '', email: '', password: '', departmentId: '', role: 'ROLE_EMPLOYEE', designation: '', phoneNumber: '', gender: '', employmentType: 'FULL_TIME', salary: '' });
    
    // Delete modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [empToDelete, setEmpToDelete] = useState(null);

    const fetchEmployees = async () => {
        try {
            const data = await employeeService.getAllEmployees();
            setEmployees(data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const data = await departmentService.getAllDepartments();
            setDepartments(data);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, []);

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentEmp({ firstName: '', lastName: '', email: '', password: '', departmentId: '', role: 'ROLE_EMPLOYEE', designation: '', phoneNumber: '', gender: '', employmentType: 'FULL_TIME', salary: '' });
        setShowModal(true);
    };

    const openEditModal = (emp) => {
        setIsEditing(true);
        setCurrentEmp({ 
            ...emp, 
            password: '', // Do not populate password on edit
            departmentId: emp.departmentId || '', // Depending on how the backend returns it, it might just be departmentName. Let's assume we need to find ID.
            // Actually, if the backend returns departmentName, we might need to match it, or the backend returns department: {id: X}.
            // Let's assume the backend returns departmentId in the DTO, if not the update might fail.
        });
        setShowModal(true);
    };

    const openDeleteModal = (emp) => {
        setEmpToDelete(emp);
        setShowDeleteModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await employeeService.updateEmployee(currentEmp.id, currentEmp);
                toast.success('Employee updated successfully!');
            } else {
                await employeeService.createEmployee(currentEmp);
                toast.success('Employee created successfully!');
            }
            setShowModal(false);
            fetchEmployees();
        } catch (error) {
            toast.error('Failed to save employee. ' + (error.response?.data?.message || ''));
        }
    };

    const handleDelete = async () => {
        try {
            await employeeService.deleteEmployee(empToDelete.id);
            toast.success('Employee deleted successfully!');
            setShowDeleteModal(false);
            fetchEmployees();
        } catch (error) {
            toast.error('Failed to delete employee. ' + (error.response?.data?.message || ''));
        }
    };

    return (
        <>
            <div className="hero-section" style={{ marginBottom: '20px' }}>
                <div>
                    <h1 className="hero-title">Employees Directory</h1>
                    <p className="hero-subtitle">Manage your workforce, view details, and update statuses.</p>
                </div>
                <div className="hero-actions">
                    <button className="btn btn-primary" onClick={openAddModal}><i className="fa-solid fa-plus"></i> Add Employee</button>
                </div>
            </div>

            <div className="table-card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>Email / Contact</th>
                            <th>Department</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>Loading employees...</td></tr>
                        ) : employees.length === 0 ? (
                            <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>No employees found.</td></tr>
                        ) : (
                            employees.map(emp => (
                                <tr key={emp.id}>
                                    <td><strong>{emp.employeeId || `EMP-${emp.id}`}</strong></td>
                                    <td>
                                        <div className="emp-name-cell">
                                            <img src={`https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=random`} className="avatar" alt="avatar" />
                                            <div>
                                                <div>{emp.firstName} {emp.lastName}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{emp.designation || 'Staff'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>{emp.email}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{emp.phoneNumber || 'N/A'}</div>
                                    </td>
                                    <td>{emp.departmentName || 'Not Assigned'}</td>
                                    <td>{emp.role === 'ROLE_ADMIN' ? 'Admin' : 'Employee'}</td>
                                    <td>
                                        <span className={`status-pill ${emp.isActive ? 'status-active' : 'status-leave'}`}>
                                            {emp.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ display: 'flex', gap: '8px' }}>
                                        <button className="action-icon-btn view" title="View"><i className="fa-regular fa-eye"></i></button>
                                        <button className="action-icon-btn edit" title="Edit" onClick={() => openEditModal(emp)}><i className="fa-solid fa-pen"></i></button>
                                        <button className="action-icon-btn delete" title="Delete" onClick={() => openDeleteModal(emp)}><i className="fa-regular fa-trash-can"></i></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
            {showModal && (
                <div className="modal-overlay active">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="modal-content" style={{ maxWidth: '600px' }}
                    >
                        <h2>{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" value={currentEmp.firstName} onChange={e => setCurrentEmp({...currentEmp, firstName: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" value={currentEmp.lastName} onChange={e => setCurrentEmp({...currentEmp, lastName: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" value={currentEmp.email} onChange={e => setCurrentEmp({...currentEmp, email: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Password {!isEditing ? '*' : '(Leave blank to keep)'}</label>
                                    <input type="password" value={currentEmp.password} onChange={e => setCurrentEmp({...currentEmp, password: e.target.value})} required={!isEditing} />
                                </div>
                                <div className="form-group">
                                    <label>Department</label>
                                    <select className="form-control" value={currentEmp.departmentId || ''} onChange={e => setCurrentEmp({...currentEmp, departmentId: e.target.value})}>
                                        <option value="">-- Select Department --</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <select className="form-control" value={currentEmp.role} onChange={e => setCurrentEmp({...currentEmp, role: e.target.value})}>
                                        <option value="ROLE_EMPLOYEE">Employee</option>
                                        <option value="ROLE_ADMIN">Admin</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Designation</label>
                                    <input type="text" value={currentEmp.designation} onChange={e => setCurrentEmp({...currentEmp, designation: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="text" value={currentEmp.phoneNumber} onChange={e => setCurrentEmp({...currentEmp, phoneNumber: e.target.value})} />
                                </div>
                            </div>
                            <div className="modal-actions" style={{ marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{isEditing ? 'Update Employee' : 'Save Employee'}</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
            {showDeleteModal && (
                <div className="modal-overlay active">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}
                    >
                        <div style={{ marginBottom: '20px', color: 'var(--danger-color)' }}>
                            <i className="fa-solid fa-triangle-exclamation fa-3x"></i>
                        </div>
                        <h2>Delete Employee?</h2>
                        <p style={{ margin: '15px 0', color: 'var(--text-secondary)' }}>
                            Are you sure you want to delete <strong>{empToDelete?.firstName} {empToDelete?.lastName}</strong>? This action cannot be undone.
                        </p>
                        <div className="modal-actions" style={{ justifyContent: 'center' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button type="button" className="btn" style={{ backgroundColor: 'var(--danger-color)', color: 'white' }} onClick={handleDelete}>Delete Permanently</button>
                        </div>
                    </motion.div>
                </div>
            )}
            </AnimatePresence>
        </>
    );
};

export default Employees;
