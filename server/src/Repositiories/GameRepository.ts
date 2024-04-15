import { pool } from './_getPool';

type setting = {
    start: number,
    count: number
}
type filter = {
}
type update = {
    name: string | undefined,
    minplayers: number | undefined,
    maxplayers: number | undefined,
    mintimeplay: number | undefined,
    maxtimeplay: number | undefined,
    hardless: number | undefined,
    description: string | undefined
}
type GameQuery = {
    id: number,
    name: string,
    minplayers: number,
    maxplayers: number,
    mintimeplay: number,
    maxtimeplay: number,
    hardless: number,
    description: string
}
class GameRepository {
    async getGameList({ setting, filter }: { setting: setting, filter: filter }) {
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
        return (await pool.query(`SELECT * FROM games ${filterStr} LIMIT $1 OFFSET $2;`, [setting.count, setting.start])).rows as GameQuery[];
    }
    async getGameInfoById({ id }: { id: number }) {
        const game = (await pool.query(`SELECT * FROM games WHERE id = $1`, [id]))?.rows?.[0]
        return game ? game as GameQuery : undefined;
    }
    async deleteGame({ id }: { id: number }) {
        const rowCount = (await pool.query(`DELETE FROM games WHERE id = $1;`, [id]))?.rowCount;
        return rowCount == 1 ? 1 : 0;
    }
    async updateGame({ id, update }: { id: number, update: update }) {
        //TODO: Вставить проверку, что имя уникально
        let str1 = "", mas: any[] = [id];
        for (let add of ['name', 'minplayers', 'maxplayers', 'mintimeplay', 'maxtimeplay', 'hardless', 'description']) {
            if (update[add as keyof update] != undefined) {
                mas.push(update[add as keyof update])
                str1 += (str1 == '' ? '' : ', ') + `${add} = $${mas.length}`;
            }
        }
        return (await pool.query(`UPDATE games SET ${str1} WHERE id = $1;`, mas))?.rowCount == 1 ? true : false;
    }
    async createGame({ createInf }: { createInf: update }): Promise<number> {
        //TODO: Вставить проверку, что имя уникально
        let str1 = "name", str2 = "$1", mas: any[] = [createInf.name];
        for (let add of ['minplayers', 'maxplayers', 'mintimeplay', 'maxtimeplay', 'hardless', 'description']) {
            if (createInf[add as keyof update]) {
                str1 += ', ' + add;
                mas.push(createInf[add as keyof update])
                str2 += ', $' + mas.length;
            }
        }
        return (await pool.query(`INSERT INTO games(${str1}) VALUES (${str2}) RETURNING id;`, mas))?.rows?.[0]?.id;
    }
    async isGameExists({ id }: { id: number }): Promise<boolean> {
        return (await pool.query(`SELECT (SELECT count(*) FROM games WHERE id = $1) > 0 as bol`, [id]))?.rows?.[0]?.bol || false;
    }
}

export default new GameRepository();