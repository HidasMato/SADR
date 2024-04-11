const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        version: '0.1.0',            // by default: '1.0.0'
        title: 'SADR API',
        description: 'API нашего любимого сервера ♡'
    },
    host: 'localhost:2052',
    basePath: '/',             // by default: '/'
    schemes: ["http"],              // by default: ['http']
    securityDefinitions: {},  // by default: empty object
    definitions: {
        createGame: {
            name: 'Имя игры',
            minplayers: 2,
            maxplayers: 4,
            mintimeplay: 30,
            maxtimeplay: 60,
            hardless: 1,
            description: 'Какое-то описание'
        },
        oneGame: {
            id: 1,
            name: 'Имя игры',
            minplayers: 2,
            maxplayers: 4,
            mintimeplay: 30,
            maxtimeplay: 60,
            hardless: 1,
            description: 'Какое-то описание'
        },
        listOfGames: [{ $ref: '#/definitions/oneGame' }],
        createPlay: {
            name: 'Имя игротеки',
            masterId: 1,
            minplayers: 2,
            maxplayers: 4,
            description: '',
            status: true,
            datestart: "2024-02-01T15:00:00.000Z",
            dateend: "2024-02-01T15:00:00.000Z",
            games: [1, 2]
        },
        onePlay: {
            id: 1,
            name: 'Имя игротеки',
            masterId: 1,
            minplayers: 2,
            maxplayers: 4,
            description: '',
            status: true,
            datestart: "2024-02-01T15:00:00.000Z",
            dateend: "2024-02-01T15:00:00.000Z",
            games: [1, 2]
        },
        listOfPlays: [{ $ref: '#/definitions/onPlay' }],
        createUser: {
            nickname: 'Никнейм',
            mail: 'mail@mail.mail',
            pass: "Secretno"
        },
        oneUser: {
            id: 1,
            nickname: 'Никнейм',
            mail: 'mail@mail.mail',
            mailVeryfity: true,
            role: 'Мастер'
        },
        changeUser: {
            nickname: 'Никнейм',
            mail: 'mail@mail.mail',
            mailVeryfity: true,
            role: 'мастер',
            description: 'Клевый мастер',
            pass: 'Секретно'
        },
        listOfUsers: [{ $ref: '#/definitions/oneUser' }]
    }
};

const outputFile = './swagger-output.json';
const routes = ["../index.ts"];

swaggerAutogen(outputFile, routes, doc);