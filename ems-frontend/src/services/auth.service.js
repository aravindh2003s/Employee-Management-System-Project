import api from './api';

const login = async (email, password) => {
    const response = await api.post('/auth/signin', { email, password });
    if (response.data.token) {
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(sessionStorage.getItem('user'));
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

const updateCurrentUser = (updatedUser) => {
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    if (currentUser) {
        const newUser = { ...currentUser, ...updatedUser };
        sessionStorage.setItem('user', JSON.stringify(newUser));
    }
};

const authService = {
    login,
    logout,
    signup,
    getCurrentUser,
    updateCurrentUser,
};

export default authService;
