import React, { useState, useEffect } from 'react';
import departmentService from '../services/department.service';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentDept, setCurrentDept] = useState({ name: '', description: '', headOfDepartment: '' });
    
    // Delete modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deptToDelete, setDeptToDelete] = useState(null);

    const fetchDepartments = async () => {
        try {
            const data = await departmentService.getAllDepartments();
            setDepartments(data);
        } catch (error) {
            console.error("Error fetching departments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentDept({ name: '', description: '', headOfDepartment: '' });
        setShowModal(true);
    };

    const openEditModal = (dept) => {
        setIsEditing(true);
        setCurrentDept(dept);
        setShowModal(true);
    };

    const openDeleteModal = (dept) => {
        setDeptToDelete(dept);
        setShowDeleteModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await departmentService.updateDepartment(currentDept.id, currentDept);
                toast.success('Department updated successfully!');
            } else {
                await departmentService.createDepartment(currentDept);
                toast.success('Department created successfully!');
            }
            setShowModal(false);
            fetchDepartments(); // Refresh list
        } catch (error) {
            toast.error('Failed to save department. ' + (error.response?.data?.message || ''));
        }
    };

    const handleDelete = async () => {
        try {
            await departmentService.deleteDepartment(deptToDelete.id);
            toast.success('Department deleted successfully!');
            setShowDeleteModal(false);
            fetchDepartments();
        } catch (error) {
            toast.error('Failed to delete department. ' + (error.response?.data?.message || ''));
        }
    };

    return (
        <>
            <div className="hero-section" style={{ marginBottom: '20px' }}>
                <div>
                    <h1 className="hero-title">Departments</h1>
                    <p className="hero-subtitle">Manage company departments and their structural heads.</p>
                </div>
                <div className="hero-actions">
                    <button className="btn btn-primary" onClick={openAddModal}><i className="fa-solid fa-plus"></i> Add Department</button>
                </div>
            </div>

            <div className="table-card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Dept ID</th>
                            <th>Department Name</th>
                            <th>Head of Department</th>
                            <th>Description</th>
                            <th>Created Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Loading departments...</td></tr>
                        ) : departments.length === 0 ? (
                            <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No departments found.</td></tr>
                        ) : (
                            departments.map(dept => (
                                <tr key={dept.id}>
                                    <td><strong>DEPT-{dept.id}</strong></td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div className="stat-icon-wrapper icon-blue" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                                                <i className="fa-solid fa-sitemap"></i>
                                            </div>
                                            <strong>{dept.name}</strong>
                                        </div>
                                    </td>
                                    <td>{dept.headOfDepartment || 'Not Assigned'}</td>
                                    <td>{dept.description || 'N/A'}</td>
                                    <td>{dept.createdDate ? new Date(dept.createdDate).toLocaleDateString() : 'N/A'}</td>
                                    <td>
                                        <button className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '12px', marginRight: '5px' }} onClick={() => openEditModal(dept)}>Edit</button>
                                        <button className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '12px', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }} onClick={() => openDeleteModal(dept)}>Delete</button>
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
                        className="modal-content"
                    >
                        <h2>{isEditing ? 'Edit Department' : 'Add New Department'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Department Name</label>
                                <input 
                                    type="text" 
                                    value={currentDept.name} 
                                    onChange={(e) => setCurrentDept({...currentDept, name: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    className="form-control"
                                    value={currentDept.description} 
                                    onChange={(e) => setCurrentDept({...currentDept, description: e.target.value})} 
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label>Head of Department</label>
                                <input 
                                    type="text" 
                                    value={currentDept.headOfDepartment} 
                                    onChange={(e) => setCurrentDept({...currentDept, headOfDepartment: e.target.value})} 
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{isEditing ? 'Update Department' : 'Save Department'}</button>
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
                        <h2>Delete Department?</h2>
                        <p style={{ margin: '15px 0', color: 'var(--text-secondary)' }}>
                            Are you sure you want to delete <strong>{deptToDelete?.name}</strong>? This action cannot be undone.
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

export default Departments;
