import { AuthAPI } from "../context/AuthContext";

export interface IGameData {
    name: string;
    id: number;
}
export interface IGamesQuery {
    games: IGameData[];
    count: number;
}
export interface IGamesFilter {
    page?: number;
    filter?: {
        findname?: string;
        player?: string;
        time?: string;
        hardless?: string;
    };
}
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
    static async getGames(filter: IGamesFilter) {
        try {
            const response = await AuthAPI.get<IGamesQuery>(`/game/all`, {
                params: { ...filter.filter, page: filter.page },
            });
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error) {
            return {
                status: error?.response?.status,
                message: error?.response?.data?.message,
            };
        }
    }
    static async deleteGame(id: string) {
        try {
            const response = await AuthAPI.delete(`/game/${id}/delete`);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error) {
            return {
                status: error?.response?.status,
                message: error?.response?.data?.message,
            };
        }
    }
    static async getGame(id: string) {
        try {
            const response = await AuthAPI.get<IGameQuery>(`/game/${id}`);
            return {
                status: response.status,
                data: {
                    description: response.data.description,
                    hardless: Number(response.data.hardless),
                    id: Number(response.data.id),
                    maxplayers: Number(response.data.maxplayers),
                    maxtimeplay: Number(response.data.maxtimeplay),
                    minplayers: Number(response.data.minplayers),
                    mintimeplay: Number(response.data.mintimeplay),
                    name: response.data.name,
                },
            };
        } catch (error) {
            return {
                status: error?.response?.status,
                message: error?.response?.data?.message,
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
    static async updateGame(id: string, options: IGameCreator) {
        try {
            const formData = new FormData();
            for (let key of Object.keys(options)) formData.append(key, options[key]);
            const response = await AuthAPI.put<{ redirectionId: number }>(`/game/${id}/update`, formData, {
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
    static async canICreateGame() {
        try {
            const response = await AuthAPI.get<boolean>(`/user/getrule`, { params: { rule: "creategame" } });
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
    static async canIChangeGame() {
        try {
            const response = await AuthAPI.get<boolean>(`/user/getrule`, { params: { rule: "changegame" } });
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
    static async canIDeleteGame() {
        try {
            const response = await AuthAPI.get<boolean>(`/user/getrule`, { params: { rule: "deletegame" } });
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
