import { Request, Response } from 'express';
import { pool } from './database';
import { NoticeMessage } from 'pg-protocol/dist/messages';
import { QueryResult } from 'pg';

const postGameCreate = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, minplayers, maxplayers, mintimeplay, maxtimeplay, hardless, description, img } = req.body;
        const result: QueryResult = await pool.query(`INSERT INTO games(
            name, minplayers, maxplayers, mintimeplay, maxtimeplay, hardless, description, img)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;`, [name, minplayers, maxplayers, mintimeplay, maxtimeplay, hardless, description, img]);
        if (result?.rows?.length != 0)
            return res.status(201).json({
                redirectionId: result.rows[0]
            });
        else
            return res.status(401).json({
                message: "Нет возвращенного id"
            });
    } catch (error) {
        const { detail, code } = error as NoticeMessage;
        return res.status(401).json({
            message: detail,
            code: code
        });
    }
};

export default postGameCreate;