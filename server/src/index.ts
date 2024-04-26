import express from "express";
import SQLinit from "./SQLInit/SQLinit";
import GameRouter from "./Routers/GameRouter";
import SQLaddGame from "./SQLInit/SQLaddGame";
import SQLdeleteTables from "./SQLInit/SQLdeleteTables";
import SQLaddUsers from "./SQLInit/SQLaddUsers";
import UserRouter from "./Routers/UserRouter";
import fileUpload from "express-fileupload";
import PlayRouter from "./Routers/PlayRouter";
import SQLaddPlay from "./SQLInit/SQLaddPlay";
import ErrorMiddleWare from "./MiddleWares/ErrorMiddleWare";
import cookieParser from "cookie-parser";
import AuthMiddleWare from "./MiddleWares/AuthMiddleWare";
import LogMiddleWare from "./MiddleWares/LogMiddleWare";
const bodyParser = require("body-parser");
import swaggerUI from "swagger-ui-express";
import swaggerFile from "./Swagger/swagger-output.json";
import cors from "cors";
import { CLIENT_URL, DATABASE_SCRYPTS } from "../tokens.json";
import SQLaddNext from "./SQLInit/SQLaddNext";
const Fingerprint = require("express-fingerprint");

const app = express();
const PORT = 2052;

app.use(bodyParser.json());
app.use("/api/doc", swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:2051", CLIENT_URL],
    }),
);

app.use(
    Fingerprint({
        parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders, Fingerprint.geoip],
    }),
);

app.use(LogMiddleWare);
app.use(AuthMiddleWare);
app.use(fileUpload({}));
app.use(express.static("images"));

// app.use(express.urlencoded({ extended: false }));

app.use(
    "/api/game",
    GameRouter,
    //#swagger.tags = ['game']
);
app.use(
    "/api/user",
    UserRouter,
    //#swagger.tags = ['user']
);
app.use(
    "/api/play",
    PlayRouter,
    //#swagger.tags = ['play']
);

app.use(ErrorMiddleWare);

const startApp = async () => {
    try {
        if (DATABASE_SCRYPTS.CREATE) await SQLdeleteTables();
        if (DATABASE_SCRYPTS.CREATE) await SQLinit();
        if (DATABASE_SCRYPTS.ADD_GAMES) await SQLaddGame();
        if (DATABASE_SCRYPTS.ADD_USERS) await SQLaddUsers();
        if (DATABASE_SCRYPTS.ADD_PLAYS) await SQLaddPlay();
        if (DATABASE_SCRYPTS.ADD_NEXT) await SQLaddNext();
        app.listen(PORT);
        console.log(`Server start! url: http://localhost:${PORT}/`);
        console.log(`Swagger url: http://localhost:${PORT}/api/doc`);
    } catch (error) {
        console.log(error);
    }
};

startApp();
