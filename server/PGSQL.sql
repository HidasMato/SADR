
DROP TABLE IF EXISTS ReviewsToMaster;
DROP TABLE IF EXISTS ReviewsToGame;
DROP TABLE IF EXISTS ReviewsToPlay;
DROP TABLE IF EXISTS GamesOfPlay;
DROP TABLE IF EXISTS UsersOfPlay;
DROP TABLE IF EXISTS Plays;
DROP TABLE IF EXISTS Masters;
DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS Games;
DROP TABLE IF EXISTS Users;


CREATE TABLE IF NOT EXISTS  Games
(
    id SERIAL,
	name varchar(40) unique NOT NULL,
	minPlayers int default (60) NOT NULL,
	maxPlayers int default (60) NOT NULL,
	minTimePlay int default (60) NOT NULL,
	maxTimePlay int default (60) NOT NULL,
	hardless int NOT NULL CHECK (hardless >0) CHECK (hardless < 4),
	description varchar(200) default ('Прилетела корова и слизала описа...'),
	img varchar(100) default('empty.png'),
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS  Users
(
    id SERIAL,
	nuckName varchar(40) unique NOT NULL,
	mail varchar(40) NOT NULL,
	passCache int NOT NULL ,
	img varchar(100) default('empty.png'),
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS  Masters
(
    id int,
	description varchar(200) default('Прилетела корова и слизала описа...'),
	PRIMARY KEY(id),
	FOREIGN KEY (id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS  Admins
(
    id int PRIMARY KEY,
	FOREIGN KEY (id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Plays
(
    id SERIAL,
	name varchar(40) unique NOT NULL,
	masterId int NOT NULL,
	minPlayers int default (3) NOT NULL,
	maxPlayers int default (5) NOT NULL,
	description varchar(200) default ('Прилетела корова и слизала описа...'),
	status boolean NOT NULL,
	img varchar(100) default('empty.png'),
	dateStart timestamp with time zone NOT NULL,
	dateEnd timestamp with time zone NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY (masterId) REFERENCES Masters(id)
);

CREATE TABLE IF NOT EXISTS UsersOfPlay
(
    id SERIAL,
	userId int NOT NULL,
	playId int NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY (userId) REFERENCES Users(id),
	FOREIGN KEY (playId) REFERENCES Plays(id),
	UNIQUE(userId, playId)
);

CREATE TABLE IF NOT EXISTS GamesOfPlay
(
    id SERIAL,
	gameId int NOT NULL,
	playId int NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY (gameId) REFERENCES Games(id),
	FOREIGN KEY (playId) REFERENCES Plays(id),
	UNIQUE(gameId, playId)
);

CREATE TABLE IF NOT EXISTS ReviewsToPlay
(
    id SERIAL,
	playId int NOT NULL,
	userId int NOT NULL,
	text varchar(200) default ('Прилетела корова и слизала описа...'),
	stars int NOT NULL CHECK (stars >0) CHECK (stars < 6),
	date timestamp with time zone NOT NULL default(now()),
	PRIMARY KEY(id),
	FOREIGN KEY (playId) REFERENCES Plays(id),
	FOREIGN KEY (userId) REFERENCES Users(id),
	UNIQUE(userId, playId)
);

CREATE TABLE IF NOT EXISTS ReviewsToGame
(
    id SERIAL,
	gameId int NOT NULL,
	userId int NOT NULL,
	text varchar(200) default ('Прилетела корова и слизала описа...'),
	stars int NOT NULL CHECK (stars >0) CHECK (stars < 6),
	date timestamp with time zone NOT NULL default(now()),
	PRIMARY KEY(id),
	FOREIGN KEY (gameId) REFERENCES Games(id),
	FOREIGN KEY (userId) REFERENCES Users(id),
	UNIQUE(userId, gameId)
);

CREATE TABLE IF NOT EXISTS ReviewsToMaster
(
    id SERIAL,
	masterId int NOT NULL,
	userId int NOT NULL,
	text varchar(200) default ('Прилетела корова и слизала описа...'),
	stars int NOT NULL CHECK (stars >0) CHECK (stars < 6),
	date timestamp with time zone NOT NULL default(now()),
	PRIMARY KEY(id),
	FOREIGN KEY (masterId) REFERENCES Masters(id),
	FOREIGN KEY (userId) REFERENCES Users(id),
	UNIQUE(userId, masterId)
);

