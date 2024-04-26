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
export default class GamesAPI {
    static async getGames(filter: IGamesFilter): Promise<IGamesQuery> {
        return (
            await AuthAPI.get<IGamesQuery>(`/game/all`, {
                params: {
                    ...filter.filter,
                    page: filter.page,
                },
            })
        ).data;
    }
    static async canIAddGame(): Promise<boolean> {
        return (await AuthAPI.get<boolean>(`/user/rules/1`)).data;
    }
}
