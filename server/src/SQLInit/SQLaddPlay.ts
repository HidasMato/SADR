import { pool } from '../Repositiories/_getPool';
import { NoticeMessage } from 'pg-protocol/dist/messages';
import play from './play.json';

const format_mask = "YYYY-MM-DD HH24:MI"

const SQLaddPlay = async () => {
    try {
        const values = [];
        for (let i of play) {
            values.push([
                "'" + [i.name] + "'",
                [i.masterId],
                [i.minplayers],
                [i.maxplayers],
                "'" + [i.description] + "'",
                [i.status],
                [`to_timestamp( '${i.datestart}', '${format_mask}' )`],
                [`to_timestamp( '${i.dateend}', '${format_mask}' )`]
            ])
        }
        await pool.query(`INSERT INTO plays(
            name, masterId, minplayers, maxplayers, description, status, datestart, dateend)
            VALUES 
            (${values.map((val) => { return val.join(', ') }).join('),\n(')})
            ;`);
        console.log("Игротеки добавлены")
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

export default SQLaddPlay;