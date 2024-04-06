
import { QueryResult } from 'pg';
import { pool } from './_getPool';
import ApiError from '../Exeptions/ApiError';

type getList = {
    settingList: {
        start: number,
        count: number
    },
    filter: {}
}
type update = {
    name: string | undefined,
    minplayers: number | undefined,
    maxplayers: number | undefined,
    mintimeplay: number | undefined,
    maxtimeplay: number | undefined,
    hardless: number | undefined,
    description: string | undefined,
    img: string | undefined
}

class GameService {
    async getGameList({ settingList, filter }: getList){
        if (isNaN(settingList.start) || isNaN(settingList.count))
            if (isNaN(settingList.start))
                throw ApiError.BadRequest({ message: "Неправильное значение параметра start" })
            else
                throw ApiError.BadRequest({ message: "Неправильное значение параметра count" })
        //TODO: реализовать фильт поиска
        const res: QueryResult = await pool.query(`SELECT * FROM games LIMIT $1 OFFSET $2;`, [settingList.count, settingList.start]);
        return res.rows;
    }
    async getGameInfoById({ id }: { id: number }) {
        const res: QueryResult = await pool.query(`SELECT * FROM games WHERE id = $1`, [id]);
        return res.rows?.[0];
    }
    async delete({ id }: { id: number }){
        const res: QueryResult = await pool.query(`DELETE FROM games WHERE id = $1;`, [id]);
        return res.rowCount || 0;
    }
    async update({ id, update }: { id: number, update: update }) {
        let maybeOne = false;
        for (let per in update) { if (update[per as keyof update]) { maybeOne = true; break; } }
        if (!maybeOne)
            throw ApiError.BadRequest({ message: "Нет параметров для редактирования" })
        let str1 = "", mas: any[] = [id];
        for (let add of ['name', 'minplayers', 'maxplayers', 'mintimeplay', 'maxtimeplay', 'hardless', 'description', 'img']) {
            if (update[add as keyof update] != undefined) {
                mas.push(update[add as keyof update])
                str1 += (str1 == '' ? '' : ', ') + `${add} = $${mas.length}`;
            }
        }
        const res: QueryResult = await pool.query(`UPDATE games SET ${str1} WHERE id = $1;`, mas);
        if (res.rowCount == 0)
            throw ApiError.BadRequest({ message: "Игры не существует"})
    }
    async create({ createInf }: { createInf: update }) {
        if (!createInf.name)
            throw ApiError.BadRequest({ message: "Отсутствует обязательный параметр name"})
        let str1 = "name", str2 = "$1", mas: any[] = [createInf.name];
        for (let add of ['minplayers', 'maxplayers', 'mintimeplay', 'maxtimeplay', 'hardless', 'description', 'img']) {
            if (createInf[add as keyof update]) {
                str1 += ', ' + add;
                mas.push(createInf[add as keyof update])
                str2 += ', $' + mas.length;
            }
        }
        const res: QueryResult = await pool.query(`INSERT INTO games(${str1}) VALUES (${str2}) RETURNING id;`, mas);
        return res.rows?.[0]?.id;
    }
}

export default new GameService();