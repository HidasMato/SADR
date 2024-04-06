import { pool } from '../Services/_getPool';
import { NoticeMessage } from 'pg-protocol/dist/messages';

const SQLdeleteTables = async () => {
    try {
        await pool.query(`DROP TABLE IF EXISTS reviewstomaster;`);
        await pool.query(`DROP TABLE IF EXISTS reviewstogame;`);
        await pool.query(`DROP TABLE IF EXISTS reviewstoplay;`);
        await pool.query(`DROP TABLE IF EXISTS gamesofplay;`);
        await pool.query(`DROP TABLE IF EXISTS usersofplay;`);
        await pool.query(`DROP TABLE IF EXISTS plays;`);
        await pool.query(`DROP TABLE IF EXISTS maillink;`);
        await pool.query(`DROP TABLE IF EXISTS refreshtokens;`);
        await pool.query(`DROP TABLE IF EXISTS admins;`);
        await pool.query(`DROP TABLE IF EXISTS masters;`);
        await pool.query(`DROP TABLE IF EXISTS users;`);
        await pool.query(`DROP TABLE IF EXISTS games;`);
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