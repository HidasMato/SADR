import { AuthAPI } from "../context/AuthContext";

export interface IPlayData {
    name: string;
    id: number;
}
export interface IPlayQuery {
    games: IPlayData[];
    count: number;
}
export interface IPlayFilter {
    page?: number;
    filter?: {
        findname?: string;
        player?: string;
        time?: string;
        hardless?: string;
    };
}
export default class GameAPI {
    static async getGames(filter: IPlayFilter): Promise<IPlayQuery> {
        return (
            await AuthAPI.get<IPlayQuery>(`/game/all`, {
                params: {
                    ...filter.filter,
                    page: filter.page,
                },
            })
        ).data;
    }
}
