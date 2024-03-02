
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from './database';

const getAllGame = async (req: Request, res: Response): Promise<Response> => {
    try {
        const start = req.body.start;
        const count = req.body.count;
        if (isNaN(start) || isNaN(count))
            if (isNaN(start))
                return res.status(401).json({ message: "Неправильное значение параметра start" });
            else
                return res.status(402).json({ message: "Неправильное значение параметра count" });
        const response: QueryResult = await pool.query(`SELECT * FROM games LIMIT $1 OFFSET $2;`, [count, start]);
        if (response.rows.length == 0)
            return res.status(403).json({ message: "В базе данных больше нет игр" });
        return res.status(200).json(response.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Ошибка выборки');
    }
}

export default getAllGame;