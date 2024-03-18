import express, { Router, Request, Response } from "express";
import getGameInfo from "./queries/getGameInfo";
import SQLinit from "./queries/SQLinit";
import postGameCreate from "./queries/postGameCreate";
import getAllGame from "./queries/getAllGame";

const PORT = 2052;
const app = express();
const taskRouter = Router();

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

//Добавить сюда свои функции
taskRouter.get('/game/getInfo/:id', getGameInfo);
taskRouter.post('/game/create', postGameCreate);
taskRouter.get('/game/getAll', getAllGame);
// taskRouter.get('/tasks/:id', getTaskById);
// taskRouter.post('/tasks', createTask);
// taskRouter.put('/tasks/:id', deleteTask);
// taskRouter.delete('/tasks/:id', updateTask);


app.use(taskRouter);

//Включить если надо проиницализировать
//SQLinit();

app.listen(PORT, () => {
    console.log("Server start!");
})






