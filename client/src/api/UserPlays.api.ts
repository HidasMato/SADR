import { AuthAPI } from "../context/AuthContext";

export interface IGamerPlaysData {
    plays: {
        id: number,
        name: string,
        description: string,
        master: {
            id: number,
            name: string
        },
        players: {
            count: number,
            min: number,
            max: number
        },
        status: {
            status: boolean,
            dateStart: Date,
            dateEnd: Date
        }
    }[],
}
export interface IMasterPlaysData {
    plays: {
        id: number,
        name: string,
        description: string,
        players: {
            list: { id: number, nickname: string }[],
            min: number,
            max: number
        },
        status: {
            status: boolean,
            dateStart: Date,
            dateEnd: Date
        }
    }[],
}

export default class UserPlaysAPI {
    static async getGamerPlays(id: number): Promise<IGamerPlaysData> {
        return { plays: (await AuthAPI.get<IGamerPlaysData>(`/user/${id}/playsgamer`)).data.plays }
    }
    static async getMasterPlays(id: number | undefined): Promise<IMasterPlaysData> {
        return { plays: (await AuthAPI.get<IMasterPlaysData>(`/user/${id}/playsmaster`)).data.plays }
    }
}