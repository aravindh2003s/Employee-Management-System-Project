import api from './api';

const getAllDepartments = async () => {
    const response = await api.get('/departments');
    return response.data;
};

const createDepartment = async (departmentData) => {
    const response = await api.post('/departments', departmentData);
    return response.data;
};

const updateDepartment = async (id, departmentData) => {
    const response = await api.put(`/departments/${id}`, departmentData);
    return response.data;
};

const deleteDepartment = async (id) => {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
};

const departmentService = {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
};

export default departmentService;
