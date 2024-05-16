import { NextFunction, Request, Response } from "express";
import UserService from "../Services/UserService";
import FileService from "../Services/FileService";
import { UploadedFile } from "express-fileupload";
import { CLIENT_URL } from "../../tokens.json";
import ApiError from "../Exeptions/ApiError";
import RigthsService from "../Services/RigthsService";
import { Roles } from "../Types/Roles";
import RuleService from "../Services/RuleService";

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
            const arrUser = await UserService.getUserList({
                MODE: "forAll",
            });
            if (arrUser.length == 0) return res.status(403).json({ message: "В базе данных больше нет игроков" });
            return res.json(arrUser);
        } catch (error: any) {
            next(error);
        }
    }
    async getAllMasters(req: Request, res: Response, next: NextFunction) {
        try {
            return res.json({
                masters: await UserService.getAllMasters(),
            });
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
            if (req.body.id != undefined && !RigthsService.forAdmin({ roles: req.body.roles as Roles })) throw ApiError.Teapot();
            const id = Number(req.body.id || req.body.uid);
            const image = req.files?.image;
            const changeDate: {
                mail: string;
                oldpass: string;
                pass: string;
                name: string;
                role: string;
                description: string;
            } = req.body;
            if (changeDate.pass)
                await UserService.changePass({
                    mail: changeDate.mail,
                    oldPass: changeDate.oldpass,
                    pass: changeDate.pass,
                    id: id,
                });
            else if (changeDate.name)
                await UserService.changename({
                    mail: changeDate.mail,
                    name: changeDate.name,
                    id: id,
                });
            else if (changeDate.description)
                await UserService.changeDescription({
                    mail: changeDate.mail,
                    description: changeDate.description,
                    id: id,
                });
            else if (changeDate.role)
                await UserService.changeRole({
                    mail: changeDate.mail,
                    role: changeDate.role,
                    id: id,
                });
            else if (image)
                await FileService.saveFile({
                    file: image as UploadedFile,
                    fileName: id + "",
                    folder: "users",
                });
            else await UserService.changeMail({ mail: changeDate.mail, id: id });
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
                        name: 'string',
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
            const createDate: { mail: string; pass: string; name: string } = req.body;
            const { hash } = req.body.fingerprint;
            const tokens = await UserService.registration({
                mail: createDate.mail,
                pass: createDate.pass,
                name: createDate.name,
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
                        name: 'string',
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
    async getRules(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.body.uid);
            if (isNaN(userId)) return res.json(false);
            switch (req.query.rule) {
                case "creategame":
                    return res.json(await RuleService.canICreateGame({ userId: userId, roles: req.body.roles }));
                case "changegame":
                    return res.json(await RuleService.canIChangeGame({ userId: userId, roles: req.body.roles }));
                case "deletegame":
                    return res.json(await RuleService.canIDeleteGame({ userId: userId, roles: req.body.roles }));
                case "gotoplay":
                    return res.json(await RuleService.canIGoToPlay({ userId: userId, roles: req.body.roles, playId: Number(req.query.id) }));
                case "createplay":
                    return res.json(await RuleService.canICreatePlay({ userId: userId, roles: req.body.roles }));
                case "changeplay":
                    return res.json(await RuleService.canIChangePlay({ userId: userId, roles: req.body.roles, playId: Number(req.query.id) }));
                case "deleteplay":
                    return res.json(await RuleService.canIDeletePlay({ userId: userId, roles: req.body.roles, playId: Number(req.query.id) }));
                case "haveIMasterPanel":
                    return res.json(await RuleService.haveIMasterPanel({ userId: userId, roles: req.body.roles }));
                case "haveIAdminPanel":
                    return res.json(await RuleService.haveIAdminPanel({ userId: userId, roles: req.body.roles }));
                default: {
                    break;
                }
            }
            return res.json(false);
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
                        name: 'string',
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
