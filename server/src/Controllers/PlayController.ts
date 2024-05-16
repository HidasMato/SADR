import { NextFunction, Request, Response } from "express";
import PlayService from "../Services/PlayService";
import { UploadedFile } from "express-fileupload";
import ApiError from "../Exeptions/ApiError";
import RigthsService from "../Services/RigthsService";
import { Roles } from "../Types/Roles";
import { PlayCreate } from "../Types/PlayCreate";
import GameService from "../Services/GameService";
import UserService from "../Services/UserService";

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
    static changeCreatePlay(mode: "change" | "create") {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!RigthsService.forMasterOrAdmin({ roles: req.body.roles as Roles })) throw ApiError.Teapot();
                // Если мастер, то проверить, что это его игротека
                const create: PlayCreate = {
                    name: req.body.name,
                    masterId: Number(req.body.masterId),
                    minplayers: Number(req.body.minplayers),
                    maxplayers: Number(req.body.maxplayers),
                    description: req.body.description,
                    status: Boolean(req.body.status),
                    datestart: new Date(req.body.datestart),
                    dateend: new Date(req.body.dateend),
                    games:
                        req.body.games == ""
                            ? []
                            : req.body.games.split(",").map((val: string) => {
                                  return Number(val);
                              }),
                };
                let image = req.files?.image?.constructor === Array ? req.files?.image[0] : req.files?.image;
                const result =
                    mode === "create"
                        ? await PlayService.changeCreatePlay({ inf: create, image: image as UploadedFile })
                        : await PlayService.changeCreatePlay({ id: Number(req.params.id), inf: create, image: image as UploadedFile | undefined });
                return res.json({ redirectionId: result });
            } catch (error: any) {
                next(error);
            }
        };
    }
    createPlay = PlayController.changeCreatePlay("create");
    changePlay = PlayController.changeCreatePlay("change");
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
            if (!RigthsService.forAdmin({ roles: req.body.roles as Roles })) throw ApiError.Teapot();
            const id = Number(req.params.id);
            const result = await PlayService.deletePlay({ id });
            if (result) return res.json();
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
            const userId = Number(req.body.userid || req.body.uid);
            if (!RigthsService.forGamerOrAdmin({ roles: req.body.roles as Roles }) && RigthsService.forGamer({ roles: req.body.roles as Roles }) && userId != req.body.uid) throw ApiError.Teapot();
            await PlayService.registrUserToPlay({ playId: playId, userId: userId });
            return res.json("Пользователь добавлен");
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
            const userId = Number(req.body.userid || req.body.uid);
            if (!RigthsService.forGamerOrAdmin({ roles: req.body.roles as Roles }) && RigthsService.forGamer({ roles: req.body.roles as Roles }) && userId != req.body.uid) throw ApiError.Teapot();
            await PlayService.unRegistrUserToPlay({ playId: playId, userId: userId });
            return res.json("Пользователь удален");
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
            const id = Number(req.query.id || req.body.uid);
            if (!RigthsService.forGamerOrAdmin({ roles: req.body.roles as Roles }) || (RigthsService.forGamer({ roles: req.body.roles as Roles }) && id != req.body.uid)) throw ApiError.Teapot();
            const plays = await PlayService.getPlaysGamer({ id: id });
            return res.json(plays);
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
            const id = Number(req.query.id || req.body.uid);
            if (!RigthsService.forGamerOrAdmin({ roles: req.body.roles as Roles }) || (RigthsService.forMaster({ roles: req.body.roles as Roles }) && id != req.body.uid)) throw ApiError.Teapot();
            const plays = await PlayService.getPlaysMaster({ id: id });
            return res.json(plays);
        } catch (error: any) {
            next(error);
        }
    }
    async getCreatorInfo(req: Request, res: Response, next: NextFunction) {
        try {
            let masters: { id: number; name: string }[] = [];
            const games = await GameService.getAllGames();
            if (RigthsService.forAdmin({ roles: req.body.roles as Roles })) {
                masters = await UserService.getAllMasters();
                return res.json({ masters: masters, games: games });
            } else if (RigthsService.forMaster({ roles: req.body.roles as Roles })) {
                masters = [(await UserService.getUserInfoById({ id: Number(req.body.uid), MODE: "forAll" })) as { id: number; name: string }];
                return res.json({ access: true, masters: masters, games: games });
            }
            throw ApiError.Teapot();
        } catch (error: any) {
            next(error);
        }
    }
    async getPlaysGame(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            return res.json(await PlayService.getPlaysGame({ id: id }));
        } catch (error: any) {
            next(error);
        }
    }
}

export default new PlayController();
