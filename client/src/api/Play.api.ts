import { AuthAPI } from "../context/AuthContext";

export interface IPlayData {
    id: number;
    name: string;
    master: { id: number; name: string };
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
export interface IPlaysQuery {
    plays: IPlayData[];
    count: number;
}
export interface IMasterData {
    name: string;
    id: number;
}
export interface IMasterQuery {
    masters: IMasterData[];
}
export interface IPlaysFilter {
    page?: number;
    filter?: {
        datestart: Date;
        dateend: Date;
        masterid: number;
        freeplace: number;
        findname: string;
    };
}
export interface IPlayQuery {
    id: number;
    name: string;
    master: { id: number; name: string };
    description: string;
    players: {
        count: number;
        min: number;
        max: number;
    };
    games: {
        id: number;
        name: string;
    }[];
    status: {
        status: boolean;
        dateStart: Date;
        dateEnd: Date;
    };
}
export interface IPlayCreator {
    name: string;
    masterId: number;
    minplayers: number;
    maxplayers: number;
    description: string;
    status: boolean;
    datestart: Date;
    dateend: Date;
    games: number[];
    image: File;
}
export default class PlayAPI {
    static async getPlays(filter: IPlaysFilter) {
        try {
            const response = await AuthAPI.get<IPlaysQuery>(`/play/all`, {
                params: {
                    ...filter.filter,
                    page: filter.page,
                },
            });
            return {
                status: 200,
                count: response.data.count,
                plays: response.data.plays,
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
    static async getMasters() {
        try {
            const response = await AuthAPI.get<IMasterQuery>(`/user/masters`);
            return {
                status: 200,
                masters: response.data.masters,
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
    static async getPlay(id: string) {
        try {
            const responce = await AuthAPI.get<IPlayQuery>(`/play/${id}`);
            return {
                status: 200,
                data: {
                    id: Number(responce.data.id),
                    name: responce.data.name,
                    description: responce.data.description,
                    master: { id: Number(responce.data.master.id), name: responce.data.master.name },
                    players: {
                        count: Number(responce.data.players.count),
                        min: Number(responce.data.players.min),
                        max: Number(responce.data.players.max),
                    },
                    games: responce.data.games.map((game) => {
                        return {
                            id: Number(game.id),
                            name: game.name,
                        };
                    }),
                    status: {
                        status: Boolean(responce.data.status.status),
                        dateStart: new Date(responce.data.status.dateStart),
                        dateEnd: new Date(responce.data.status.dateEnd),
                    },
                },
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
    static async createPlay(options: IPlayCreator) {
        try {
            const formData = new FormData();
            for (let key of Object.keys(options)) formData.append(key, options[key]);
            const response = await AuthAPI.post<{ redirectionId: number }>(`/play/new`, formData, {
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
    static async changePlay(options: IPlayCreator, id: number) {
        try {
            const formData = new FormData();
            for (let key of Object.keys(options)) formData.append(key, options[key]);
            const response = await AuthAPI.put<{ redirectionId: number }>(`/play/${id}/change`, formData, {
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
    static async deletePlay(id: string) {
        try {
            const response = await AuthAPI.delete(`/play/${id}/delete`);
            return { status: response.status };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
    static async canICreatePlay() {
        try {
            const response = await AuthAPI.get<boolean>(`/user/getrule`, {
                params: {
                    rule: "createplay",
                },
            });
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
    static async canIChangePlay(id: string) {
        try {
            const response = await AuthAPI.get<boolean>(`/user/getrule`, {
                params: {
                    rule: "changeplay",
                    id: id,
                },
            });
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
    static async canIGoToPlay(id: string) {
        try {
            const response = await AuthAPI.get<number>(`/user/getrule`, {
                params: {
                    rule: "gotoplay",
                    id: id,
                },
            });
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
    static async canIDeletePlay(id: string) {
        try {
            const response = await AuthAPI.get<boolean>(`/user/getrule`, {
                params: {
                    rule: "deleteplay",
                    id: id,
                },
            });
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
    static async getPlayCreatorInfo() {
        try {
            const response = await AuthAPI.get<{ masters: IMasterData[]; games: IMasterData[] }>(`/play/creatorinfo`);
            return {
                status: response.status,
                masters: response.data.masters,
                games: response.data.games,
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
    static async getNextPlays({ id }: { id: string }) {
        try {
            const response = await AuthAPI.get<IPlayData[]>(`play/playsgame/${id}`);
            return {
                status: response.status,
                plays: response.data.map((play) => {
                    return {
                        id: Number(play.id),
                        name: play.name,
                        master: { id: Number(play.master.id), name: play.master.name },
                        players: {
                            count: Number(play.players.count),
                            min: Number(play.players.min),
                            max: Number(play.players.max),
                        },
                        status: {
                            status: Boolean(play.status.status),
                            dateStart: new Date(play.status.dateStart),
                            dateEnd: new Date(play.status.dateEnd),
                        },
                    };
                }),
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
    static async addGamerToPlay({ id }: { id: number }) {
        try {
            const response = await AuthAPI.post<IPlayData[]>(`play/${id}/gamer`);
            return {
                status: response.status,
                message: response.data,
            };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    }
    static async deleteGamerToPlay({ id }: { id: number }) {
        try {
            const response = await AuthAPI.delete<IPlayData[]>(`play/${id}/gamer`);
            return {
                status: response.status,
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
