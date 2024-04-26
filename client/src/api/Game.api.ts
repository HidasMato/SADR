import { AuthAPI } from "../context/AuthContext";

export interface IGameQuery {
    description: string;
    hardless: number;
    id: number;
    maxplayers: number;
    maxtimeplay: number;
    minplayers: number;
    mintimeplay: number;
    name: string;
}
export interface IGameCreator {
    name: string;
    minplayers: number | undefined;
    maxplayers: number | undefined;
    mintimeplay: number | undefined;
    maxtimeplay: number | undefined;
    hardless: number | undefined;
    description: string | undefined;
    image: File;
}
export default class GameAPI {
    static async getGame(id: string) {
        try {
            const response = await AuthAPI.get<IGameQuery>(`/game/${id}`);
            console.log(999, response);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
    static async createGame(options: IGameCreator) {
        try {
            const formData = new FormData();
            for (let key of Object.keys(options)) formData.append(key, options[key]);
            const response = await AuthAPI.post<{ redirectionId: number }>(`/game/new`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return {
                status: response.status,
                id: response.data.redirectionId,
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
}
