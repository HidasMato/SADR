import { AuthAPI } from "../context/AuthContext";

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
export default class PlayAPI {
    static async getPlay(id: number) {
        const responce = await AuthAPI.get<IPlayQuery>(`/play/${id}`);
        if (responce.data) {
            responce.data = {
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
            };
        }
        return responce;
    }
}
