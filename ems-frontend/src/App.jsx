import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import authService from './services/auth.service';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Payroll from './pages/Payroll';
import Settings from './pages/Settings';

// A dynamic root redirect based on role
const RootRedirect = () => {
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  return user.role === 'ROLE_ADMIN' ? <Navigate to="/admin-dashboard" /> : <Navigate to="/employee-dashboard" />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<RootRedirect />} />
        <Route path="/dashboard" element={<RootRedirect />} />
        
        <Route element={<DashboardLayout />}>
            {/* Admin Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/payroll" element={<Payroll />} />
            </Route>

            {/* Employee Only Routes (or Admin as well if needed) */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_EMPLOYEE', 'ROLE_ADMIN']} />}>
                <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                {/* Other employee routes can go here */}
            </Route>

            {/* Shared Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_EMPLOYEE']} />}>
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/leaves" element={<Leaves />} />
                <Route path="/settings" element={<Settings />} />
            </Route>
        </Route>
        
        {/* Default route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
