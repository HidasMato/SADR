import { pool } from '../Services/_getPool';
import { NoticeMessage } from 'pg-protocol/dist/messages';
import user from './user.json';
import {hash} from 'bcrypt';
const SQLaddUsers = async () => {
    try {
        const values = [];
        for (let i of user) {
            values.push([
                "'" + [i.nickname] + "'",
                "'" + [i.mail] + "'",
                [i.mailVeryfity],
                "'" + [await hash(i.pass, 3)] + "'"
            ])
        }
        const res = await pool.query(`INSERT INTO users(nickname, mail, mailVeryfity, passCache) VALUES (${values.map((val) => { return val.join(', '); }).join('),\n(')}) RETURNING id`);
        for (let i = 0; i < 2 && i < res.rows.length; i++)
            await pool.query(`INSERT INTO masters (id, description, active) VALUES ($1, $2, $3);`, [res.rows[i].id, `Мастер инициализации`, true])
        if (res.rows.length >= 3)
            await pool.query(`INSERT INTO masters (id, description, active) VALUES ($1, $2, $3);`, [res.rows[2].id, `Мастер инициализации`, false])
        console.log("Пользователи добавлены")
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

export default SQLaddUsers;