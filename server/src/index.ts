import express, { Router, Request, Response } from "express";
import SQLinit from "./SQLInit/SQLinit";
import GameRouter from "./Routers/GameRouter";
import SQLaddGame from "./SQLInit/SQLaddGame";
import SQLdeleteTables from "./SQLInit/SQLdeleteTables";
import SQLaddUsers from "./SQLInit/SQLaddUsers";
import UserRouter from "./Routers/UserRouter";

// Дальше находятся чекеры инициализации базы данных
// Для этого должна существовать база, а данные для подключения
// должны быть записаны в файле tokens.json в формате:
// {
//     "name": "Имя пользователя бд",
//     "pass": "Пароль пользователя бд",
//     "bd": "Имя бд",
//     "port": порт на котором работает PostgresSQL по умолчанию 5432,
//     "host": "название хоста" свой порт на пк работает по localhost
// }

const deleteTables = false; //Перед инициализацией бд удалить таблицы
const initBd = false; // Инициализировать создание таблиц в базе данных.
const addGame = false; //Добавить в бд предустановленные игры
const addUser = false; //Добавить в бд зарегестрированных пользователе


const app = express();
const PORT = 2052;


app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use('/api/game', GameRouter);
app.use('/api/user', UserRouter);


const startApp = async () => {
    try {
        if (deleteTables) await SQLdeleteTables();
        if (initBd) await SQLinit();
        if (addGame) await SQLaddGame();
        if (addUser) await SQLaddUsers();
        app.listen(PORT, () => { console.log(`Server start! url: http://localhost:${PORT}/`); })
    } catch (error) {
        console.log(error)
    }
}

startApp();






