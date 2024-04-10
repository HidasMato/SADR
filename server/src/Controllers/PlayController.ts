
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
            if (isNaN(id))
                return res.status(461).json({ message: "Неправильное значение id" });
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
            if (isNaN(setting.start) || setting.start < 0)
                setting.start = 0
            if (isNaN(setting.count) || setting.count < 0 || setting.count > 20)
                setting.count = 20
            const arrPlay = await PlayService.getPlayList({ settingList: setting, filter: filter });
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
            if (!create.name)
                throw ApiError.BadRequest({ message: "Отсутствует обязательный параметр name" })
            let image = req.files?.image;
            if (image?.constructor === Array)
                image = image[0];
            const result = await PlayService.create({ createInf: create, image: image as UploadedFile });
            return res.json({ redirectionId: result });
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
            if (isNaN(id))
                throw ApiError.BadRequest({ message: "Неправильное значение id" })
            let image = req.files?.image;
            if (image?.constructor === Array)
                image = image[0];
            const update: update = req.body;
            if (!await PlayService.update({ id: id, update: update, image: image as UploadedFile | undefined }))
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
            if (isNaN(id))
                return res.status(401).json({ message: "Неправильное значение id" });
            const result = await PlayService.delete({ id });
            if (result != 0)
                return res.json({ message: "Удаление успешно" });
            else
                return res.status(401).json({ message: "Удаление не произошло" });
        } catch (error: any) {
            next(error)
        }
    };
    async plusUser(req: Request, res: Response, next: NextFunction) {
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
            if (isNaN(playId))
                return res.status(460).json({ message: "Неправильное значение id" });
            if (isNaN(userId))
                return res.status(461).json({ message: "Неправильное значение id пользователя" });
            await PlayService.registrUserToPlay({ playId: playId, userId: userId })
            return res.json({ message: "Пользователь добавлен" });
        } catch (error: any) {
            next(error)
        }
    };
    async minusUser(req: Request, res: Response, next: NextFunction) {
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
            if (isNaN(playId))
                return res.status(401).json({ message: "Неправильное значение id" });
            if (isNaN(userId))
                return res.status(401).json({ message: "Неправильное значение id пользователя" });
            await PlayService.unRegistrUserToPlay({ playId: playId, userId: userId })
            return res.json({ message: "Пользователь удален" });
        } catch (error: any) {
            next(error)
        }
    };

}

export default new PlayController();