import api from './api';

const getAllAttendance = async () => {
    const response = await api.get('/attendance');
    return response.data;
};

const getMyAttendance = async () => {
    const response = await api.get('/attendance/my');
    return response.data;
};

const checkIn = async () => {
    const response = await api.post('/attendance/check-in');
    return response.data;
};

const checkOut = async () => {
    const response = await api.post('/attendance/check-out');
    return response.data;
};

const attendanceService = {
    getAllAttendance,
    getMyAttendance,
    checkIn,
    checkOut,
};

export default attendanceService;
