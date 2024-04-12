export interface GamerPlays {
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
}
export interface MasterPlays {
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
}