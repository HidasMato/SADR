import { AuthAPI } from "../context/AuthContext";

export interface IUserData {
    id: number,
    nickname: string,
    mail: string,
    mailVeryfity: boolean,
    roles: {
        user: boolean,
        master: boolean,
        admin: boolean
    }
};

export default class UserInfoAPI {
    static async getUserInfo(): Promise<IUserData> {
        return (await AuthAPI.get<IUserData>(`/user/info`)).data;
    }
};