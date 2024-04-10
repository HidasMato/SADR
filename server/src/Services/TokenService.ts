import jwt from 'jsonwebtoken';
import { TOKENS_KEYS } from '../../tokens.json'
import { pool } from './_getPool';
import ApiError from '../Exeptions/ApiError';
class TokenService {
    async generateToken({ payload }: { payload: { id: number, mail: string, nickname: string } }) {
        try {
            const accessToken = jwt.sign(payload, TOKENS_KEYS.SECRET_ACCESS_KEY, { expiresIn: '30m' })
            const refreshToken = jwt.sign(payload, TOKENS_KEYS.SECRET_REFRESH_KEY, { expiresIn: '30d' })
            return { accessToken, refreshToken };
        } catch (error) {
            throw ApiError.BadRequest({ message: "Не удалось сгенерировать токен" })
        }
    }
    async saveToken({ userId, refreshToken }: { userId: number, refreshToken: string }) {
        try {
            //Сейчас можно создать только одну запись токена в таблице
            if ((await pool.query(`SELECT count(userid) as sum FROM refreshtokens WHERE userid = $1;`, [userId])).rows[0].sum == 0) {
                await pool.query(`INSERT INTO refreshtokens (userid, refreshtoken) VALUES ($1, $2);`, [userId, refreshToken])
                return;
            }
            await pool.query(`UPDATE refreshtokens SET refreshtoken = $1 WHERE userid = $2;`, [refreshToken, userId])
            return;
        } catch (error) {
            throw ApiError.BadRequest({ message: "Не удалось сохранить токен" })
        }
    }
    async removeToken({ refreshToken }: { refreshToken: string }) {
        try {
            if ((await pool.query(`SELECT count(*) as sum FROM refreshtokens WHERE refreshtoken = $1;`, [refreshToken])).rows[0].sum == 0) {
                throw ApiError.BadRequest({ message: "Не авторизованы" })
            }
            await pool.query(`DELETE FROM refreshtokens WHERE refreshtoken = $1;`, [refreshToken]);
        } catch (error) {
            throw ApiError.BadRequest({ message: "Не удалось удалить токен" })
        }
    }
    async validateAccessToken({ token }: { token: string }) {
        try {
            return (jwt.verify(token, TOKENS_KEYS.SECRET_ACCESS_KEY, {}) as { mail: string, nickname: string, id: number })
        } catch (error) {
            return undefined;
        }
    }
    async validateRefreshToken({ token }: { token: string }) {
        try {
            return (jwt.verify(token, TOKENS_KEYS.SECRET_REFRESH_KEY, {}) as { mail: string, nickname: string, id: number })
        } catch (error) {
            return undefined;
        }
    }
    async findRefreshToken({ token }: { token: string }) {
        try {
            return ((await pool.query(`SELECT count(*) as sum FROM refreshtokens WHERE refreshtoken = $1;`, [token])).rows[0].sum == 0)
        } catch (error) {
            throw ApiError.BadRequest({ message: "Token error" })
        }
    }
}

export default new TokenService();