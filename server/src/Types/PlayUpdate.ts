export type PlayUpdate = {
    name: string | undefined,
    masterId: number | undefined,
    minplayers: number | undefined,
    maxplayers: number | undefined,
    description: string | undefined,
    status: boolean | undefined,
    datestart: Date | undefined,
    dateend: Date | undefined,
    games: number[] | undefined
}