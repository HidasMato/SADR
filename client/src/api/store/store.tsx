import { makeAutoObservable } from 'mobx'
import AuthSevice from '../services/AuthSevice.tsx';
import axios from 'axios';
import { AuthResponse } from '../models/AuthResponse.ts';
import { API_URL } from '../http/index.ts';

export default class Store {
    user = -1 as number
    isAuth = false;

    constructor() {
        makeAutoObservable(this)
    }
    setAuth(bool: boolean) {
        this.isAuth = bool;
    }
    setUser(user: number) {
        this.user = user;
    }
    async login(mail: string, pass: string): Promise<{ status: number, id?: number, message?: string }> {
        try {
            const responce = await AuthSevice.login(mail, pass);
            localStorage.setItem('token', responce.data.tokens.accessToken)
            this.setAuth(true)
            this.setUser(responce.data.redirectionId)
            return {
                status: 200,
                id: responce.data.redirectionId
            }
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message
            }
        }
    }
    async registration(mail: string, pass: string, nickname: string) {
        try {
            const responce = await AuthSevice.registration(mail, nickname, pass);
            localStorage.setItem('token', responce.data.tokens.accessToken)
            this.setAuth(true)
            this.setUser(responce.data.redirectionId)
            return {
                status: 200,
                id: responce.data.redirectionId
            }
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message
            }
        }
    }
    async logout() {
        try {
            const responce = await AuthSevice.logout();
            console.log(responce)
            localStorage.removeItem('token')
            this.setAuth(false)
            this.setUser(-1)
        } catch (error) {
            console.log(error.responce.data?.message)
        }
    }
    async checkAuth() {
        try {
            const responce = await axios.get<AuthResponse>(`${API_URL}/user/refresh`, { withCredentials: true })
            localStorage.setItem('token', responce.data.tokens.accessToken);
            console.log(responce);
            this.setAuth(true);
            this.setUser(responce.data.redirectionId);
            return {
                status: 200,
                id: responce.data.redirectionId
            }
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message
            }
        }
    }

} 