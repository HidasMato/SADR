
import { QueryResult } from 'pg';
import { pool } from './_getPool';
import ApiError from '../Exeptions/ApiError';
import { UploadedFile } from 'express-fileupload';
import FileService from './FileService';
import ForAllService from './ForAllService';

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
    status: boolean | undefined
    datestart: Date | undefined,
    dateend: Date | undefined,
    games: number[] | undefined
}

class PlayService {
    async getPlayInfoById({ id }: { id: number }) {
        const res: QueryResult = await pool.query(`SELECT * FROM plays WHERE id = $1`, [id]);
        return res.rows[0];
    }
    async getPlayList({ settingList, filter }: getList) {
        //TODO: реализовать фильт поиска
        const res: QueryResult = await pool.query(`SELECT * FROM plays LIMIT $1 OFFSET $2;`, [settingList.count, settingList.start]);
        return res.rows;
    }
    async delete({ id }: { id: number }) {
        const res: QueryResult = await pool.query(`DELETE FROM plays WHERE id = $1;`, [id]);
        return res.rowCount || 0;
    }
    async update({ id, update, image }: { id: number, update: update, image?: UploadedFile | undefined }) {
        if (!(await ForAllService.isExists({ id: id, tableName: "plays" })))
            throw ApiError.BadRequest({ status: 471, message: "Игротеки не существует" })
        let maybeOne = false;
        let strDelete = '';
        let strCreate = '';
        const updateParametrs = ['name', 'masterId', 'minplayers', 'maxplayers', 'description', 'status', 'datestart', 'dateend']
        if (update.games?.length != 0) {
            const res2: QueryResult = await pool.query(`SELECT gameid FROM gamesofplay where playid = ${id}`);
            const ourMas = res2.rows.map(val => { return val.gameid })
            ourMas.map(val => {
                if (!update.games?.includes(val))
                    strDelete += (strDelete.length == 0 ? '' : ', ') + val;
            })
            if (strDelete.length > 0)
                await pool.query(`DELETE FROM gamesofplay where gameid in (${strDelete}) AND playid = ${id}`);
            update.games?.map(val => {
                if (!ourMas.includes(val))
                    strCreate += (strCreate.length == 0 ? '' : '), \n(') + val + ', ' + id;
            })
            if (strCreate.length > 0)
                await pool.query(`INSERT INTO gamesofplay(gameid, playid) VALUES (${strCreate}) `);
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
        if (image)
            await FileService.saveFile({ file: image as UploadedFile, fileName: 'play_' + id + '.png' })
        if (!maybeOne && strCreate.length == 0 && strDelete.length == 0)
            return false;
        else
            return true;
    }
    async create({ createInf, image }: { createInf: update, image?: UploadedFile | undefined }) {
        if (createInf.games && createInf.games.length > 0) {
            let str3 = "(";
            for (let gameId of createInf.games)
                str3 = str3 + (str3.length == 1 ? '' : ', ') + gameId;
            const res2: QueryResult = await pool.query(`SELECT id FROM games where id in ${str3})`);
            console.log(res2.rows)
            res2.rows.map(val => {
                console.log(createInf.games, val.id)
                if (!createInf.games?.includes(val.id))
                    throw ApiError.BadRequest({ status: 472, message: `Игра с id=${val} не существует` });
            })
        }
        let str1 = "name", str2 = "$1", mas: any[] = [createInf.name];
        for (let add of ['masterId', 'minplayers', 'maxplayers', 'description', 'status', 'datestart', 'dateend']) {
            if (createInf[add as keyof update]) {
                str1 += ', ' + add;
                mas.push(createInf[add as keyof update])
                str2 += ', $' + mas.length;
            }
        }
        const res: QueryResult = await pool.query(`INSERT INTO plays(${str1}) VALUES (${str2}) RETURNING id;`, mas);
        if (res.rows?.[0]?.id && createInf.games && createInf.games?.length > 0)
            (new PlayService).update({ id: res.rows?.[0]?.id, update: { games: createInf.games } as update })
        if (image)
            await FileService.saveFile({ file: image as UploadedFile, fileName: 'play_' + res.rows?.[0]?.id + '.png' })
        return res.rows?.[0]?.id;
    }
    async registrUserToPlay({ playId, userId }: { playId: number, userId: number }) {
        if (!(await ForAllService.isExists({ id: playId, tableName: "plays" })))
            throw ApiError.BadRequest({ status: 471, message: "Игротеки не существует" })
        if (!(await ForAllService.isExists({ id: userId, tableName: "users" })))
            throw ApiError.BadRequest({ status: 470, message: "Пользователя не существует" })
        if ((await pool.query(`SELECT count(id) FROM usersofplay WHERE userid = $1 AND playid = $2`, [userId, playId])).rows[0].count != 0)
            throw ApiError.BadRequest({ message: 'Пользователь уже записан на игротеку' });
        if ((await pool.query(`SELECT((SELECT count(id) FROM usersofplay WHERE playid = $1) >= (SELECT maxplayers FROM plays WHERE id = $1 LIMIT 1)) as bol`, [playId])).rows[0].bol)
            throw ApiError.BadRequest({ message: 'Мест нет' })
        await pool.query(`INSERT INTO public.usersofplay( userid, playid ) VALUES ($1,$2)`, [userId, playId])
    }
    async unRegistrUserToPlay({ playId, userId }: { playId: number, userId: number }) {
        if (!(await ForAllService.isExists({ id: playId, tableName: "plays" })))
            throw ApiError.BadRequest({ status: 471, message: "Игротеки не существует" })
        if (!(await ForAllService.isExists({ id: userId, tableName: "users" })))
            throw ApiError.BadRequest({ status: 470, message: "Пользователя не существует" })
        if ((await pool.query(`SELECT count(id) FROM usersofplay WHERE userid = $1 AND playid = $2`, [userId, playId])).rows[0].count == 0)
            throw ApiError.BadRequest({ message: 'Пользователь не записан на игротеку' });
        await pool.query(`DELETE FROM usersofplay WHERE userid = $1 AND playid = $2`, [userId, playId])
    }
    async getPlaysGamer({ id }: { id: number }) {
        if (!(await ForAllService.isExists({ id: id, tableName: "users" })))
            throw ApiError.BadRequest({ status: 470, message: "Пользователя не существует" })
        const playsId = (await pool.query(`SELECT playid FROM usersofplay WHERE userid = $1`, [id])).rows.map(val => {
            return val.playid
        });
        const plays = await Promise.all(playsId.map(async id => {
            const inf = (await pool.query(`SELECT id, name, masterid, minplayers, maxplayers, description, status, dateend, datestart, (SELECT nickname from users where id = plays.masterid) as mastername, (SELECT count(*) from usersofplay where playid = plays.id ) as gamercount FROM plays WHERE id = $1;`, [id])).rows[0];
            return {
                id: inf.id,
                name:inf.name,
                description:inf.description,
                master: {
                    id: inf.masterid,
                    name: inf.mastername
                },
                players: {
                    count:inf.gamercount,
                    min:inf.minplayers,
                    max:inf.maxplayers
                },
                status: {
                    status: inf.status,
                    dateStart: inf.datestart,
                    dateEnd: inf.dateend
                }
            }
        }))
        return plays;
    }
    async getPlaysMaster({ id }: { id: number }) {
        if (!(await ForAllService.isExists({ id: id, tableName: "users" })))
            throw ApiError.BadRequest({ status: 470, message: "Пользователя не существует" })
        if (!(await ForAllService.isExists({ id: id, tableName: "masters" })))
            throw ApiError.BadRequest({ status: 473, message: "Мастера не существует" })
        const playsId = (await pool.query(`SELECT DISTINCT playid FROM usersofplay WHERE playid IN (SELECT id FROM plays WHERE masterid = $1)`, [id])).rows.map(val => {
            return val.playid
        });
        const plays = await Promise.all(playsId.map(async id => {
            const inf = (await pool.query(`SELECT id, name, minplayers, maxplayers, description, status, dateend, datestart FROM plays WHERE id = $1;`, [id])).rows[0];
            const gamers = (await pool.query(`SELECT id, nickname FROM users WHERE id IN (SELECT userid FROM usersofplay WHERE playid = $1);`, [inf.id])).rows;
            return {
                id: inf.id,
                name:inf.name,
                description:inf.description,
                players: {
                    list: gamers,
                    min:inf.minplayers,
                    max:inf.maxplayers
                },
                status: {
                    status: inf.status,
                    dateStart: inf.datestart,
                    dateEnd: inf.dateend
                }
            }
        }))
        return plays;
    }
}

export default new PlayService();