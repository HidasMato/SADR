
import { NextFunction, Request, Response } from 'express';
import UserService from '../Services/UserService';
import FileService from '../Services/FileService';
import { UploadedFile } from 'express-fileupload';
import { CLIENT_URL } from '../../tokens.json'
import ApiError from '../Exeptions/ApiError';

class UserController {
    async getUserInfoById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw ApiError.BadRequest({ message: "Неправильное значение id" })
            //TODO: здесь проверка кто запрашивает инфу пока будет секьюрити
            const user = await UserService.getUserInfoById({ id: id, MODE: 'sequrity' });
            return res.json(user);
        } catch (error: any) {
            next(error)
        }
    }
    async getList(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.body.roles.user)
                console.log("Не пользователь. Доступен только базовый функционал")
            else {
                console.log("Пользователь. Доступен функционал игрока")
                if (req.body.roles.master)
                    console.log("Мастер. Доступен функционал мастера")
                if (!req.body.roles.admin)
                    console.log("Администратор. Доступен функционал администратора")
            }
            const setting: { start: number, count: number } = req.body;
            const filter = req.query;
            const arrUser = await UserService.getUserList({ settingList: setting, filter: filter, MODE: "forAll" });
            if (arrUser.length == 0)
                return res.status(403).json({ message: "В базе данных больше нет игроков" });
            return res.json(arrUser);
        } catch (error: any) {
            next(error)
        }
    }
    async change(req: Request, res: Response, next: NextFunction) {
        try {
            const image = req.files?.image;
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw ApiError.BadRequest({ message: "Неправильное значение id" })
            const changeDate: { mail: string, pass: string, nickname: string, role: string, description: string } = req.body;
            if (changeDate.pass)
                await UserService.changePass({ mail: changeDate.mail, pass: changeDate.pass, id: id });
            else if (changeDate.nickname)
                await UserService.changeNickName({ mail: changeDate.mail, nickname: changeDate.nickname, id: id });
            else if (image) {
                const fileName = await FileService.saveFile({ file: image as UploadedFile, fileName: 'user_' + id + '.png' })
                await UserService.changeImage({ mail: changeDate.mail, id: id, fileName: fileName });
            }
            else if (changeDate.role)
                await UserService.changeRole({ mail: changeDate.mail, role: changeDate.role, id: id });
            else if (changeDate.description)
                await UserService.changeDescription({ mail: changeDate.mail, description: changeDate.description, id: id });
            else
                await UserService.changeMail({ mail: changeDate.mail, id: id });
            return res.json("Sucsess");
        } catch (error: any) {
            next(error)
        }
    }
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const createDate: { mail: string, pass: string, nickname: string } = req.body;
            const user = await UserService.registration({ mail: createDate.mail, pass: createDate.pass, nickname: createDate.nickname });
            res.cookie('refreshToken', user.tokens.refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(user);
        } catch (error: any) {
            next(error)
        }
    }
    async activateLink(req: Request, res: Response, next: NextFunction) {
        try {
            const link = req.params.link;
            await UserService.activateLink({ link: link });
            return res.redirect(CLIENT_URL)
        } catch (error: any) {
            next(error)
        }
    }
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const authData: { mail: string, pass: string } = req.body;
            const user = await UserService.login({ mail: authData.mail, pass: authData.pass });
            res.cookie('refreshToken', user.tokens.refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(user);
        } catch (error: any) {
            next(error)
        }
    }
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;
            await UserService.logout({ refreshToken: refreshToken });
            res.clearCookie('refreshToken');
            return res.json({ message: "Выход успешен" })
        } catch (error: any) {
            next(error)
        }
    }
    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;
            const user = await UserService.refresh({ oldRefreshToken: refreshToken });
            res.cookie('refreshToken', user.tokens.refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(user);
        } catch (error: any) {
            next(error)
        }
    }
}

export default new UserController();