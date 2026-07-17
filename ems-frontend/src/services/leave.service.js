import api from './api';

const getAllLeaves = async () => {
    const response = await api.get('/leaves');
    return response.data;
};

const getMyLeaves = async () => {
    const response = await api.get('/leaves/my');
    return response.data;
};

const applyLeave = async (leaveData) => {
    const response = await api.post('/leaves/apply', leaveData);
    return response.data;
};

const updateLeaveStatus = async (id, status, adminRemarks = '') => {
    const response = await api.put(`/leaves/${id}/status`, { status, adminRemarks });
    return response.data;
};

const leaveService = {
    getAllLeaves,
    getMyLeaves,
    applyLeave,
    updateLeaveStatus
};

export default leaveService;
