import { AuthAPI } from "../context/AuthContext";

export interface IUserData {
    id: number;
    name: string;
    mail: string;
    mailveryfity: boolean;
    roles: {
        gamer: boolean;
        master: boolean;
        admin: boolean;
    };
}
export interface IGamerPlay {
    id: number;
    name: string;
    description: string;
    master: {
        id: number;
        name: string;
    };
    players: {
        count: number;
        min: number;
        max: number;
    };
    status: {
        status: boolean;
        dateStart: Date;
        dateEnd: Date;
    };
}
export interface IMasterPlay {
    id: number;
    name: string;
    description: string;
    players: {
        list: { id: number; name: string }[];
        min: number;
        max: number;
    };
    status: {
        status: boolean;
        dateStart: Date;
        dateEnd: Date;
    };
}

export default class ProfileAPI {
    static async getGamerPlays(id?: number) {
        try {
            const response = await AuthAPI.get<IGamerPlay[]>(`/user/playsgamer`, {
                params: {
                    id: id,
                },
            });
            return {
                status: 200,
                plays: response.data,
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
    static async getMasterPlays(id?: number | undefined) {
        try {
            const response = await AuthAPI.get<IMasterPlay[]>(`/user/playsmaster`, {
                params: {
                    id: id,
                },
            });
            return {
                status: 200,
                plays: response.data,
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
    static async getUserInfo() {
        try {
            const response = await AuthAPI.get<IUserData>(`/user/info`);
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
    static async changeName({ mail, newName }: { mail: string; newName: string }) {
        try {
            const response = await AuthAPI.put<IUserData>(`/user/update`, { mail: mail, name: newName });
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
    static async changePass({ mail, oldPass, newPass }: { mail: string; oldPass: string; newPass: string }) {
        try {
            const response = await AuthAPI.put<IUserData>(`/user/update`, {
                mail: mail,
                oldpass: oldPass,
                pass: newPass,
            });
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
    static async changeMail({ mail }: { mail: string }) {
        try {
            const response = await AuthAPI.put<IUserData>(`/user/update`, { mail: mail });
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
    static async changeDescription({ mail, description }: { mail: string; description: string }) {
        try {
            const response = await AuthAPI.put<IUserData>(`/user/update`, { mail: mail, description: description });
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
    static async changeImg({ mail, image }: { mail: string; image: File }) {
        try {
            const formData = new FormData();
            formData.append("mail", mail);
            formData.append("image", image);
            const response = await AuthAPI.put<IUserData>(`/user/update`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
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
    static async haveIMasterPanel() {
        try {
            const response = await AuthAPI.get<boolean>(`/user/getrule`, { params: { rule: "haveIMasterPanel" } });
            return {
                status: response.status,
                access: response.data,
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
    static async haveIAdminPanel() {
        try {
            const response = await AuthAPI.get<boolean>(`/user/getrule`, { params: { rule: "haveIAdminPanel" } });
            return {
                status: response.status,
                access: response.data,
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
}
