import { AxiosResponse } from "axios";
import api from "../http/index.ts";
import { AuthResponse } from "../models/AuthResponse.ts";

export default class AuthSevice {
    static async login(mail: string, pass: string): Promise<AxiosResponse<AuthResponse>> {
        return await api.post<AuthResponse>('/user/login', { mail, pass })
    }
    static async registration(mail: string, nickname: string, pass: string): Promise<AxiosResponse<AuthResponse>> {
        return api.post<AuthResponse>('/user/registration', {mail, pass, nickname})
    }
    static async logout(): Promise<AxiosResponse<AuthResponse>> {
        return api.post<AuthResponse>('/user/logout')
    }
}