import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import dashboardService from '../services/dashboard.service';
import employeeService from '../services/employee.service';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const AdminDashboard = () => {
    const [showModal, setShowModal] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalDepartments: 0,
        todayAttendancePercent: 0,
        totalPayroll: 0,
        departmentDistribution: {}
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [adminStats, emps] = await Promise.all([
                    dashboardService.getAdminStats(),
                    employeeService.getAllEmployees() // Need this for the Recent Employees table
                ]);
                setStats(adminStats);
                setEmployees(emps);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Chart Data
    const growthData = {
        labels: ['2h', '4h', '6h', '12h', '10n'],
        datasets: [{
            data: [10, 25, 15, 45, 60],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.2)', // Simplified gradient for now
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0
        }]
    };

    const growthOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { display: true, grid: { display: false }, border: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
            y: { display: false, min: 0 }
        }
    };

    const deptLabels = Object.keys(stats.departmentDistribution || {});
    const deptValues = Object.values(stats.departmentDistribution || {});
    const colors = ['#8b5cf6', '#06b6d4', '#f472b6', '#F97316', '#3b82f6', '#10b981'];

    const deptData = {
        labels: deptLabels.length > 0 ? deptLabels : ['No Data'],
        datasets: [{
            data: deptValues.length > 0 ? deptValues : [1],
            backgroundColor: colors,
            borderWidth: 0,
            cutout: '70%'
        }]
    };

    const deptOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#94a3b8', font: { size: 9 }, boxWidth: 8, padding: 5 }
            }
        }
    };

    return (
        <>
            <div className="hero-section">
                <div>
                    <h1 className="hero-title">Good Morning, Admin 👋</h1>
                    <p className="hero-subtitle">Here's your company overview today.</p>
                </div>
                <div className="hero-actions">
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}><i className="fa-solid fa-plus"></i> Add Employee</button>
                    <button className="btn btn-secondary"><i className="fa-regular fa-file-lines"></i> Generate Report</button>
                    <button className="btn btn-secondary"><i className="fa-solid fa-arrow-up-from-bracket"></i> Export</button>
                </div>
            </div>

            <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="stats-grid"
            >
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper icon-purple"><i className="fa-solid fa-users"></i></div>
                        Employees
                    </div>
                    <div className="stat-value-row">
                        <div className={`stat-value ${loading ? 'skeleton skeleton-text' : ''}`}>{loading ? '' : stats.totalEmployees}</div>
                        <div className="trend up"><i className="fa-solid fa-arrow-trend-up"></i> Active</div>
                    </div>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper icon-blue"><i className="fa-regular fa-clock"></i></div>
                        Attendance (Today)
                    </div>
                    <div className="stat-value-row">
                        <div className={`stat-value ${loading ? 'skeleton skeleton-text' : ''}`}>{loading ? '' : `${stats.todayAttendancePercent}%`}</div>
                        <div className="trend up"><i className="fa-solid fa-arrow-trend-up"></i> Live</div>
                    </div>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper icon-green"><i className="fa-solid fa-sitemap"></i></div>
                        Departments
                    </div>
                    <div className="stat-value-row">
                        <div className={`stat-value ${loading ? 'skeleton skeleton-text' : ''}`}>{loading ? '' : stats.totalDepartments}</div>
                        <div className="trend up"><i className="fa-solid fa-arrow-trend-up"></i> Divisions</div>
                    </div>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper icon-blue"><i className="fa-solid fa-wallet"></i></div>
                        Payroll
                    </div>
                    <div className="stat-value-row">
                        <div className={`stat-value ${loading ? 'skeleton skeleton-text' : ''}`}>{loading ? '' : `$${stats.totalPayroll.toLocaleString()}`}</div>
                        <div className="trend up"><i className="fa-solid fa-arrow-trend-up"></i> Disbursed</div>
                    </div>
                </motion.div>
            </motion.div>

            <div className="widgets-grid">
                <div className="widget-card">
                    <div className="widget-title">Employee Growth</div>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Line data={growthData} options={growthOptions} />
                    </div>
                </div>

                <div className="widget-card">
                    <div className="widget-title">Department Distribution</div>
                    <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ height: '120px', width: '120px' }}>
                            <Doughnut data={deptData} options={deptOptions} />
                        </div>
                    </div>
                </div>

                <div className="widget-card">
                    <div className="widget-title">Recent Activity</div>
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-text">Recent activity</div>
                            <div className="timeline-time">3 hours ago</div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-text">New employment</div>
                            <div className="timeline-time">1 month ago</div>
                        </div>
                    </div>
                </div>
                
                {/* AI Assistant omitted for brevity or can be added back */}
            </div>

            <div className="table-card">
                <table>
                    <thead>
                        <tr>
                            <th>Employee Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>Loading employees...</td></tr>
                        ) : employees.length === 0 ? (
                            <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>No employees found.</td></tr>
                        ) : (
                            employees.slice(0, 5).map(emp => (
                                <tr key={emp.id}>
                                    <td>
                                        <div className="emp-name-cell">
                                            <img src={`https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=random`} className="avatar" alt="avatar" />
                                            {emp.firstName} {emp.lastName}
                                        </div>
                                    </td>
                                    <td>{emp.email}</td>
                                    <td>
                                        <span className={`status-pill ${emp.isActive ? 'status-active' : 'status-leave'}`}>
                                            {emp.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td><div className="action-menu">Manage <i className="fa-solid fa-ellipsis"></i></div></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
            {showModal && (
                <div className="modal-overlay active">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="modal-content"
                    >
                        <h2>Add New Employee</h2>
                        <form onSubmit={async (e) => { 
                            e.preventDefault();
                            const newEmp = {
                                firstName: e.target.fname.value,
                                lastName: e.target.lname.value,
                                email: e.target.email.value,
                            };
                            try {
                                await employeeService.createEmployee(newEmp);
                                toast.success("Employee added!");
                                const data = await employeeService.getAllEmployees();
                                setEmployees(data);
                                setShowModal(false);
                            } catch (err) {
                                toast.error('Error creating employee');
                            }
                        }}>
                            <div className="form-group"><label>First Name</label><input type="text" name="fname" required /></div>
                            <div className="form-group"><label>Last Name</label><input type="text" name="lname" required /></div>
                            <div className="form-group"><label>Email</label><input type="email" name="email" required /></div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Employee</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            </AnimatePresence>
        </>
    );
};

export default AdminDashboard;
