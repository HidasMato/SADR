import { NextFunction, Request, Response } from "express";
import UserService from "../Services/UserService";
import FileService from "../Services/FileService";
import { UploadedFile } from "express-fileupload";
import { CLIENT_URL } from "../../tokens.json";
import ApiError from "../Exeptions/ApiError";
import RigthsService from "../Services/RigthsService";
import { Roles } from "../Types/Roles";

class UserController {
    async getUserInfo(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.summary = 'Другой игрок может получить только имя и роль'
            #swagger.parameters['id'] = {
                in: 'path',                            
                description: 'Айди пользователя',                          
                type: 'number',                          
            }
            #swagger.responses[200] = {
                description: "Упех",
                schema:{
                    $ref: "#/definitions/oneUser"
                }
            } 
         */
        try {
            if (
                !RigthsService.forGamerOrMasterOrAdmin({
                    roles: req.body.roles as Roles,
                })
            )
                throw ApiError.Teapot();
            const id = req.body.uid;
            const user = await UserService.getUserInfoById({
                id: id,
                MODE: "sequrity",
            });
            return res.json(user);
        } catch (error: any) {
            next(error);
        }
    }
    async getUserInfoById(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.summary = 'Другой игрок может получить только имя и роль'
            #swagger.parameters['id'] = {
                in: 'path',                            
                description: 'Айди пользователя',                          
                type: 'number',                          
            }
            #swagger.responses[200] = {
                description: "Упех",
                schema:{
                    $ref: "#/definitions/oneUser"
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
            //TODO: здесь проверка кто запрашивает инфу пока будет секьюрити
            const user = await UserService.getUserInfoById({
                id: id,
                MODE: "sequrity",
            });
            return res.json(user);
        } catch (error: any) {
            next(error);
        }
    }
    async getList(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.summary = 'Другой игрок может получить только имя и роль'
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
            #swagger.responses[200] = {
                description: "Уcпех",
                schema:{ $ref: '#/definitions/listOfUsers' }
            }   
            #swagger.responses[460] = {
                description: "Нет игротек",
                schema:{
                    "message":"В базе данных больше нет игроков"
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
            const query = req.query as object as {
                start: number;
                count: number;
            };
            const setting = {
                start: Number(query.start),
                count: Number(query.count),
            };
            // const filter = { minPlayer: Number(query.minPlayer), maxPlayer: Number(query.maxPlayer) };
            const filter = {};
            const arrUser = await UserService.getUserList({
                setting: setting,
                filter: filter,
                MODE: "forAll",
            });
            if (arrUser.length == 0)
                return res
                    .status(403)
                    .json({ message: "В базе данных больше нет игроков" });
            return res.json(arrUser);
        } catch (error: any) {
            next(error);
        }
    }
    async change(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.description = 'Обновляет только одну вещь за раз. Если есть пароль, то обновить пароль. Иначе если есть никнейм обновит никнейм. Иначе Если есть картика, то обновить картинку. Иначе если есть роль обновит роль. Иначе если есть описание (у мастера) обновит описание. Иначе обновит почту'
            #swagger.parameters['body'] = {
                in: 'body',         
                schema: { $ref: '#/definitions/changeUser' }                     
            }
            #swagger.responses[200] = {
                description: "Упех",
                schema:{
                    message:"Success"
                }
            } 
         */
        try {
            if (
                req.body.id != undefined &&
                !RigthsService.onlyForAdmin({ roles: req.body.roles as Roles })
            )
                throw ApiError.Teapot();
            const id = Number(
                req.body.id == undefined ? req.body.uid : req.body.id,
            );
            const image = req.files?.image;
            const changeDate: {
                mail: string;
                pass: string;
                nickname: string;
                role: string;
                description: string;
            } = req.body;
            if (changeDate.pass)
                await UserService.changePass({
                    mail: changeDate.mail,
                    pass: changeDate.pass,
                    id: id,
                });
            else if (changeDate.nickname)
                await UserService.changeNickName({
                    mail: changeDate.mail,
                    nickname: changeDate.nickname,
                    id: id,
                });
            else if (image) {
                await FileService.saveFile({
                    file: image as UploadedFile,
                    fileName: "user_" + id + ".png",
                });
            } else if (changeDate.role)
                await UserService.changeRole({
                    mail: changeDate.mail,
                    role: changeDate.role,
                    id: id,
                });
            else if (changeDate.description)
                await UserService.changeDescription({
                    mail: changeDate.mail,
                    description: changeDate.description,
                    id: id,
                });
            else
                await UserService.changeMail({ mail: changeDate.mail, id: id });
            return res.json("Sucsess");
        } catch (error: any) {
            next(error);
        }
    }
    async activateLink(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.parameters['link'] = {
                in: 'query',         
                type: 'string',                
            }
            #swagger.responses[200] = {
                description: "Упех" 
            }   
            #swagger.responses[402] = {
                description: "Время действия ссылки истекло",
                schema:{
                    "message": "Время действия ссылки истекло"
                }
            }  
         */
        try {
            const link = req.params.link;
            await UserService.activateLink({ link: link });
            return res.redirect(CLIENT_URL);
        } catch (error: any) {
            next(error);
        }
    }
    async registration(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.parameters['body'] = {
                in: 'body',         
                schema: { $ref: '#/definitions/createUser' }                     
            }
            #swagger.responses[200] = {
                description: "Упех",
                schema:{
                    user: {
                        id: 'number',
                        nickname: 'string',
                        mail: 'string',
                        mailVeryfity: 'boolean',
                        role: 'string'
                    },
                    tokens: {
                        accessToken: '123123',
                        refreshToken: '123123123',
                    }
                }
            } 
         */
        try {
            const createDate: { mail: string; pass: string; nickname: string } =
                req.body;
            const { hash } = req.body.fingerprint;
            const tokens = await UserService.registration({
                mail: createDate.mail,
                pass: createDate.pass,
                nickname: createDate.nickname,
                hash: hash,
            });
            res.cookie("refreshToken", tokens.refreshToken, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json({
                accessToken: tokens.accessToken,
            });
        } catch (error: any) {
            next(error);
        }
    }
    async login(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.parameters['body'] = {
                in: 'body',         
                schema: { 
                    mail: "loloporow@mail.ru",
                    pass: "AbraKedabra"
                }                     
            }
            #swagger.responses[200] = {
                description: "Упех",
                schema:{
                    user: {
                        id: 'number',
                        nickname: 'string',
                        mail: 'string',
                        mailVeryfity: 'boolean',
                        role: 'string'
                    },
                    tokens: {
                        accessToken: '123123',
                        refreshToken: '123123123',
                    }
                }
            } 
         */
        try {
            const authData: { mail: string; pass: string } = req.body;
            const { hash } = req.body.fingerprint;
            const tokens = await UserService.login({
                mail: authData.mail,
                pass: authData.pass,
                hash: hash,
            });
            res.cookie("refreshToken", tokens.refreshToken, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json({
                accessToken: tokens.accessToken,
            });
        } catch (error: any) {
            next(error);
        }
    }
    async logout(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.parameters['refreshToken'] = {
                in: 'cookies',    
                type: 'string'
            }
            #swagger.responses[200] = {
                description: "Упех",
                schema:{ message: "Выход успешен" }
            } 
         */
        try {
            const { refreshToken } = req.cookies;
            await UserService.logout({ refreshToken: refreshToken });
            res.clearCookie("refreshToken");
            return res.json({ message: "Выход успешен" });
        } catch (error: any) {
            next(error);
        }
    }
    async refresh(req: Request, res: Response, next: NextFunction) {
        /* 
            #swagger.parameters['refreshToken'] = {
                in: 'cookies',    
                type: 'string'
            }
            #swagger.responses[200] = {
                description: "Упех",
                schema:{
                    user: {
                        id: 'number',
                        nickname: 'string',
                        mail: 'string',
                        mailVeryfity: 'boolean',
                        role: 'string'
                    },
                    tokens: {
                        accessToken: 'string', 
                        refreshToken: 'string'
                    }
                } 
            }
         */
        try {
            const { refreshToken } = req.cookies;
            const { hash } = req.body.fingerprint;
            const tokens = await UserService.refresh({
                oldRefreshToken: refreshToken,
                hash: hash,
            });
            res.cookie("refreshToken", tokens.refreshToken, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json({
                accessToken: tokens.accessToken,
            });
        } catch (error: any) {
            res.clearCookie("refreshToken");
            next(error);
        }
    }
}

export default new UserController();
