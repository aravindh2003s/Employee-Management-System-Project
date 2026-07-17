import api from './api';

const getMyNotifications = async () => {
    const response = await api.get('/notifications');
    return response.data;
};

const markAsRead = async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
};

const notificationService = {
    getMyNotifications,
    markAsRead
};

export default notificationService;
