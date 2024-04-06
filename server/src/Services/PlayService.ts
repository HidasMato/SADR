
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
    masterId: number | undefined,
    minplayers: number | undefined,
    maxplayers: number | undefined,
    description: string | undefined,
    status: boolean | undefined,
    img: string | undefined,
    datestart: Date | undefined,
    dateend: Date | undefined,
    games: number[] | undefined
}

class PlayService {
    //FIXME: Как мы это отправляем?
    replaseTimes(obj: { datestart: any, dateend: any }) {
        obj.datestart = Number(obj.datestart).toString();
        obj.dateend = Number(obj.dateend).toString();
        return obj;
    }
    async isExists({ id, tableName }: { id: number, tableName: string }) {
        return ((await pool.query(`SELECT count(id) FROM ${tableName} WHERE id = $1`, [id])).rows[0].count != 0)
    }
    async getPlayInfoById({ id }: { id: number }) {
        const res: QueryResult = await pool.query(`SELECT * FROM plays WHERE id = $1`, [id]);
        return this.replaseTimes(res.rows[0]);
    }
    async getPlayList({ settingList, filter }: getList) {
        if (isNaN(settingList.start) || isNaN(settingList.count))
            if (isNaN(settingList.start))
                throw ApiError.BadRequest({ message: "Неправильное значение параметра start"})
            else
                throw ApiError.BadRequest({ message: "Неправильное значение параметра count"})
        //TODO: реализовать фильт поиска
        const res: QueryResult = await pool.query(`SELECT * FROM plays LIMIT $1 OFFSET $2;`, [settingList.count, settingList.start]);
        return res.rows.map(val => { return this.replaseTimes(val) });
    }
    async delete({ id }: { id: number }) {
        const res: QueryResult = await pool.query(`DELETE FROM plays WHERE id = $1;`, [id]);
        return res.rowCount || 0;
    }
    async update({ id, update }: { id: number, update: update }) {
        if (!(await this.isExists({ id: id, tableName: "plays" })))
            throw ApiError.BadRequest({ message: 'Игротеки не существует'})
        let maybeOne = false;
        let strDelete = '';
        let strCreate = '';
        const updateParametrs = ['name', 'masterId', 'minplayers', 'maxplayers', 'description', 'status', 'img', 'datestart', 'dateend']
        if (update.games?.length != 0) {
            const res2: QueryResult = await pool.query(`SELECT gameid FROM gamesofplay where playid = ${id}`);
            const ourMas = res2.rows.map(val => { return val.gameid })
            ourMas.map(val => {
                if (!update.games?.includes(val))
                    strDelete += (strDelete.length == 0 ? '' : ', ') + val;
            })
            if (strDelete.length > 0) {
                const resDelete: QueryResult = await pool.query(`DELETE FROM gamesofplay where gameid in (${strDelete}) AND playid = ${id}`);
            }
            update.games?.map(val => {
                if (!ourMas.includes(val))
                    strCreate += (strCreate.length == 0 ? '' : '), \n(') + val + ', ' + id;
            })
            if (strCreate.length > 0) {
                const resCreate: QueryResult = await pool.query(`INSERT INTO gamesofplay(gameid, playid) VALUES (${strCreate}) `);
            }
        }
        for (let per of updateParametrs)
            if (update[per as keyof update]) {
                maybeOne = true;
                break;
            }
        if (maybeOne) {
            let str1 = "", mas: any[] = [id];
            for (let add of updateParametrs) {
                if (update[add as keyof update] != undefined) {
                    mas.push(update[add as keyof update])
                    str1 += (str1 == '' ? '' : ', ') + `${add} = $${mas.length}`;
                }
            }
            await pool.query(`UPDATE plays SET ${str1} WHERE id = $1;`, mas);
        }
        if (!maybeOne && strCreate.length == 0 && strDelete.length == 0)
            throw ApiError.BadRequest({ message: "Нет параметров для редактирования"})
    }
    async create({ createInf }: { createInf: update }) {
        if (createInf.games && createInf.games.length > 0) {
            let str3 = "(";
            for (let gameId of createInf.games)
                str3 = str3 + (str3.length == 1 ? '' : ', ') + gameId;
            const res2: QueryResult = await pool.query(`SELECT id FROM games where id in ${str3})`);
            res2.rows.map(val => {
                if (createInf.games?.includes(val.id))
                    throw ApiError.BadRequest({ message: `Игра с id=${val} не существует`});
            })
        }
        let str1 = "name", str2 = "$1", mas: any[] = [createInf.name];
        for (let add of ['masterId', 'minplayers', 'maxplayers', 'description', 'status', 'img', 'datestart', 'dateend']) {
            if (createInf[add as keyof update]) {
                str1 += ', ' + add;
                mas.push(add == 'datestart' || add == 'dateend' ? new Date(Number(createInf[add as keyof update])) : createInf[add as keyof update])
                str2 += ', $' + mas.length;
            }
        }
        const res: QueryResult = await pool.query(`INSERT INTO plays(${str1}) VALUES (${str2}) RETURNING id;`, mas);
        if (res.rows?.[0]?.id && createInf.games && createInf.games?.length > 0)
            (new PlayService).update({ id: res.rows?.[0]?.id, update: { games: createInf.games } as update })
        return res.rows?.[0]?.id;
    }
    async registrUserToPlay({ playId, userId }: { playId: number, userId: number }) {
        if (!(await this.isExists({ id: playId, tableName: "plays" })))
            throw ApiError.BadRequest({ message: 'Игротеки не существует'})
        if (!(await this.isExists({ id: userId, tableName: "users" })))
            throw ApiError.BadRequest({ message: 'Пользователя не существует'})
        if ((await pool.query(`SELECT count(id) FROM usersofplay WHERE userid = $1 AND playid = $2`, [userId, playId])).rows[0].count != 0)
            throw ApiError.BadRequest({ message: 'Пользователь уже записан на игротеку'});
        if ((await pool.query(`SELECT((SELECT count(id) FROM usersofplay WHERE playid = $1) >= (SELECT maxplayers FROM plays WHERE id = $1 LIMIT 1)) as bol`, [playId])).rows[0].bol)
            throw ApiError.BadRequest({ message: 'Мест нет'})
        await pool.query(`INSERT INTO public.usersofplay( userid, playid ) VALUES ($1,$2)`, [userId, playId])
    }
    async unRegistrUserToPlay({ playId, userId }: { playId: number, userId: number }) {
        if (!(await this.isExists({ id: playId, tableName: "plays" })))
            throw ApiError.BadRequest({ message: 'Игротеки не существует'})
        if (!(await this.isExists({ id: userId, tableName: "users" })))
            throw ApiError.BadRequest({ message: 'Пользователя не существует'});
        if ((await pool.query(`SELECT count(id) FROM usersofplay WHERE userid = $1 AND playid = $2`, [userId, playId])).rows[0].count == 0)
            throw ApiError.BadRequest({ message: 'Пользователь не записан на игротеку'});
        await pool.query(`DELETE FROM usersofplay WHERE userid = $1 AND playid = $2`, [userId, playId])
    }
}

export default new PlayService();