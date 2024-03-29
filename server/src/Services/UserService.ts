
import { QueryResult } from 'pg';
import { pool } from './_getPool';

export enum TypesMode {
    SEQURITY = 1,
    FORALL = 2
}

class UserService {
    //FIXME: Нормальная функция кеша
    getCache(pass: string): number {
        let cache = 0;
        for (let i of pass.split(''))
            cache += i.charCodeAt(0);
        return cache;
    }
    //FIXME: Нормальная проверка почты
    getTrueMail(mail: string): void {
        if (mail.length == 0)
            throw new Error("Пустое поле почты")
        if (mail.indexOf('@') <= 0 || mail.indexOf('@') === mail.length - 1)
            throw new Error("Неверный формат почты")
    }
    //FIXME: Нормальная проверка пароля
    getTruePass(pass: string): void {
        if (pass.length < 8 || pass.length > 40)
            throw new Error("Неверная длина пароля")
        for (let symbol of pass.split('')) {
            //Спецсимволы
            if ("_@#$$%^&?.,".indexOf(symbol) == -1 && (symbol < 'a' || symbol > 'z') && (symbol < 'A' || symbol > 'Z') && (symbol < '0' || symbol > '9'))
                throw new Error("Неверные символы в пароле")
        }
    }
    //FIXME: Нормальная проверка ника
    getTrueNickName(nickName: string): void {
        if (nickName.length < 4 || nickName.length > 40)
            throw new Error("Неверная длина никнема")
        for (let symbol of nickName.split('')) {
            //Спецсимволы
            if ("_@#$$%^&?.,".indexOf(symbol) == -1 && (symbol < '0' || symbol > '9') && symbol.toLowerCase() == symbol.toUpperCase())
                throw new Error("Неверные символы в никнейме")
        }
    }
    async getUserInfoById({ id, MODE }: { id: number, MODE: TypesMode }): Promise<Object> {
        if (isNaN(id)) throw new Error("Некорректное значение id")
        let mas = ['id'];
        switch (MODE) {
            case TypesMode.SEQURITY: {
                mas = mas.concat(['nickName', 'mail', 'img', 'mailVeryfity'])
                break;
            }
            case TypesMode.FORALL: {
                mas = mas.concat(['nickName', 'img'])
                break;
            }
        }
        const res: QueryResult = await pool.query(`SELECT ${mas.join(', ')} FROM users WHERE id = $1`, [id]);
        if (res.rows.length == 0)
            throw new Error("Пользователя не существует")
        return res.rows[0];
    }
    async checkUserAuthByMail({ mail, pass }: { mail: string, pass: string }): Promise<number> {
        this.getTrueMail(mail)
        this.getTruePass(pass)
        const res: QueryResult = await pool.query(`SELECT passCache, id FROM users WHERE mail = $1`, [mail]);
        if (res.rows.length == 0)
            throw new Error("Почты не существует")
        if (this.getCache(pass) != res.rows[0].passCache)
            throw new Error("Неверный пароль")
        return res.rows[0].id;
    }
    async createUser({ mail, nickName, pass }: { mail: string, nickName: string, pass: string }): Promise<number> {
        this.getTrueMail(mail)
        this.getTruePass(pass)
        this.getTrueNickName(nickName)
        //TODO: Отправка на почту сообщения
        const res: QueryResult = await pool.query(`INSERT INTO users(mail, passCache, nickName) VALUES ($1, $2, $3) RETURNING id;`, [mail, this.getCache(pass), nickName]);
        return res.rows?.[0]?.id;
    }
    async changePass({ id, mail, pass }: { id: number, mail: string, pass: string }): Promise<void> {
        this.getTrueMail(mail)
        this.getTruePass(pass)
        //TODO: Отправка на почту сообщения
        const res: QueryResult = await pool.query(`UPDATE users SET passCache = $1 WHERE mail = $2 AND id = $3;`, [this.getCache(pass), mail, id]);
        if (res.rowCount == 0)
            throw new Error("Пользователь не существует")
    }
    async changeNickName({ id, mail, nickName }: { id: number, mail: string, nickName: string }): Promise<void> {
        this.getTrueMail(mail)
        this.getTrueNickName(nickName)
        //TODO: Отправка на почту сообщения
        const res: QueryResult = await pool.query(`UPDATE users SET nickName = $1 WHERE mail = $2 AND id = $3;`, [nickName, mail, id]);
        if (res.rowCount == 0)
            throw new Error("Пользователь не существует")
    }
    async changeRole({ id, mail, role }: { id: number, mail: string, role: string }): Promise<void> {
        this.getTrueMail(mail)
        let res: QueryResult;
        //TODO: Отправка на почту сообщения
        // switch (role) {
        //     case "user":
        //         res = await pool.query(`UPDATE users SET nickName = $1 WHERE mail = $2 AND id = $3;`, [nickName, mail, id]);
        //         if (res?.rowCount == 0)
        //             throw new Error("Пользователь не существует")
        //         break;
        //     case "master":
        //         res = await pool.query(`UPDATE users SET nickName = $1 WHERE mail = $2 AND id = $3;`, [nickName, mail, id]);
        //         if (res?.rowCount == 0)
        //             throw new Error("Пользователь не существует")
        //         break;
        // }
    }
    async changeMail({ id, mail }: { id: number, mail: string }): Promise<void> {
        this.getTrueMail(mail)
        //TODO: Отправка на почту сообщения
        const res: QueryResult = await pool.query(`UPDATE users SET mail = $1 WHERE  id = $2;`, [mail, id]);
        if (res.rowCount == 0)
            throw new Error("Пользователь не существует")
    }
}

export default new UserService;