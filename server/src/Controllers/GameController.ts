import { NextFunction, Request, Response } from "express";
import GameService from "../Services/GameService";
import { UploadedFile } from "express-fileupload";
import { GameUpdate } from "../Types/GameUpdate";
 
class GameController {
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
                schema:{ $ref: '#/definitions/listOfGames' }
            }   
         */
        try {
            const query = req.query as object as {
                page: number;
                player: number;
                time: number;
                hardless: number;
                findname: string;
            };
            const setting = {
                page: Number(query.page),
            };
            const filter = {
                player: Number(query.player),
                time: Number(query.time),
                hardless: Number(query.hardless),
                findname: query.findname,
            };
            return res.json(
                await GameService.getGameList({
                    setting: setting,
                    filter: filter,
                }),
            );
        } catch (error: any) {
            next(error);
        }
    }
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
                    $ref: "#/definitions/oneGame"
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
            return res.json(await GameService.getGameInfoById({ id }));
        } catch (error: any) {
            next(error);
        }
    }
    async create(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.summary = 'По этой ссылке можно отправляьт image файлом по formdata, но swagger говна поел'
            #swagger.parameters['body'] = {
                in: 'body',         
                schema: { $ref: '#/definitions/createGame' }                     
            }
            #swagger.responses[200] = {
                description: "Упех",
                schema:{
                    redirectionId: 1
                }
            }  
         */
        try {
            const create: GameUpdate = req.body;
            const image = req.files?.image?.constructor === Array ? req.files?.image[0] : req.files?.image;
            return res.json({
                redirectionId: await GameService.create({
                    createInf: create,
                    image: image as UploadedFile | undefined,
                }),
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
                description: 'Айди игры',                          
                type: 'number',                          
            }
            #swagger.parameters['body'] = {
                in: 'body',         
                schema: { $ref: '#/definitions/createGame' }                     
            }
            #swagger.responses[200] = {
                description: "Упех",
                schema:{
                    message: "Изменение успешно"
                }
            }  
         */
        try {
            const image = req.files?.image?.constructor === Array ? req.files?.image[0] : req.files?.image;
            const id = Number(req.params.id);
            const update: GameUpdate = req.body;
            await GameService.update({
                id: id,
                update: update,
                image: image as UploadedFile | undefined,
            });
            return res.json({ message: "Изменение успешно" });
        } catch (error: any) {
            next(error);
        }
    }
    async delete(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.parameters['id'] = {
                in: 'path',                            
                description: 'Айди игры',                          
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
            #swagger.responses[461] = {
                description: "Упех",
                schema:{
                    message: "Неправильное значение id"
                }
            }  
         */
        try {
            const id = Number(req.params.id);
            await GameService.delete({ id });
            return res.json({ message: "success" });
        } catch (error: any) {
            next(error);
        }
    }
}

export default new GameController();
