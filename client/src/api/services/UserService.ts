import { AxiosResponse } from "axios";
import api from "../http";
import { UserInfo } from "../models/UserInfo";

export default class UserService {
    static async getAll(): Promise<AxiosResponse<UserInfo[]>> {
        return api.get<UserInfo[]>('/user/all')
    }
}