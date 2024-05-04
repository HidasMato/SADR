import { GameQuery } from "../Types/GameQuery";
import { GameFilter, GameSetting } from "../Types/GameSetting";
import { GameUpdate } from "../Types/GameUpdate";
import { pool } from "./_getPool";

type GameFilterVar = {
    player: number;
    time: number;
    hardless: number;
    findname: string;
};

const Variable = {
    player: " minplayers <= $||| AND maxplayers >= $|||",
    time: " mintimeplay <= $||| AND maxtimeplay >= $|||",
    hardless: " hardless = $||| ",
    findname: " lower(name) LIKE $||| ",
};

class GameRepository {
    async getAllGame() {
        return (await pool.query(`SELECT id, name FROM games;`)).rows as GameQuery[];
    }
    async getGameList({ setting, filter }: GameSetting) {
        const limit = 20;
        const filterVar: any[] = [];
        let filterStr = "";
        for (let add of Object.keys(filter)) {
            if (filter[add as keyof GameFilter]) {
                if (filterStr.length == 0) filterStr = " WHERE ";
                else filterStr += " AND ";
                filterStr += Variable[add as keyof GameFilterVar].replaceAll("|||", filterVar.length + 1 + "");
                if (add == "findname") filterVar.push("%" + (filter.findname ?? "").toLowerCase() + "%");
                else filterVar.push(filter[add as keyof GameFilter]);
            }
        }
        const addStr = ` LIMIT ${limit} OFFSET ${((setting.page ?? 1) - 1) * limit}`;
        const games = (await pool.query(`SELECT id, name FROM games ${filterStr} ${addStr};`, filterVar)).rows as GameQuery[];
        const count = (await pool.query(`SELECT count(*) as sum FROM games ${filterStr}`, filterVar)).rows[0].sum;
        return {
            games: games,
            count: Math.ceil(Number(count) / limit),
        };
    }
    async getGameInfoById({ id }: { id: number }) {
        const game = (await pool.query(`SELECT * FROM games WHERE id = $1`, [id]))?.rows?.[0];
        return game ? (game as GameQuery) : undefined;
    }
    async deleteGame({ id }: { id: number }) {
        const rowCount = (await pool.query(`DELETE FROM games WHERE id = $1;`, [id]))?.rowCount;
        return rowCount == 1 ? 1 : 0;
    }
    async updateGame({ id, update }: { id: number; update: GameUpdate }) {
        let str1 = "",
            mas: any[] = [id];
        for (let add of ["name", "minplayers", "maxplayers", "mintimeplay", "maxtimeplay", "hardless", "description"]) {
            if (update[add as keyof GameUpdate] != undefined) {
                mas.push(update[add as keyof GameUpdate]);
                str1 += (str1 == "" ? "" : ", ") + `${add} = $${mas.length}`;
            }
        }
        return (await pool.query(`UPDATE games SET ${str1} WHERE id = $1;`, mas))?.rowCount == 1;
    }
    async createGame({ createInf }: { createInf: GameUpdate }): Promise<number> {
        let str1 = "name",
            str2 = "$1",
            mas: any[] = [createInf.name];
        for (let add of ["minplayers", "maxplayers", "mintimeplay", "maxtimeplay", "hardless", "description"]) {
            if (createInf[add as keyof GameUpdate]) {
                str1 += ", " + add;
                mas.push(createInf[add as keyof GameUpdate]);
                str2 += ", $" + mas.length;
            }
        }
        return (await pool.query(`INSERT INTO games(${str1}) VALUES (${str2}) RETURNING id;`, mas))?.rows?.[0]?.id;
    }
    async isGameExists({ id }: { id: number }): Promise<boolean> {
        return (await pool.query(`SELECT (SELECT count(*) FROM games WHERE id = $1) > 0 as bol`, [id]))?.rows?.[0]?.bol || false;
    }
}

export default new GameRepository();
