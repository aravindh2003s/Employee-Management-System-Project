import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../../services/auth.service';

const ProtectedRoute = ({ allowedRoles }) => {
    const user = authService.getCurrentUser();

    if (!user) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Logged in but wrong role. Redirect to their appropriate dashboard.
        if (user.role === 'ROLE_ADMIN') {
            return <Navigate to="/admin-dashboard" replace />;
        } else {
            return <Navigate to="/employee-dashboard" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
