import { makeAutoObservable } from 'mobx'
import LoginSevice from './services/LoginSevice.ts';
import axios from 'axios';
import { LoginResponse } from './models/LoginResponse.ts';
import { API_URL } from './http/index.ts';
import { UserInfo } from './models/UserInfo.ts';

export default class Store {
    user:undefined | UserInfo = undefined
    isAuth = false;
    isLoading = false;
    constructor() { makeAutoObservable(this) }
    setAuth(bool: boolean) { this.isAuth = bool; }
    setLoading(bool: boolean) { this.isLoading = bool; }
    setUser(user: UserInfo | undefined) { this.user = user; }
    async login(mail: string, pass: string): Promise<{ status: number, user?: UserInfo, message?: string }> {
        try {
            const responce = await LoginSevice.login(mail, pass);
            localStorage.setItem('token', responce.data.tokens.accessToken)
            this.setAuth(true)
            this.setUser(responce.data.user)
            return {
                status: 200,
                user: responce.data.user
            }
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message
            }
        }
    }
    async registration(mail: string, pass: string, nickname: string): Promise<{ status: number, user?: UserInfo, message?: string }> {
        try {
            const responce = await LoginSevice.registration(mail, nickname, pass);
            localStorage.setItem('token', responce.data.tokens.accessToken)
            this.setAuth(true)
            this.setUser(responce.data.user)
            return {
                status: 200,
                user: responce.data.user
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
            const responce = await LoginSevice.logout();
            localStorage.removeItem('token')
            this.setAuth(false)
            this.setUser(undefined)
            return {
                status: 200
            }
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message
            }
        }
    }
    async checkAuth(): Promise<{ status: number, user?: UserInfo, message?: string }> {
        this.setLoading(true)
        try {
            axios.defaults.withCredentials = true
            const responce = await axios.get<LoginResponse>(`${API_URL}/api/user/refresh`, { withCredentials: true })
            localStorage.setItem('token', responce.data.tokens.accessToken);
            this.setAuth(true);
            this.setUser(responce.data.user);
            return {
                status: 200,
                user: responce.data.user
            }
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message
            }
        } finally {
            this.setLoading(false)
        }
    }

} 