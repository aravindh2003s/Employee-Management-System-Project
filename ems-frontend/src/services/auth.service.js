import api from './api';

const login = async (email, password) => {
    const response = await api.post('/auth/signin', { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const signup = async (firstName, lastName, email, password) => {
    const response = await api.post('/auth/signup', {
        firstName,
        lastName,
        email,
        password
    });
    return response.data;
};

const authService = {
    login,
    logout,
    signup,
    getCurrentUser,
};

export default authService;
