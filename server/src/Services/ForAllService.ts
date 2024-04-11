
import { pool } from './_getPool';
class ForAllService {
    async isExists({ id, tableName }: { id: number, tableName: string }) {
        return (await pool.query(`SELECT (SELECT count(*) FROM ${tableName} WHERE id = $1) > 0 as bol`, [id])).rows[0].bol;
    }
}

export default new ForAllService();