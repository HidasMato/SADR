import { AuthAPI } from "../context/AuthContext";

export interface IGamerData {
    id: number;
    name: string;
}
export default class UsersAPI {
    static async getAllGamers(id?: number) {
        try {
            const response = await AuthAPI.get<IGamerData[]>(`/user/all`);
            return {
                status: 200,
                gamers: response.data,
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
}
