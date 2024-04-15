import jwt from 'jsonwebtoken';
import { TOKENS_KEYS } from '../../tokens.json'
import { pool } from '../Repositiories/_getPool';
import ApiError from '../Exeptions/ApiError';
import { MAX_SESSIONS } from '../../tokens.json'
import TokenRepository from '../Repositiories/TokenRepository';
class TokenService {
    async generateToken({ payload }: { payload: { id: number, mail: string, nickname: string } }) {
        try {
            const accessToken = jwt.sign(payload, TOKENS_KEYS.SECRET_ACCESS_KEY, { expiresIn: '30m' })
            const refreshToken = jwt.sign(payload, TOKENS_KEYS.SECRET_REFRESH_KEY, { expiresIn: '30d' })
            return { accessToken, refreshToken };
        } catch (error) {
            console.log(error)
            throw ApiError.BadRequest({ message: "Не удалось сгенерировать токен" })
        }
    }
    async saveToken({ userId, refreshToken, hash }: { userId: number, refreshToken: string, hash: string }): Promise<boolean | undefined> {
        try {
            if ((await TokenRepository.getSumRefreshTokens({ userId: userId })) == MAX_SESSIONS) {
                await TokenRepository.removeFirstToken({ userId: userId });
            }
            return await TokenRepository.addToken({ userId: userId, hash: hash, refreshtoken: refreshToken });
        } catch (error) {
            console.log(error)
            if (!(error instanceof ApiError))
                throw ApiError.BadRequest({ message: "Не удалось сохранить токен" })
        }
    }
    async removeToken({ refreshToken }: { refreshToken: string }): Promise<boolean | undefined> {
        try {
            if (!(await TokenRepository.isExistsRefreshToken({ refreshToken: refreshToken }))) {
                throw ApiError.BadRequest({ message: "Не авторизованы" })
            }
            return (await TokenRepository.removeToken({ refreshToken: refreshToken }));
        } catch (error) {
            console.log(error)
            if (!(error instanceof ApiError))
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
}

export default new TokenService();