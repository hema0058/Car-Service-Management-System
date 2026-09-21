import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = (email, password) => api.post('/users/login', { email, password });
export const register = (user) => api.post('/users/register', user);
export const getUser = (id) => api.get(`/users/${id}`);
export const updateUser = (id, user) => api.put(`/users/${id}`, user);
export const getAllUsers = () => api.get('/users');

export const addCar = (userId, car) => api.post(`/cars/user/${userId}`, car);
export const getUserCars = (userId) => api.get(`/cars/user/${userId}`);
export const getAllCars = () => api.get('/cars');

export const createServiceRequest = (userId, carId, request) => api.post(`/service-requests/user/${userId}/car/${carId}`, request);
export const getUserServiceRequests = (userId) => api.get(`/service-requests/user/${userId}`);
export const getAllServiceRequests = () => api.get('/service-requests');
export const updateServiceRequestStatus = (requestId, status) => api.put(`/service-requests/${requestId}/status`, { status });

export default api;
