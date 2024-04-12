import { AxiosResponse } from "axios";
import api from "../http/index.ts";
import { LoginResponse } from "../models/LoginResponse.ts";

export default class LoginSevice {
    static async login(mail: string, pass: string): Promise<AxiosResponse<LoginResponse>> {
        return await api.post<LoginResponse>('/user/login', { mail, pass })
    }
    static async registration(mail: string, nickname: string, pass: string): Promise<AxiosResponse<LoginResponse>> {
        return api.post<LoginResponse>('/user/registration', { mail, pass, nickname })
    }
    static async logout(): Promise<AxiosResponse<LoginResponse>> {
        return api.post<LoginResponse>('/user/logout')
    }
}