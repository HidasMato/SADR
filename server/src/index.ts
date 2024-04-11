import express, { Router, Request, Response } from "express";
import SQLinit from "./SQLInit/SQLinit";
import GameRouter from "./Routers/GameRouter";
import SQLaddGame from "./SQLInit/SQLaddGame";
import SQLdeleteTables from "./SQLInit/SQLdeleteTables";
import SQLaddUsers from "./SQLInit/SQLaddUsers";
import UserRouter from "./Routers/UserRouter";
import fileUpload from 'express-fileupload';
import PlayRouter from "./Routers/PlayRouter";
import SQLaddPlay from "./SQLInit/SQLaddPlay";
import ErrorMiddleWare from "./MiddleWares/ErrorMiddleWare";
import cookieParser from "cookie-parser";
import AuthMiddleWare from "./MiddleWares/AuthMiddleWare";
import LogMiddleWare from "./MiddleWares/LogMiddleWare";
const bodyParser = require('body-parser')
import swaggerUI from 'swagger-ui-express';
import swaggerFile from './Swagger/swagger-output.json';
import cors from "cors";
import { CLIENT_URL } from '../tokens.json'
import SQLaddNext from "./SQLInit/SQLaddNext";



/*
    Дальше находятся чекеры инициализации базы данных
    Для этого должна существовать база, а данные для подключения
    должны быть записаны в файле tokens.json в формате:
    {
        "DATABASE": {
            "USER_NAME": "game_administrator",
            "USER_PASSWORD": "1234567890",
            "BASE_NAME": "SADR",
            "PORT": 5432,
            "HOST": "localhost"
        },
        "TOKENS_KEYS": {
            "SECRET_ACCESS_KEY": "my the most secret access key",
            "SECRET_REFRESH_KEY": "my the most secret refresh key"
        },
        "MAIL_DATA": {
            "HOST": "smtp.yandex.ru",
            "PORT": 465,
            "USER_MAIL": "lubiteli.nastolok@yandex.ru",
            "USER_PASSWORD": "sxdfxpwbdmkqqypt"
        },
        "SERVER_URL": "http://localhost:2052",
        "CLIENT_URL": "http://localhost:2051"
    }
    Тут USER_PASSWORD это не пароль от почты, а спец токен от почты для приложения. В яндексе подключается как все настроки включить smdp или чота так
*/
const deleteTables = false; //Перед инициализацией бд удалить таблицы
const initBd = false; // Инициализировать создание таблиц в базе данных.
const addGame = false; //Добавить в бд предустановленные игры
const addUser = false; //Добавить в бд зарегестрированных пользователе
const addPlay = false; //Добавить в бд предустановленные игротеки
const addNext = false; //Добавить в бд предустановленные игротеки


const app = express();
const PORT = 2052;

app.use(bodyParser.json())
app.use('/api/doc', swaggerUI.serve, swaggerUI.setup(swaggerFile))

app.use(express.json());
app.use(cookieParser());


app.use(cors(
    {
        credentials: true,
        origin: ['http://localhost:2051', CLIENT_URL]
    }
));



app.use(LogMiddleWare)
app.use(AuthMiddleWare)
app.use(fileUpload({}));
app.use(express.static('images'));

// app.use(express.urlencoded({ extended: false }));

app.use('/api/game', GameRouter
    //#swagger.tags = ['game']
);
app.use('/api/user', UserRouter
    //#swagger.tags = ['user']
);
app.use('/api/play', PlayRouter
    //#swagger.tags = ['play']
);

//Обработчик ошибок
app.use(ErrorMiddleWare)


const startApp = async () => {
    try {
        if (deleteTables) await SQLdeleteTables();
        if (initBd) await SQLinit();
        if (addGame) await SQLaddGame();
        if (addUser) await SQLaddUsers();
        if (addPlay) await SQLaddPlay();
        if (addNext) await SQLaddNext();
        app.listen(PORT)
        console.log(`Server start! url: http://localhost:${PORT}/`);
        console.log(`Swagger url: http://localhost:${PORT}/api/doc`);
    } catch (error) {
        console.log(error)
    }
}

startApp();






