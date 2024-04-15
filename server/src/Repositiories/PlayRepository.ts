
import { pool } from './_getPool';

type getList = {
    setting: {
        start: number,
        count: number
    },
    filter: {}
}

type update = {
    name: string | undefined,
    masterId: number | undefined,
    minplayers: number | undefined,
    maxplayers: number | undefined,
    description: string | undefined,
    status: boolean | undefined
    datestart: Date | undefined,
    dateend: Date | undefined
}
type PlayQuery = {
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

class PlayRepository {
    async getPlayInfoById({ id }: { id: number }): Promise<PlayQuery> {
        return (await pool.query(`SELECT * FROM plays WHERE id = $1`, [id]))?.rows?.[0];
    }
    async getPlayList({ setting, filter }: getList): Promise<PlayQuery[]> {
        let filterStr = '';
        //TODO: реализовать строку фильтра
        for (let add of Object.keys(filter)) {
            if (filterStr.length == 0)
                filterStr = 'WHERE '
            else
                filterStr += 'AND '
            switch (add) {
                case 'maxplayers':
                    // filterStr += 'maxplayers = ' + filterStr.maxplayers
                    break;
                default:
                    break;
            }
        }
        return (await pool.query(`SELECT * FROM plays LIMIT $1 OFFSET $2;`, [setting.count, setting.start])).rows as PlayQuery[];
    }
    async isPlayExists({ id }: { id: number }): Promise<boolean> {
        return (await pool.query(`SELECT (SELECT count(*) FROM plays WHERE id = $1) > 0 as bol`, [id])).rows[0].bol;
    }
    async deletePlay({ id }: { id: number }): Promise<boolean> {
        return (await pool.query(`DELETE FROM plays WHERE id = $1;`, [id])).rowCount as number > 0 ? true : false;
    }
    async updatePlay({ id, update }: { id: number, update: update }): Promise<boolean> {
        let str1 = "", mas: any[] = [id];
        for (let add of Object.keys(update)) {
            if (update[add as keyof update] != undefined) {
                mas.push(update[add as keyof update])
                str1 += (str1 == '' ? '' : ', ') + `${add} = $${mas.length}`;
            }
        }
        return (await pool.query(`UPDATE plays SET ${str1} WHERE id = $1;`, mas)).rowCount as number > 0 ? true : false;
    }
    async createPlay({ createInf }: { createInf: update }): Promise<number | undefined> {
        let str1 = "name", str2 = "$1", mas: any[] = [createInf.name];
        for (let add of ['masterId', 'minplayers', 'maxplayers', 'description', 'status', 'datestart', 'dateend']) {
            if (createInf[add as keyof update]) {
                str1 += ', ' + add;
                mas.push(createInf[add as keyof update])
                str2 += ', $' + mas.length;
            }
        }
        return (await pool.query(`INSERT INTO plays(${str1}) VALUES (${str2}) RETURNING id;`, mas))?.rows?.[0]?.id;
    }
    async getGamesOnPlay({ playId }: { playId: number }): Promise<number[]> {
        return (await pool.query(`SELECT gameid FROM gamesofplay WHERE playid = $1`, [playId]))?.rows?.map(row => { return row.gameid as number });
    }
    async deleteGameOfPlay({ playId, gameId }: { playId: number, gameId: number }): Promise<boolean> {
        return ((await pool.query(`DELETE FROM gamesofplay WHERE playid = $1 AND gameId = $2`, [playId, gameId]))?.rowCount as number > 0 ? true : false) || false;
    }
    async addGameOfPlay({ playId, gameId }: { playId: number, gameId: number }): Promise<boolean> {
        return ((await pool.query(`INSERT INTO gamesofplay( gamesid, playid ) VALUES ($1, $2)`, [gameId, playId]))?.rowCount as number > 0 ? true : false) || false;
    }
    async isUserOnPlay({ playId, userId }: { playId: number, userId: number }): Promise<boolean> {
        return ((await pool.query(`SELECT(SELECT count(id) FROM usersofplay WHERE userid = $1 AND playid = $2) > 0 as bol`, [userId, playId])).rows[0].bol)
    }
    async isPlayMax({ playId }: { playId: number }): Promise<boolean> {
        return ((await pool.query(`SELECT((SELECT count(id) FROM usersofplay WHERE playid = $1) >= (SELECT maxplayers FROM plays WHERE id = $1 LIMIT 1)) as bol`, [playId])).rows[0].bol)
    }
    async addGamerToPlay({ playId, userId }: { playId: number, userId: number }): Promise<boolean> {
        return ((await pool.query(`INSERT INTO usersofplay( userid, playid ) VALUES ($1,$2)`, [userId, playId])).rowCount as number > 0)
    }
    async deleteGamerofPlay({ playId, userId }: { playId: number, userId: number }): Promise<boolean> {
        return ((await pool.query(`DELETE FROM usersofplay WHERE userid = $1 AND playid - $2 `, [userId, playId])).rowCount as number > 0)
    }
    async getAllGamersPlays({ gamerId }: { gamerId: number }): Promise<number[]> {
        return (await pool.query(`SELECT playid FROM usersofplay WHERE userid = $1`, [gamerId])).rows.map(val => {
            return val.playid
        })
    }
    async getAllMastersPlays({ masterId }: { masterId: number }): Promise<number[]> {
        return (await pool.query(`SELECT id FROM plays WHERE masterid = $1`, [masterId])).rows.map(val => {
            return val.id
        })
    }
    async getAllGamersInfoOnPlays({ playId }: { playId: number }): Promise<{ id: number, nickname: string }[]> {
        return (await pool.query(`SELECT id, nickname FROM users WHERE id IN (SELECT userid FROM usersofplay WHERE playid = $1)`, [playId])).rows as { id: number, nickname: string }[]
    }
}

export default new PlayRepository();