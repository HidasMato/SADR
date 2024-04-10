import { pool } from '../Services/_getPool';
import { NoticeMessage } from 'pg-protocol/dist/messages';

// Get all tasks
const SQLinit = async () => {
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS games 
        (
            id SERIAL,
            name varchar(100) unique NOT NULL,
            minplayers int default (60) NOT NULL,
            maxplayers int default (60) NOT NULL,
            mintimeplay int default (60) NOT NULL,
            maxtimeplay int default (60) NOT NULL,
            hardless int default (1) NOT NULL CHECK (hardless >0) CHECK (hardless < 4),
            description varchar(1500) default ('Прилетела корова и слизала описа...'),
            PRIMARY KEY(id)
        );`);
        await pool.query(`CREATE TABLE IF NOT EXISTS users 
        (
            id SERIAL,
            nickname varchar(100) unique NOT NULL,
            mail varchar(100) unique NOT NULL,
            mailVeryfity boolean NOT NULL default(False),
            passCache varchar(1000) NOT NULL ,
            PRIMARY KEY(id)
        );`);
        await pool.query(`CREATE TABLE IF NOT EXISTS maillink 
        (
            userid int unique,
            mail varchar(100) unique NOT NULL,
            link varchar(100) unique NOT NULL,
            dateend timestamp with time zone NOT NULL,
            PRIMARY KEY(userid),
            FOREIGN KEY (userid) REFERENCES users(id)
        );`);
        await pool.query(`CREATE TABLE IF NOT EXISTS refreshtokens 
        (
            userid int unique,
            refreshtoken varchar(1000) unique NOT NULL,
            PRIMARY KEY(userid),
            FOREIGN KEY (userid) REFERENCES users(id)
        );`);
        await pool.query(`CREATE TABLE IF NOT EXISTS masters 
        (
            id int unique,
            description varchar(1500) default('Прилетела корова и слизала описа...'),
            active boolean NOT NULL default(True),
            PRIMARY KEY(id),
            FOREIGN KEY (id) REFERENCES users(id)
        );`);
        await pool.query(`CREATE TABLE IF NOT EXISTS admins 
        (
            id int PRIMARY KEY,
            FOREIGN KEY (id) REFERENCES users(id)
        );`);
        await pool.query(`CREATE TABLE IF NOT EXISTS plays 
        (
            id SERIAL,
            name varchar(100) NOT NULL,
            masterid int NOT NULL,
            minplayers int default (3) NOT NULL,
            maxplayers int default (5) NOT NULL,
            description varchar(1500) default ('Прилетела корова и слизала описа...'),
            status boolean NOT NULL,
            datestart timestamp with time zone NOT NULL,
            dateend timestamp with time zone NOT NULL,
            PRIMARY KEY(id),
            FOREIGN KEY (masterid) REFERENCES masters(id)
        );`);
        await pool.query(`CREATE TABLE IF NOT EXISTS usersofplay 
        (
            id SERIAL,
            userid int NOT NULL,
            playid int NOT NULL,
            PRIMARY KEY(id),
            FOREIGN KEY (userid) REFERENCES users(id),
            FOREIGN KEY (playid) REFERENCES plays(id),
            UNIQUE(userid, playid)
        );`);
        await pool.query(`CREATE TABLE IF NOT EXISTS gamesofplay 
        (
            id SERIAL,
            gameid int NOT NULL,
            playid int NOT NULL,
            PRIMARY KEY(id),
            FOREIGN KEY (gameid) REFERENCES games(id),
            FOREIGN KEY (playid) REFERENCES plays(id),
            UNIQUE(gameid, playid)
        );`);
        await pool.query(`CREATE TABLE IF NOT EXISTS reviewstoplay 
        (
            id SERIAL,
            playid int NOT NULL,
            userid int NOT NULL,
            text varchar(1500) default ('Прилетела корова и слизала описа...'),
            stars int NOT NULL CHECK (stars >0) CHECK (stars < 6),
            date timestamp with time zone NOT NULL default(now()),
            PRIMARY KEY(id),
            FOREIGN KEY (playid) REFERENCES plays(id),
            FOREIGN KEY (userid) REFERENCES users(id),
            UNIQUE(userid, playid)
        );`);
        await pool.query(`CREATE TABLE IF NOT EXISTS reviewstoGame 
        (
            id SERIAL,
            gameid int NOT NULL,
            userid int NOT NULL,
            text varchar(1500) default ('Прилетела корова и слизала описа...'),
            stars int NOT NULL CHECK (stars >0) CHECK (stars < 6),
            date timestamp with time zone NOT NULL default(now()),
            PRIMARY KEY(id),
            FOREIGN KEY (gameid) REFERENCES games(id),
            FOREIGN KEY (userid) REFERENCES users(id),
            UNIQUE(userid, gameid)
        );`);
        await pool.query(`CREATE TABLE IF NOT EXISTS reviewstomaster 
        (
            id SERIAL,
            masterid int NOT NULL,
            userid int NOT NULL,
            text varchar(1500) default ('Прилетела корова и слизала описа...'),
            stars int NOT NULL CHECK (stars >0) CHECK (stars < 6),
            date timestamp with time zone NOT NULL default(now()),
            PRIMARY KEY(id),
            FOREIGN KEY (masterid) REFERENCES masters(id),
            FOREIGN KEY (userid) REFERENCES users(id),
            UNIQUE(userid, masterid)
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