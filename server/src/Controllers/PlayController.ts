
import { NextFunction, Request, Response, response } from 'express';
import PlayService from '../Services/PlayService';
import { UploadedFile } from 'express-fileupload';
import ApiError from '../Exeptions/ApiError';

type update = {
    name: string | undefined,
    masterId: number | undefined,
    minplayers: number | undefined,
    maxplayers: number | undefined,
    description: string | undefined,
    status: boolean | undefined,
    datestart: Date | undefined,
    dateend: Date | undefined,
    games: number[] | undefined
}


class PlayController {
    async getOneInfo(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.parameters['id'] = {
                in: 'path',                            
                description: 'Айди игры',                          
                type: 'number',                          
            }
            #swagger.responses[200] = {
                description: "Упех",
                schema:{
                    $ref: "#/definitions/onePlay"
                }
            }   
            #swagger.responses[460] = {
                description: "Параметр айди неверный",
            }   
            #swagger.responses[461] = {
                description: "Игра не найдена",
            }   
         */
        try {
            const id = parseInt(req.params.id);
            const response = await PlayService.getPlayInfoById({ id });
            if (!response)
                return res.status(461).json({ message: "Нет такого id в базе" });
            return res.json(response);
        } catch (error: any) {
            next(error)
        }
    }
    async getList(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.parameters['start'] = {
                in: 'query',                            
                description: 'Начиная с какого номера, def = 0',                          
                type: 'number',                          
            }
            #swagger.parameters['count'] = {
                in: 'query',                            
                description: 'Сколько позиций будет возвращено, def = 20',                          
                type: 'number',                          
            }
            #swagger.parameters['minplayer'] = {
                in: 'query',                            
                description: 'Метод фильтра (Не реализовано)',                          
                type: 'number',                          
            }
            #swagger.parameters['maxplayer'] = {
                in: 'query',                            
                description: 'Метод фильтра (Не реализовано)',                          
                type: 'number',                          
            }
            #swagger.responses[200] = {
                description: "Уcпех",
                schema:{ $ref: '#/definitions/listOfPlays' }
            }   
            #swagger.responses[460] = {
                description: "Нет игротек",
                schema:{
                    "message":"В базе данных больше нет игротек"
                }
            }   
         */
        try {
            const query = req.query as object as {
                start: number,
                count: number,
                minplayer: number,
                maxplayer: number
            }
            const setting = { start: Number(query.start), count: Number(query.count) };
            const filter = { minplayer: Number(query.minplayer), maxplayer: Number(query.maxplayer) };
            const arrPlay = await PlayService.getPlayList({ setting: setting, filter: filter });
            if (arrPlay.length == 0)
                return res.status(460).json({ message: "В базе данных больше нет игротек" });
            return res.json(arrPlay);
        } catch (error: any) {
            next(error)
        }
    }
    async create(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.summary = 'По этой ссылке можно отправляьт image файлом по formdata, но swagger говна поел'
            #swagger.parameters['body'] = {
                in: 'body',         
                schema: { $ref: '#/definitions/createPlay' }                     
            }
            #swagger.responses[200] = {
                description: "Упех",
                schema:{
                    redirectionId: 1
                }
            }  
         */
        try {
            const create: update = req.body;
            let image = req.files?.image;
            if (image?.constructor === Array)
                image = image[0];
            const result = await PlayService.createPlay({ createInf: create, image: image as UploadedFile });
            if (typeof result == 'number')
                return res.json({ redirectionId: result });
            else
                return res.status(462).json({ message: "Не существует игр", isGamesExists: result });
        } catch (error: any) {
            next(error)
        }
    };
    async update(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.summary = 'По этой ссылке можно отправляьт image файлом по formdata, но swagger говна поел'
            #swagger.parameters['id'] = {
                in: 'path',                            
                description: 'Айди игротеки',                          
                type: 'number',                          
            }
            #swagger.parameters['body'] = {
                in: 'body',         
                schema: { $ref: '#/definitions/createPlay' }                     
            }
            #swagger.responses[200] = {
                description: "Упех",
                schema:{
                    message: "Изменение успешно"
                }
            }  
         */
        try {
            const id = parseInt(req.params.id);
            let image = req.files?.image;
            if (image?.constructor === Array)
                image = image[0];
            const update: update = req.body;
            if (!await PlayService.updatePlay({ id: id, update: update, image: image as UploadedFile | undefined }))
                return res.status(460).json({ message: "Пустой массив изменений" });
            else
                return res.json({ message: "Изменения совершены" })
        } catch (error: any) {
            next(error)
        }
    };
    async delete(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.parameters['id'] = {
                in: 'path',                            
                description: 'Айди игротеки',                          
                type: 'number',                          
            }
            #swagger.responses[200] = {
                description: "Упех",
                schema:{
                    message: "Удаление произошло"
                }
            }  
            #swagger.responses[460] = {
                description: "Упех",
                schema:{
                    message: "Удаление не произошло"
                }
            }  
         */
        try {
            const id = parseInt(req.params.id);
            const result = await PlayService.deletePlay({ id });
            if (result)
                return res.json({ message: "Удаление успешно" });
            else
                return res.status(401).json({ message: "Удаление не произошло" });
        } catch (error: any) {
            next(error)
        }
    };
    async plusGamer(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.parameters['id'] = {
                in: 'path',                            
                description: 'Айди игротеки',                          
                type: 'number',                          
            }
            #swagger.parameters['body'] = {
                in: 'body',         
                schema: { 
                    userId: 1
                }                     
            }
            #swagger.responses[200] = {
                description: "Упех",
                schema:{
                    message: "Пользователь добавлен"
                }
            }  
            #swagger.responses[460] = {
                description: "Неправильно значение id игротеки",
                schema:{
                    message: "Неправильно значение id"
                }
            }  
            #swagger.responses[461] = {
                description: "Неправильно значение id пользователя",
                schema:{
                    message: "Неправильно значение id рользователя"
                }
            }  
         */
        try {
            const playId = parseInt(req.params.id);
            const { userId }: { userId: number } = req.body;
            await PlayService.registrUserToPlay({ playId: playId, userId: userId })
            return res.json({ message: "Пользователь добавлен" });
        } catch (error: any) {
            next(error)
        }
    };
    async minusGamer(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.parameters['id'] = {
                in: 'path',                            
                description: 'Айди игротеки',                          
                type: 'number',                          
            }
            #swagger.parameters['body'] = {
                in: 'body',         
                schema: { 
                    userId: 1
                }                     
            }
            #swagger.responses[200] = {
                description: "Упех",
                schema:{
                    message: "Пользователь удален"
                }
            }  
            #swagger.responses[460] = {
                description: "Неправильно значение id игротеки",
                schema:{
                    message: "Неправильно значение id"
                }
            }  
            #swagger.responses[461] = {
                description: "Неправильно значение id пользователя",
                schema:{
                    message: "Неправильно значение id рользователя"
                }
            }  
         */
        try {
            const playId = parseInt(req.params.id);
            const { userId }: { userId: number } = req.body;
            await PlayService.unRegistrUserToPlay({ playId: playId, userId: userId })
            return res.json({ message: "Пользователь удален" });
        } catch (error: any) {
            next(error)
        }
    };
    async getPlaysGamer(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.parameters['id'] = {
                in: 'path',                            
                description: 'Айди игрока',                          
                type: 'number',                          
            }
            #swagger.responses[200] = {
                description: "Упех",
                schema:{
                    message: "Пользователь удален"
                }
            }  
            #swagger.responses[460] = {
                description: "Неправильно значение id пользователя",
                schema:{message: "Неправильно значение id пользователя"}
            }
            #swagger.responses[461] = {
                description: "Пользователя не существует",
                schema:{message: "Пользователя не существует"}
            }
         */
        try {
            const id = parseInt(req.params.id);
            const plays = await PlayService.getPlaysGamer({ id: id })
            return res.json({ plays: plays });
        } catch (error: any) {
            next(error)
        }
    };
    async getPlaysMaster(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.parameters['id'] = {
                in: 'path',                            
                description: 'Айди игрока',                          
                type: 'number',                          
            }
            #swagger.responses[200] = {
                description: "Упех",
                schema:{
                    message: "Пользователь удален"
                }
            }  
            #swagger.responses[460] = {
                description: "Неправильно значение id пользователя",
                schema:{
                    message: "Неправильно значение id"
                }
            }
         */
        try {
            const id = parseInt(req.params.id);
            const plays = await PlayService.getPlaysMaster({ id: id })
            return res.json({ plays: plays });
        } catch (error: any) {
            next(error)
        }
    };
}

export default new PlayController();