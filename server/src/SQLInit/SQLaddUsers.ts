
import { QueryResult } from 'pg';
import { pool } from '../Services/_getPool';
import { NoticeMessage } from 'pg-protocol/dist/messages';
import user from './user.json';

// 525 - "1234567890"
// 1129 - "qwertyuiop"
// 785 - "SupForMe"
// 1056 - "AbraKedabra"

const SQLaddUsers = async () => {
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
        for (let i of user) {
            values.push([
                "'" + [i.nickName] + "'",
                "'" + [i.mail] + "'",
                [i.mailVeryfity],
                [i.passCache],
                "'" + [i.img] + "'"
            ])
        }
        await askSQL(`INSERT INTO users(
            nickName, mail, mailVeryfity, passCache, img)
            VALUES 
            (${values.map((val) => { return val.join(', ') }).join('),\n(')})
            ;`);
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