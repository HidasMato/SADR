
import { QueryResult } from 'pg';
import { pool } from '../Services/_getPool';
import { NoticeMessage } from 'pg-protocol/dist/messages';
import game from './game.json';

const SQLaddGame = async () => {
    const askSQL = async (text: string) => {
        try {
            const response: QueryResult = await pool.query(text);
        } catch (error) {
            throw error;
        }
        return 0;
    }
    try {
        const values = [];
        for (let i of game) {
            values.push(["'" + [i.name] + "'", [i.minPlayers], [i.maxPlayers], [i.minTimePlay], [i.maxTimePlay], [i.hardless], "'" + [i.description] + "'", "'" + [i.img] + "'"])
        }
        await askSQL(`INSERT INTO games(
            name, minplayers, maxplayers, mintimeplay, maxtimeplay, hardless, description, img)
            VALUES 
            (${values.map((val) => { return val.join(', ') }).join('),\n(')})
            ;`);
        console.log("Игры добавлены")
    } catch (error) {
        const er = error as NoticeMessage;
        Object.keys(er).forEach(element => {
            console.log(element, ": ", er[element as keyof NoticeMessage]);
        });
        console.log(er)
        if (er.routine == 'auth_failed')
            console.log("Ошибка авторизации")

    }
}

export default SQLaddGame;