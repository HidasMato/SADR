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
    nickname: string;
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
export default class PlaysAPI {
    static async getPlays(filter: IPlaysFilter): Promise<IPlaysQuery> {
        return (
            await AuthAPI.get<IPlaysQuery>(`/play/all`, {
                params: {
                    ...filter.filter,
                    page: filter.page,
                },
            })
        ).data;
    }
    static async getMasters(): Promise<IMasterQuery> {
        return (await AuthAPI.get<IMasterQuery>(`/user/masters`)).data;
    }
}
