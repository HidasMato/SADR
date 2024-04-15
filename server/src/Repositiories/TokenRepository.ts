import { pool } from './_getPool';
class TokenRepository {
    async getSumRefreshTokens({ userId }: { userId: number }): Promise<number> {
        return ((await pool.query(`SELECT count(userid) as sum FROM refreshtokens WHERE userid = $1;`, [userId])).rows[0].sum as number)
    }
    async isExistsRefreshToken({ refreshToken }: { refreshToken: string }): Promise<boolean> {
        return (await pool.query(`SELECT userid FROM refreshtokens WHERE refreshtoken = $1;`, [refreshToken])).rowCount as number > 0;
    }
    async removeFirstToken({ userId }: { userId: number }): Promise<boolean> {
        return (await pool.query(`DELETE FROM refreshtokens WHERE id = (SELECT id FROM refreshtokens WHERE userid = $1 LIMIT 1)`, [userId])).rowCount as number > 0
    }
    async addToken({ userId, hash, refreshtoken }: { userId: number, hash: string, refreshtoken: string }): Promise<boolean> {
        return (await pool.query(`INSERT INTO refreshtokens (userid, refreshtoken, fingerprint) VALUES ($1, $2, $3)`, [userId, refreshtoken, hash])).rowCount as number > 0
    }
    async removeToken({ refreshToken }: { refreshToken: string }):Promise<boolean> {
        return (await pool.query(`DELETE FROM refreshtokens WHERE refreshtoken = $1;`, [refreshToken])).rowCount as number > 0;
    }
}

export default new TokenRepository();