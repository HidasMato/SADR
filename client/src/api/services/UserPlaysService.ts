import { AxiosResponse } from "axios";
import api from "../http/index.ts";
import { MasterPlaysResponce, UserPlaysResponce } from "../models/UserPlaysResponce.ts";

export default class UserPlaysService {
    static async getGamerPlays(id: number): Promise<AxiosResponse<UserPlaysResponce>> {
        return api.get<UserPlaysResponce>(`/user/${id}/playsgamer`)
    }
    static async getMasterPlays(id: number): Promise<AxiosResponse<MasterPlaysResponce>> {
        return api.get<MasterPlaysResponce>(`/user/${id}/playsmaster`)
    }
}