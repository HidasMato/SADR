import { PlayCreate } from "../Types/PlayCreate";
import { PlayQuery } from "../Types/PlayQuery";
import { PlayFilter, PlaySetting } from "../Types/PlaySetting";
import { pool } from "./_getPool";

type PlayFilterVar = {
    datestart: number;
    dateend: number;
    masterid: number;
    freeplace: number;
};

class PlayRepository {
    async getPlayInfoById({ id }: { id: number }): Promise<PlayQuery> {
        return (await pool.query(`SELECT *, (SELECT name FROM users WHERE id = masterid) as mastername FROM plays WHERE id = $1`, [id]))?.rows?.[0];
    }
    async getPlayList({ setting, filter }: PlaySetting) {
        const limit = 20;
        const filterVar: any[] = [];
        let filterStr = "";
        for (let add of Object.keys(filter)) {
            if (filter[add as keyof PlayFilter] != undefined) {
                if (filterStr.length == 0) filterStr = " WHERE ";
                else filterStr += " AND ";
                switch (add) {
                    case "datestart":
                        filterVar.push(filter.datestart);
                        filterStr += ` datestart >= $${filterVar.length} `;
                        break;
                    case "dateend":
                        filterVar.push(filter.dateend);
                        filterStr += ` dateend <= $${filterVar.length} `;
                        break;
                    case "masterid":
                        filterVar.push(filter.masterid);
                        filterStr += ` masterid = $${filterVar.length} `;
                        break;
                    case "freeplace":
                        if (filter.freeplace == -1) {
                            filterStr += ` id IN (SELECT playid FROM usersofplay GROUP BY playid HAVING count(userid) = 0) `;
                        } else {
                            // найти все у кого колво ост -  записей = freeplace
                            filterVar.push(filter.freeplace);
                            filterStr += `  id IN (SELECT playid FROM usersofplay GROUP BY playid HAVING (SELECT maxplayers from plays WHERE id = playid) - count(userid) ${filter.freeplace == 0 ? "" : ">"}= $${filterVar.length}) `;
                        }
                        break;
                    case "findname":
                        filterVar.push("%" + (filter.findname ?? "").toLowerCase() + "%");
                        filterStr += ` lower(name) LIKE $${filterVar.length} `;
                        break;
                }
            }
        }
        const addStr = ` LIMIT ${limit} OFFSET ${((setting.page ?? 1) - 1) * limit}`;
        const plays = (await pool.query(`SELECT * FROM plays ${filterStr} ${addStr};`, filterVar)).rows as PlayQuery[];
        const count = (await pool.query(`SELECT count(*) as sum FROM plays ${filterStr}`, filterVar)).rows[0].sum;
        return {
            plays: plays,
            count: Math.ceil(Number(count) / limit),
        };
    }
    async isPlayExists({ id }: { id: number }): Promise<boolean> {
        return (await pool.query(`SELECT (SELECT count(*) FROM plays WHERE id = $1) > 0 as bol`, [id])).rows[0].bol;
    }
    async deletePlay({ id }: { id: number }): Promise<boolean> {
        return ((await pool.query(`DELETE FROM plays WHERE id = $1;`, [id])).rowCount as number) > 0;
    }
    async updatePlay({ id, update }: { id: number; update: PlayCreate }): Promise<boolean> {
        let str1 = "",
            mas: any[] = [id];
        for (let add of ["name", "masterId", "minplayers", "maxplayers", "description", "status", "datestart", "dateend"]) {
            if (update[add as keyof PlayCreate] != undefined) {
                mas.push(update[add as keyof PlayCreate]);
                str1 += (str1 == "" ? "" : ", ") + `${add} = $${mas.length}`;
            }
        }
        return ((await pool.query(`UPDATE plays SET ${str1} WHERE id = $1;`, mas)).rowCount as number) > 0;
    }
    async createPlay({ create }: { create: PlayCreate }): Promise<number | undefined> {
        let str1 = "name",
            str2 = "$1",
            mas: any[] = [create.name];
        for (let add of ["masterId", "minplayers", "maxplayers", "description", "status", "datestart", "dateend"]) {
            if (create[add as keyof PlayCreate]) {
                str1 += ", " + add;
                mas.push(create[add as keyof PlayCreate]);
                str2 += ", $" + mas.length;
            }
        }
        return (await pool.query(`INSERT INTO plays(${str1}) VALUES (${str2}) RETURNING id;`, mas))?.rows?.[0]?.id;
    }
    async getGamesIdOnPlay({ playId }: { playId: number }): Promise<number[]> {
        return (await pool.query(`SELECT gameid FROM gamesofplay WHERE playid = $1`, [playId]))?.rows?.map((row) => {
            return row.gameid as number;
        });
    }
    async getGamesOnPlay({ playId }: { playId: number }): Promise<number[]> {
        return (await pool.query(`SELECT gameid as id, (SELECT name FROM games WHERE games.id = gameid) FROM gamesofplay WHERE playid = $1`, [playId]))?.rows;
    }
    async getGamersOnPlay({ playId }: { playId: number }): Promise<number[]> {
        return (await pool.query(`SELECT userid FROM usersofplay WHERE playid = $1`, [playId]))?.rows?.map((row) => {
            return row.userid as number;
        });
    }
    async deleteGameOfPlay({ playId, gameId }: { playId: number; gameId: number }): Promise<boolean> {
        return ((await pool.query(`DELETE FROM gamesofplay WHERE playid = $1 AND gameId = $2`, [playId, gameId]))?.rowCount as number) > 0 || false;
    }
    async addGameOfPlay({ playId, gameId }: { playId: number; gameId: number }): Promise<boolean> {
        return ((await pool.query(`INSERT INTO gamesofplay( gameid, playid ) VALUES ($1, $2)`, [gameId, playId]))?.rowCount as number) > 0 || false;
    }
    async isUserOnPlay({ playId, userId }: { playId: number; userId: number }): Promise<boolean> {
        return (await pool.query(`SELECT(SELECT count(id) FROM usersofplay WHERE userid = $1 AND playid = $2) > 0 as bol`, [userId, playId])).rows[0].bol;
    }
    async isPlayMax({ playId }: { playId: number }): Promise<boolean> {
        return (await pool.query(`SELECT((SELECT count(id) FROM usersofplay WHERE playid = $1) >= (SELECT maxplayers FROM plays WHERE id = $1 LIMIT 1)) as bol`, [playId])).rows[0].bol;
    }
    async addGamerToPlay({ playId, userId }: { playId: number; userId: number }): Promise<boolean> {
        return ((await pool.query(`INSERT INTO usersofplay( userid, playid ) VALUES ($1,$2)`, [userId, playId])).rowCount as number) > 0;
    }
    async deleteGamerofPlay({ playId, userId }: { playId: number; userId: number }): Promise<boolean> {
        return ((await pool.query(`DELETE FROM usersofplay WHERE userid = $1 AND playid = $2 `, [userId, playId])).rowCount as number) > 0;
    }
    async getAllGamersPlays({ gamerId }: { gamerId: number }): Promise<number[]> {
        return (await pool.query(`SELECT playid FROM usersofplay WHERE userid = $1`, [gamerId])).rows.map((val) => {
            return val.playid;
        });
    }
    async getAllMastersPlays({ masterId }: { masterId: number }): Promise<number[]> {
        return (await pool.query(`SELECT id FROM plays WHERE masterid = $1`, [masterId])).rows.map((val) => {
            return val.id;
        });
    }
    async getAllGamersInfoOnPlays({ playId }: { playId: number }): Promise<{ id: number; name: string }[]> {
        return (await pool.query(`SELECT id, name FROM users WHERE id IN (SELECT userid FROM usersofplay WHERE playid = $1)`, [playId])).rows as {
            id: number;
            name: string;
        }[];
    }
    async isPlaysMasterPlay({ playId, masterId }: { playId: number; masterId: number }): Promise<boolean> {
        return (await pool.query(`SELECT (SELECT count(*) FROM plays WHERE masterid = $1 AND id = $2) = 1 as bol; `, [masterId, playId])).rows[0];
    }
    async getPlaysGame({ id }: { id: number }) {
        return (
            await pool.query(
                `SELECT *, (SELECT name FROM users WHERE id = masterid) as mastername, (SELECT count(*) as playerscount from usersofplay WHERE plays.id = playid)from plays WHERE id in (SELECT DISTINCT playid FROM gamesofplay WHERE gameid = $1 LIMIT 3);`,
                [id],
            )
        ).rows;
    }
}

export default new PlayRepository();
