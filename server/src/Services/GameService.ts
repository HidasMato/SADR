
import { QueryResult } from 'pg';
import { pool } from './_getPool';

type getList = {
    settingList: {
        start: number,
        count: number
    },
    filter: {}
}
type update = {
    name: string | undefined,
    minPlayers: number | undefined,
    maxPlayers: number | undefined,
    minTimePlay: number | undefined,
    maxTimePlay: number | undefined,
    hardless: number | undefined,
    description: string | undefined,
    img: string | undefined
}

class GameService {
    async getGameList({ settingList, filter }: getList): Promise<Object[]> {
        if (isNaN(settingList.start) || isNaN(settingList.count))
            if (isNaN(settingList.start))
                throw new Error("Неправильное значение параметра start")
            else
                throw new Error("Неправильное значение параметра count")
        const res: QueryResult = await pool.query(`SELECT * FROM games LIMIT $1 OFFSET $2;`, [settingList.count, settingList.start]);
        return res.rows;
    }
    async getGameInfoById({ id }: { id: number }): Promise<Object | undefined> {
        if (isNaN(id))
            throw new Error("Неправильное значение id");
        const res: QueryResult = await pool.query(`SELECT * FROM games WHERE id = $1`, [id]);
        return res.rows?.[0];
    }
    async delete({ id }: { id: number }): Promise<number> {
        if (isNaN(id))
            throw new Error("Неправильное значение id")
        const res: QueryResult = await pool.query(`DELETE FROM games WHERE id = $1;`, [id]);
        return res.rowCount || 0;
    }
    async update({ id, update }: { id: number, update: update }): Promise<void> {
        if (isNaN(id))
            throw new Error("Неправильное значение id")
        let maybeOne = false;
        for (let per in update) { if (update[per as keyof update]) { maybeOne = true; break; } }
        if (!maybeOne)
            throw new Error("Нет параметров для редактирования")
        const res: QueryResult = await pool.query(`UPDATE games SET ${[update.name && `name='${update.name}'`, update.minPlayers && `minPlayers=${update.minPlayers}`, update.maxPlayers && `maxPlayers=${update.maxPlayers}`, update.minTimePlay && `minTimePlay=${update.minTimePlay}`, update.maxTimePlay && `maxTimePlay=${update.maxTimePlay}`, update.hardless && `hardless=${update.hardless}`, update.description && `description='${update.description}'`, update.img && `name=${update.img}`,].filter((val) => val).join(', ')} WHERE id = $1;`, [id]);
        if (res.rowCount == 0) 
            throw new Error ("Игры не существует")
    }
    async create({ createInf }: { createInf: update }): Promise<number | undefined> {
        if (!createInf.name)
            throw new Error("Отсутствует обязательный параметр name")
        let str1 = "name", str2 = "$1", mas = [createInf.name];
        for (let add of ['minPlayers', 'maxPlayers', 'minTimePlay', 'maxTimePlay', 'hardless', 'description', 'img']) {
            if (createInf[add as keyof update]) {
                str1 += ', ' + add;
                mas.push(String(createInf[add as keyof update]))
                str2 += ', $' + mas.length;
            }
        }
        const res: QueryResult = await pool.query(`INSERT INTO games(${str1}) VALUES (${str2}) RETURNING id;`, mas);
        return res.rows?.[0]?.id;
    }
}

export default new GameService;