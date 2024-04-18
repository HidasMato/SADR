export type PlayQuery = {
    id: number,
    name: string,
    masterid: number,
    minplayers: number,
    maxplayers: number,
    description: string,
    status: boolean,
    datestart: Date,
    dateend: Date,
}