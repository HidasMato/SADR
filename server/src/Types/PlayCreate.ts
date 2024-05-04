export type PlayCreate = {
    name: string;
    masterId: number;
    minplayers: number;
    maxplayers: number;
    description: string;
    status: boolean;
    datestart: Date;
    dateend: Date;
    games: number[];
};
