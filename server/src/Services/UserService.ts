
import { QueryResult } from 'pg';
import { pool } from './_getPool';
import SendMessage from './SendMessage';
import bcrypt from 'bcrypt';
import TokenService from './TokenService';
import ApiError from '../Exeptions/ApiError';
import ForAllService from './ForAllService';
type getList = {
    settingList: {
        start: number,
        count: number
    },
    filter: {},
    MODE: "sequrity" | "forAll"
}
type UserToCookie = {
    mail: string,
    nickname: string,
    id: number,
    mailveryfity: boolean,
    role: {
        user: boolean,
        master: boolean,
        admin: boolean
    }
};
class UserService {
    static createDateAsUTC() {
        const date = new Date()
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
    }
    static async getCache(pass: string) { return await bcrypt.hash(pass, 3); }
    //FIXME: Нормальная проверка почты
    static getTrueMail(mail: string): void {
        if (mail.length == 0)
            throw ApiError.BadRequest({ message: "Пустое поле почты" })
        if (mail.indexOf('@') <= 0 || mail.indexOf('@') === mail.length - 1)
            throw ApiError.BadRequest({ message: "Неверный формат почты" })
    }
    //FIXME: Нормальная проверка пароля
    static getTruePass(pass: string): void {
        if (pass.length < 8 || pass.length > 40)
            throw ApiError.BadRequest({ message: "Неверная длина пароля" })
        for (let symbol of pass.split('')) {
            //Спецсимволы
            if ("_@#$$%^&?.,".indexOf(symbol) == -1 && (symbol < 'a' || symbol > 'z') && (symbol < 'A' || symbol > 'Z') && (symbol < '0' || symbol > '9'))
                throw ApiError.BadRequest({ message: "Неверные символы в пароле" })
        }
    }
    //FIXME: Нормальная проверка ника
    static getTrueNickName(nickname: string): void {
        if (nickname.length < 4 || nickname.length > 40)
            throw ApiError.BadRequest({ message: "Неверная длина никнема" })
        for (let symbol of nickname.split('')) {
            //Спецсимволы
            if ("_@#$$%^&?.,".indexOf(symbol) == -1 && (symbol < '0' || symbol > '9') && symbol.toLowerCase() == symbol.toUpperCase())
                throw ApiError.BadRequest({ message: "Неверные символы в никнейме" })
        }
    }
    static getMasMode(MODE: "sequrity" | "forAll") {
        let mas = ['id'];
        //TODO: Добавить получение роли
        switch (MODE) {
            case "sequrity": {
                mas = mas.concat(['nickname', 'mail', 'mailVeryfity'])
                break;
            }
            case "forAll": {
                mas = mas.concat(['nickname'])
                break;
            }
        }
        return mas;
    }
    async getUserInfoById({ id, MODE }: { id: number, MODE: "sequrity" | "forAll" }) {
        const res: QueryResult = await pool.query(`SELECT ${UserService.getMasMode(MODE).join(', ')} FROM users WHERE id = $1`, [id]);
        if (res.rows.length == 0)
            throw ApiError.BadRequest({ status: 470, message: "Пользователя не существует" })
        return res.rows[0];
    }
    async getUserRole({ id }: { id: number }) {
        const role = {
            user: false,
            master: false,
            admin: false
        }
        if ((await pool.query(`SELECT (SELECT count(*) FROM users WHERE id = $1) > 0 as bol`, [id])).rows[0].bol) {
            role.user = true;
            if ((await pool.query(`SELECT (SELECT count(*) FROM masters WHERE id = $1) > 0 as bol`, [id])).rows[0].bol)
                role.master = true;
            if ((await pool.query(`SELECT (SELECT count(*) FROM admins WHERE id = $1) > 0 as bol`, [id])).rows[0].bol)
                role.admin = true;
            return role;
        }
        return role
    }
    async getUserList({ settingList, filter, MODE }: getList) {
        //TODO: реализовать фильт поиска
        const res: QueryResult = await pool.query(`SELECT ${UserService.getMasMode(MODE).join(', ')} FROM users LIMIT $1 OFFSET $2;`, [settingList.count, settingList.start]);
        return res.rows;
    }
    async changePass({ id, mail, pass }: { id: number, mail: string, pass: string }) {
        UserService.getTrueMail(mail)
        UserService.getTruePass(pass)
        SendMessage.notification({ text: "Пароль был изменен", mail: mail })
        const res: QueryResult = await pool.query(`UPDATE users SET passCache = $1 WHERE mail = $2 AND id = $3;`, [await UserService.getCache(pass), mail, id]);
        if (res.rowCount == 0)
            throw ApiError.BadRequest({ status: 470, message: "Пользователя не существует" })
    }
    async changeNickName({ id, mail, nickname }: { id: number, mail: string, nickname: string }) {
        UserService.getTrueMail(mail)
        UserService.getTrueNickName(nickname)
        SendMessage.notification({ text: "Никнейм был изменен", mail: mail })
        const res: QueryResult = await pool.query(`UPDATE users SET nickname = $1 WHERE mail = $2 AND id = $3;`, [nickname, mail, id]);
        if (res.rowCount == 0)
            throw ApiError.BadRequest({ status: 470, message: "Пользователя не существует" })

    }
    async changeRole({ id, role, mail }: { mail: string, id: number, role: string }) {
        UserService.getTrueMail(mail);
        let res: QueryResult;
        if (! await ForAllService.isExists({ id: id, tableName: 'users' })) throw ApiError.BadRequest({ status: 470, message: "Пользователя не существует" })
        switch (role) {
            case "user":
                res = await pool.query(`SELECT active FROM masters WHERE id = $1`, [id]);
                if (res?.rowCount == 0)
                    throw ApiError.BadRequest({ message: "Пользователь не был мастером" })
                else if (res.rows[0].active == false)
                    throw ApiError.BadRequest({ message: "Пользователь уже был расформирован" })
                else {
                    await pool.query(`UPDATE masters SET active = False WHERE id = $1;`, [id]);
                    SendMessage.notification({ text: "Ваша роль была понижена до игрока", mail: mail })
                }
                break;
            case "master":
                res = await pool.query(`SELECT active FROM masters WHERE id = $1`, [id]);
                if (res?.rowCount == 0) {
                    await pool.query(`INSERT INTO masters (id) VALUES ($1);`, [id])
                    SendMessage.notification({ text: "Вам была дарована роль мастера", mail: mail })
                } else if (res.rows[0].active == false) {
                    await pool.query(`UPDATE masters SET active = True WHERE id = $1 ;`, [id]);
                    SendMessage.notification({ text: "Вам была возвращена роль мастера", mail: mail })
                } else
                    throw ApiError.BadRequest({ message: "Пользователь уже мастер" })
                break;
        }
    }
    async changeDescription({ id, description, mail }: { mail: string, id: number, description: string }) {
        UserService.getTrueMail(mail);
        let res: QueryResult = await pool.query(`UPDATE masters SET description = $2 WHERE id = $1`, [id, description]);
        if (res.rowCount == 0)
            throw ApiError.BadRequest({ status: 473, message: "Мастера не существует" })
    }
    async changeMail({ id, mail }: { id: number, mail: string }) {
        UserService.getTrueMail(mail)
        SendMessage.sendMailAccess({ type: "changemail", mail: mail, userid: id })
        const res: QueryResult = await pool.query(`UPDATE users SET mail = $1 WHERE  id = $2;`, [mail, id]);
        if (res.rowCount == 0)
            throw ApiError.BadRequest({ status: 470, message: "Пользователя не существует" })
    }
    async activateLink({ link }: { link: string }) {
        const res: QueryResult = await pool.query(`SELECT userid, dateend, mail FROM maillink WHERE link = $1;`, [link]);
        if (res.rows.length == 0)
            throw ApiError.BadRequest({ message: "Время действия ссылки истекло" })
        if (res.rows[0].dateend < UserService.createDateAsUTC()) {
            await pool.query(`DELETE FROM maillink WHERE userid = $1;`, [res.rows[0].userid]);
            throw ApiError.BadRequest({ message: "Время действия ссылки истекло" })
        }
        await pool.query(`DELETE FROM maillink WHERE userid = $1;`, [res.rows[0].userid]);
        await pool.query(`UPDATE users SET mail = $2, mailveryfity = true WHERE id = $1`, [res.rows[0].userid, res.rows[0].mail]);
    }
    async registration({ mail, nickname, pass }: { mail: string, nickname: string, pass: string }) {
        UserService.getTrueMail(mail)
        if ((await pool.query(`SELECT count(id) as sum FROM users WHERE mail = $1`, [mail])).rows[0].sum != 0)
            throw ApiError.BadRequest({ message: 'Почта уже использована' });
        UserService.getTrueNickName(nickname)
        if ((await pool.query(`SELECT count(id) as sum FROM users WHERE nickname = $1`, [nickname])).rows[0].sum != 0)
            throw ApiError.BadRequest({ message: 'Никнейм уже использована' });
        UserService.getTruePass(pass)
        const id = (await pool.query(`INSERT INTO users(mail, passCache, nickname) VALUES ($1, $2, $3) RETURNING id;`, [mail, await UserService.getCache(pass), nickname])).rows?.[0]?.id;
        await SendMessage.sendMailAccess({ type: 'registration', mail: mail, userid: id });
        return await this.getNewToken({id:id})
    }
    async login({ mail, pass }: { mail: string, pass: string }) {
        UserService.getTrueMail(mail)
        UserService.getTruePass(pass)
        const res: QueryResult = await pool.query(`SELECT passCache, id, nickname FROM users WHERE mail = $1`, [mail]);
        if (res.rows.length == 0)
            throw ApiError.BadRequest({ message: "Почты не существует" })
        if (!(await bcrypt.compare(pass, res.rows[0].passcache)))
            throw ApiError.BadRequest({ message: "Неверный пароль" })
        return await this.getNewToken({id:res.rows[0].id})
    }
    async logout({ refreshToken }: { refreshToken: string }) {
        await TokenService.removeToken({ refreshToken })
    }
    async refresh({ oldRefreshToken }: { oldRefreshToken: string }) {
        if (!oldRefreshToken) {
            await TokenService.removeToken({ refreshToken: oldRefreshToken })
            throw ApiError.UnavtorisationError()
        }
        const user = await TokenService.validateRefreshToken({ token: oldRefreshToken })
        const rows = (await pool.query(`SELECT refreshtoken FROM refreshtokens WHERE userid = $1`, [user?.id])).rows;
        if (!user || rows.length == 0 || rows[0].refreshtoken != oldRefreshToken) {
            await TokenService.removeToken({ refreshToken: oldRefreshToken })
            throw ApiError.UnavtorisationError()
        }
        return await this.getNewToken({id:user.id})
    }
    async getNewToken({ id }: { id: number }) {
        
        const newUser = (await (new UserService).getUserInfoById({ id: id, MODE: "sequrity" })) as UserToCookie
        const tokens = await TokenService.generateToken({ payload: { id: newUser.id, mail: newUser.mail, nickname: newUser.nickname } })
        await TokenService.saveToken({ userId: newUser.id, refreshToken: tokens.refreshToken })
        newUser.role = await this.getUserRole({id:newUser.id})
        return {
            user: newUser,
            tokens: tokens
        };
    }
}

export default new UserService();