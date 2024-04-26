import { pool } from "../Repositiories/_getPool";
import { NoticeMessage } from "pg-protocol/dist/messages";
import game from "./game.json";

const SQLaddGame = async () => {
    try {
        const values = [];
        for (let i of game) {
            values.push(["'" + [i.name] + "'", [i.minplayers], [i.maxplayers], [i.mintimeplay], [i.maxtimeplay], [i.hardless], "'" + [i.description] + "'"]);
        }
        await pool.query(`INSERT INTO games(
            name, minplayers, maxplayers, mintimeplay, maxtimeplay, hardless, description)
            VALUES 
            (${values
                .map((val) => {
                    return val.join(", ");
                })
                .join("),\n(")})
            ;`);
        console.log("Игры добавлены");
    } catch (error) {
        const er = error as NoticeMessage;
        Object.keys(er).forEach((element) => {
            console.log(element, ": ", er[element as keyof NoticeMessage]);
        });
        console.log(er);
        if (er.routine == "auth_failed") console.log("Ошибка авторизации");
    }
};

export default SQLaddGame;
