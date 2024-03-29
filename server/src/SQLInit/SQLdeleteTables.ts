
import { QueryResult } from 'pg';
import { pool } from '../Services/_getPool';
import { NoticeMessage } from 'pg-protocol/dist/messages';

const SQLdeleteTables = async () => {
    const askSQL = async (text: string) => {
        try {
            const response: QueryResult = await pool.query(text);
            console.log(`${text.split(" ")[4]}`)
        } catch (error) {
            throw error;
        }
        return 0;
    }
    try {
        await askSQL(`DROP TABLE IF EXISTS ReviewsToMaster;`);
        await askSQL(`DROP TABLE IF EXISTS ReviewsToGame;`);
        await askSQL(`DROP TABLE IF EXISTS ReviewsToPlay;`);
        await askSQL(`DROP TABLE IF EXISTS GamesOfPlay;`);
        await askSQL(`DROP TABLE IF EXISTS UsersOfPlay;`);
        await askSQL(`DROP TABLE IF EXISTS Plays;`);
        await askSQL(`DROP TABLE IF EXISTS Admins;`);
        await askSQL(`DROP TABLE IF EXISTS Masters;`);
        await askSQL(`DROP TABLE IF EXISTS Users;`);
        await askSQL(`DROP TABLE IF EXISTS Games;`);
        console.log("База данных удалена!")
    } catch (error) {
        const er = error as NoticeMessage;
        Object.keys(er).forEach(element => {
            console.log(element, ": ", er[element as keyof NoticeMessage]);
        });
        console.log(er)
        if (er.routine == 'auth_failed')
            console.log("Ошибка удаления")

    }
}

export default SQLdeleteTables;