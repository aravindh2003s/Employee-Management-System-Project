import api from './api';

const getAdminStats = async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
};

const getEmployeeStats = async () => {
    const response = await api.get('/dashboard/employee');
    return response.data;
};

const dashboardService = {
    getAdminStats,
    getEmployeeStats,
};

export default dashboardService;
