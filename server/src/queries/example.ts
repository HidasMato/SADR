// Import necessary types from Express
import { Request, Response } from 'express';
import { QueryResult } from 'pg';
// Import the PostgreSQL connection pool from database.ts
import { pool } from './database';

// Controller for a new task
export const createTask = async (req: Request, res: Response): Promise<Response> => {
    // Extract task details from the request body
    //(title, description, completed)
    const { title, description, completed } = req.body;
    // Execute a SQL INSERT statement
    await pool.query('INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3)', [title, description, completed]);
    // Send a JSON response to the client
    return res.status(201).json({
        // Task Created successfully
        message: 'Task created successfully',
        task: {
            title,
            description,
            completed,
        }
    });
};

// Get all tasks
export const getTasks = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Execute a PostgreSQL query to select all tasks
        const response: QueryResult = await pool.query('SELECT * FROM tasks');

        // Return a JSON response with the retrieved tasks
        return res.status(200).json(response.rows);
    } catch (error) {
        // Handle errors, log them, and return an internal server error response
        console.error(error);
        return res.status(500).json('Internal Server error');
    }
}

// Get a task by ID
export const getTaskById = async (req: Request, res: Response): Promise<Response> => {
    // Extract the task ID from the request parameters
    const id = parseInt(req.params.id);

    try {
        // Execute a PostgreSQL query to select a task by ID
        const response: QueryResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

        // Return a JSON response with the retrieved task
        return res.json(response.rows);
    } catch (error) {
        // Handle errors, log them, and return an internal server error response
        console.error(error);
        return res.status(500).json('Internal Server error');
    }
}
// Update a task by ID
export const updateTask = async (req: Request, res: Response): Promise<Response> => {
    // Extract task ID from request parameters
    const id = parseInt(req.params.id);

    // Extract updated task details from request body
    const { title, description, completed } = req.body;

    try {
        // Execute a PostgreSQL query to update the task by ID
        await pool.query('UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4', [title, description, completed, id]);

        // Return a JSON response with the updated task details
        return res.json({
            message: 'Task updated successfully',
            task: {
                id,
                title,
                description,
                completed,
            },
        });
    } catch (error) {

        console.error(error);
        return res.status(500).json('Internal Server error');
    }
}

// Delete a task by ID
export const deleteTask = async (req: Request, res: Response): Promise<Response> => {
    // Extract task ID from request parameters
    const id = parseInt(req.params.id);

    try {
        // Execute a PostgreSQL query to delete the task by ID
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);

        // Return a JSON response indicating successful deletion
        return res.status(200).json(`Task ${id} deleted successfully`);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Internal Server error');
    }
}


// app.get("/", (req: any, res: any) => {
//     res.status(200).json("OK!");
// })
// //Покласть в игру что-то
// app.post('/bag/:id/post', async (req: Request, res: Response) => {
//     try {
//         console.log(req.query)
//         console.log("params", req.params)
//         console.log("body", req.body) //в теле запроса
//         console.log("query", req.query) //в строке
//         console.log(Object.keys(req.body)) // что есть в теле

//         res.status(200).json({

//         });
//     } catch (error) {
//         res.status(500).json(error);
//     }
// })
// app.get('/bag/:id/get', async (req: Request, res: Response) => {
//     if (req.params["id"] == undefined) {
//         res.status(407).json(`Не указан id игры`);
//         return 0;
//     }
//     const id = Number(req.params["id"]);
//     if (Number.isNaN(id)) {
//         res.status(408).json(`id игры указан неверно`);
//         return 0;
//     }
//     // let sqlRes = await askMySQL(pool, `SELECT * FROM Games WHERE id = ${id};`, 'get game/get_info');
//     // if (sqlRes == -1) res.status(408).json(`id игры указан неверно`);
//     // if (sqlRes.length == 0) res.status(409).json(`Нет игры с id = ${id}`);
//     // else res.status(200).json({ "sqlRes": sqlRes[0] });
//     res.status(200).json({ "sqlRes": 1 });
// })
