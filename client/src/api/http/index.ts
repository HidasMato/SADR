import axios from 'axios';
import { LoginResponse } from '../models/LoginResponse.ts';

export const API_URL = 'http://localhost:2052'

const api = axios.create({
    withCredentials: true,
    baseURL: `${API_URL}/api`
})

api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
})

api.interceptors.response.use((config) => {
    return config
}, async (error) => {
    const originalReqquest = error.config
    if (error.response.status == 401 && error.config && originalReqquest._isRetry) {
        originalReqquest._isRetry = false;
        try {
            const responce = await axios.get<LoginResponse>(`${API_URL}/api/user/refresh`, { withCredentials: true })
            localStorage.setItem('token', responce.data.tokens.accessToken);
            return api.request(originalReqquest);
        } catch (error) {
            console.log('Не авторизован')
        }
    }
    throw error;
})

export default api;