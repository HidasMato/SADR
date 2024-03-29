
import { QueryResult } from 'pg';
import { pool } from '../Services/_getPool';
import { NoticeMessage } from 'pg-protocol/dist/messages';

// Get all tasks
const SQLinit = async () => {
    const askSQL = async (text: string) => {
        try {
            const response: QueryResult = await pool.query(text);
            console.log(`${text.split(" ")[5]}`)
        } catch (error) {
            throw error;
        }
        return 0;
    }
    try {
        await askSQL(`CREATE TABLE IF NOT EXISTS Games 
        (
            id SERIAL,
            name varchar(100) unique NOT NULL,
            minPlayers int default (60) NOT NULL,
            maxPlayers int default (60) NOT NULL,
            minTimePlay int default (60) NOT NULL,
            maxTimePlay int default (60) NOT NULL,
            hardless int NOT NULL CHECK (hardless >0) CHECK (hardless < 4),
            description varchar(1500) default ('Прилетела корова и слизала описа...'),
            img varchar(120) default('empty.png'),
            PRIMARY KEY(id)
        );`);
        await askSQL(`CREATE TABLE IF NOT EXISTS Users 
        (
            id SERIAL,
            nickName varchar(100) unique NOT NULL,
            mail varchar(100) unique NOT NULL,
            mailVeryfity boolean NOT NULL default(False),
            passCache int NOT NULL ,
            img varchar(120) default('empty.png'),
            PRIMARY KEY(id)
        );`);
        await askSQL(`CREATE TABLE IF NOT EXISTS Masters 
        (
            id int,
            userId int unique,
            description varchar(1500) default('Прилетела корова и слизала описа...'),
            PRIMARY KEY(id),
            FOREIGN KEY (userId) REFERENCES Users(id)
        );`);
        await askSQL(`CREATE TABLE IF NOT EXISTS Admins 
        (
            id int PRIMARY KEY,
            FOREIGN KEY (id) REFERENCES Users(id)
        );`);
        await askSQL(`CREATE TABLE IF NOT EXISTS Plays 
        (
            id SERIAL,
            name varchar(100) unique NOT NULL,
            masterId int NOT NULL,
            minPlayers int default (3) NOT NULL,
            maxPlayers int default (5) NOT NULL,
            description varchar(1500) default ('Прилетела корова и слизала описа...'),
            status boolean NOT NULL,
            img varchar(120) default('empty.png'),
            dateStart timestamp with time zone NOT NULL,
            dateEnd timestamp with time zone NOT NULL,
            PRIMARY KEY(id),
            FOREIGN KEY (masterId) REFERENCES Masters(id)
        );`);
        await askSQL(`CREATE TABLE IF NOT EXISTS UsersOfPlay 
        (
            id SERIAL,
            userId int NOT NULL,
            playId int NOT NULL,
            PRIMARY KEY(id),
            FOREIGN KEY (userId) REFERENCES Users(id),
            FOREIGN KEY (playId) REFERENCES Plays(id),
            UNIQUE(userId, playId)
        );`);
        await askSQL(`CREATE TABLE IF NOT EXISTS GamesOfPlay 
        (
            id SERIAL,
            gameId int NOT NULL,
            playId int NOT NULL,
            PRIMARY KEY(id),
            FOREIGN KEY (gameId) REFERENCES Games(id),
            FOREIGN KEY (playId) REFERENCES Plays(id),
            UNIQUE(gameId, playId)
        );`);
        await askSQL(`CREATE TABLE IF NOT EXISTS ReviewsToPlay 
        (
            id SERIAL,
            playId int NOT NULL,
            userId int NOT NULL,
            text varchar(1500) default ('Прилетела корова и слизала описа...'),
            stars int NOT NULL CHECK (stars >0) CHECK (stars < 6),
            date timestamp with time zone NOT NULL default(now()),
            PRIMARY KEY(id),
            FOREIGN KEY (playId) REFERENCES Plays(id),
            FOREIGN KEY (userId) REFERENCES Users(id),
            UNIQUE(userId, playId)
        );`);
        await askSQL(`CREATE TABLE IF NOT EXISTS ReviewsToGame 
        (
            id SERIAL,
            gameId int NOT NULL,
            userId int NOT NULL,
            text varchar(1500) default ('Прилетела корова и слизала описа...'),
            stars int NOT NULL CHECK (stars >0) CHECK (stars < 6),
            date timestamp with time zone NOT NULL default(now()),
            PRIMARY KEY(id),
            FOREIGN KEY (gameId) REFERENCES Games(id),
            FOREIGN KEY (userId) REFERENCES Users(id),
            UNIQUE(userId, gameId)
        );`);
        await askSQL(`CREATE TABLE IF NOT EXISTS ReviewsToMaster 
        (
            id SERIAL,
            masterId int NOT NULL,
            userId int NOT NULL,
            text varchar(1500) default ('Прилетела корова и слизала описа...'),
            stars int NOT NULL CHECK (stars >0) CHECK (stars < 6),
            date timestamp with time zone NOT NULL default(now()),
            PRIMARY KEY(id),
            FOREIGN KEY (masterId) REFERENCES Masters(id),
            FOREIGN KEY (userId) REFERENCES Users(id),
            UNIQUE(userId, masterId)
        );`);
        console.log("База данных проинициализирована!")
    } catch (error) {
        const er = error as NoticeMessage;
        Object.keys(er).forEach(element => {
            console.log(element, ": ", er[element as keyof NoticeMessage]);
        });
        console.log(er)
        if (er.routine == 'auth_failed')
            console.log("Ошибка авторизации")

    }
}

export default SQLinit;