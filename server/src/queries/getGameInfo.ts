
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from './database';

const getGameInfo = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(401).json({ message: "Неправильное значение id" });
        const response: QueryResult = await pool.query(`SELECT * FROM games WHERE id = $1`, [id]);
        if (response.rows.length == 0)
            return res.status(402).json({ message: "Нет такого id в базе" });
        return res.status(200).json(response.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Ошибка выборки');
    }
}

export default getGameInfo;