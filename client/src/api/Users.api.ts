import { AuthAPI } from "../context/AuthContext";

export interface IGamerData {
    id: string;
    name: string;
}
export interface IGamerPlusData {
    id: string;
    mail: string;
    mailveryfity: boolean;
    name: boolean;
    roles: { gamer: boolean; master: boolean; admin: boolean };
    description: string | undefined;
}
export interface AdminRigths {
    creategame: boolean;
    changegame: boolean;
    deletegame: boolean;
    createplay: boolean;
    changeplay: boolean;
    deleteplay: boolean;
    disactivplay: boolean;
    masterrights: boolean;
    mainadmin: boolean;
}

export default class UsersAPI {
    static async getAllGamers(id?: string) {
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
    static async getOneUser(id: string) {
        try {
            const response = await AuthAPI.get<IGamerPlusData>(`/user/${id}`);
            return {
                status: 200,
                user: response.data,
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
    static async unsetMaster({ id, mail }: { id: string; mail: string }) {
        try {
            const response = await AuthAPI.put(`/user/update`, {
                mail: mail,
                id: id,
                role: "gamer",
            });
            return {
                status: 200,
                message: response.data,
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
    static async setMaster({ id, mail }: { id: string; mail: string }) {
        try {
            const response = await AuthAPI.put(`/user/update`, {
                mail: mail,
                id: id,
                role: "master",
            });
            return {
                status: 200,
                message: response.data,
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
    static async sendMail({ message, users }: { message: string; users: string[] }) {
        try {
            const response = await AuthAPI.post(`/user/sendmail`, {
                message: message,
                users: users,
            });
            return {
                status: 200,
                message: response.data,
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
}
