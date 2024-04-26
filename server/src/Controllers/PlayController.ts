import { NextFunction, Request, Response, response } from "express";
import PlayService from "../Services/PlayService";
import { UploadedFile } from "express-fileupload";
import ApiError from "../Exeptions/ApiError";
import RigthsService from "../Services/RigthsService";
import { Roles } from "../Types/Roles";
import { PlayUpdate } from "../Types/PlayUpdate";

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
            const id = Number(req.params.id);
            const response = await PlayService.getPlayInfoById({ id });
            if (!response) return res.status(461).json({ message: "Нет такого id в базе" });
            return res.json(response);
        } catch (error: any) {
            next(error);
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
                page: number;
                datestart: number;
                dateend: number;
                masterid: number;
                freeplace: number;
                findname: string;
            };
            const setting = {
                page: Number(query.page),
            };
            const filter = {
                datestart: new Date(query.datestart),
                dateend: new Date(query.dateend),
                masterid: Number(query.masterid),
                freeplace: Number(query.freeplace),
                findname: query.findname,
            };
            return res.json(
                await PlayService.getPlayList({
                    setting: setting,
                    filter: filter,
                }),
            );
        } catch (error: any) {
            next(error);
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
            if (
                !RigthsService.forMasterOrAdmin({
                    roles: req.body.roles as Roles,
                })
            )
                throw ApiError.Teapot();
            const create: PlayUpdate = req.body;
            let image = req.files?.image;
            if (image?.constructor === Array) image = image[0];
            const result = await PlayService.createPlay({
                createInf: create,
                image: image as UploadedFile,
            });
            if (typeof result == "number") return res.json({ redirectionId: result });
            else
                return res.status(462).json({
                    message: "Не существует игр",
                    isGamesExists: result,
                });
        } catch (error: any) {
            next(error);
        }
    }
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
            if (
                !RigthsService.forMasterOrAdmin({
                    roles: req.body.roles as Roles,
                })
            )
                throw ApiError.Teapot();
            const id = Number(req.params.id);
            if (
                RigthsService.onlyForMaster({
                    roles: req.body.roles as Roles,
                }) &&
                !((await PlayService.getMasterId({ playId: id })) == id)
            )
                throw ApiError.Teapot();
            let image = req.files?.image;
            if (image?.constructor === Array) image = image[0];
            const update: PlayUpdate = req.body;
            if (
                !(await PlayService.updatePlay({
                    id: id,
                    update: update,
                    image: image as UploadedFile | undefined,
                }))
            )
                return res.status(460).json({ message: "Пустой массив изменений" });
            else return res.json({ message: "Изменения совершены" });
        } catch (error: any) {
            next(error);
        }
    }
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
            if (!RigthsService.onlyForAdmin({ roles: req.body.roles as Roles })) throw ApiError.Teapot();
            const id = Number(req.params.id);
            const result = await PlayService.deletePlay({ id });
            if (result) return res.json({ message: "Удаление успешно" });
            else return res.status(401).json({ message: "Удаление не произошло" });
        } catch (error: any) {
            next(error);
        }
    }
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
            const playId = Number(req.params.id);
            const { userId }: { userId: number } = req.body;
            if (
                !RigthsService.forGamerOrAdmin({
                    roles: req.body.roles as Roles,
                }) ||
                (RigthsService.onlyForGamer({
                    roles: req.body.roles as Roles,
                }) &&
                    userId == req.body.uid)
            )
                throw ApiError.Teapot();
            await PlayService.registrUserToPlay({
                playId: playId,
                userId: userId,
            });
            return res.json({ message: "Пользователь добавлен" });
        } catch (error: any) {
            next(error);
        }
    }
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
            const playId = Number(req.params.id);
            const { userId }: { userId: number } = req.body;
            if (
                !RigthsService.forGamerOrAdmin({
                    roles: req.body.roles as Roles,
                }) ||
                (RigthsService.onlyForGamer({
                    roles: req.body.roles as Roles,
                }) &&
                    userId == req.body.uid)
            )
                throw ApiError.Teapot();
            await PlayService.unRegistrUserToPlay({
                playId: playId,
                userId: userId,
            });
            return res.json({ message: "Пользователь удален" });
        } catch (error: any) {
            next(error);
        }
    }
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
            const id = Number(req.params.id);
            if (
                !RigthsService.forGamerOrAdmin({
                    roles: req.body.roles as Roles,
                }) ||
                (RigthsService.onlyForGamer({
                    roles: req.body.roles as Roles,
                }) &&
                    id != req.body.uid)
            )
                throw ApiError.Teapot();
            const plays = await PlayService.getPlaysGamer({ id: id });
            return res.json({ plays: plays });
        } catch (error: any) {
            next(error);
        }
    }
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
            const id = Number(req.params.id);
            if (
                !RigthsService.forGamerOrAdmin({
                    roles: req.body.roles as Roles,
                }) ||
                (RigthsService.onlyForGamer({
                    roles: req.body.roles as Roles,
                }) &&
                    id != req.body.uid)
            )
                throw ApiError.Teapot();
            const plays = await PlayService.getPlaysMaster({ id: id });
            return res.json({ plays: plays });
        } catch (error: any) {
            next(error);
        }
    }
}

export default new PlayController();
