import { AuthAPI } from "../context/AuthContext";

export interface IGameData {
    name: string,
    id: number
}
export interface IGameQuery {
    games: IGameData[],
    count: number
}
export interface IGameFilter {
    page?: number,
    filter?: {
        findname?: string,
        player?: string,
        time?: string,
        hardless?: string,
    }
}
export default class GameAPI {
    static async getGames(filter: IGameFilter): Promise<IGameQuery> {
        return (await AuthAPI.get<IGameQuery>(`/game/all`, {
            params: {
                ...filter.filter,
                page: filter.page
            },
        })).data
    }
}