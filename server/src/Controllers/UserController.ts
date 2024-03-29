
import { Request, Response, response } from 'express';
import UserService, { TypesMode } from '../Services/UserService';

class UserController {
    returnError(Error: Error, req: Request, res: Response) {
        console.log(Error);
        return res.status(401).json(Error.message);
    }
    async getUserInfoById(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            //TODO: здесь проверка кто запрашивает инфу пока будет секьюрити
            const user = await UserService.getUserInfoById({ id: id, MODE: TypesMode.SEQURITY });
            return res.status(200).json(user);
        } catch (error: any) {
            return (new UserController).returnError(error, req, res)
        }
    }
    async checkUserAuthByMail(req: Request, res: Response): Promise<Response> {
        try {
            const authData: { mail: string, pass: string } = req.body;
            const user = await UserService.checkUserAuthByMail({ mail: authData.mail, pass: authData.pass });
            return res.status(200).json({ redirectionId: user });
        } catch (error: any) {
            return (new UserController).returnError(error, req, res)
        }
    }
    async create(req: Request, res: Response): Promise<Response> {
        try {
            const createDate: { mail: string, pass: string, nickName: string } = req.body;
            const user = await UserService.createUser({ mail: createDate.mail, pass: createDate.pass, nickName: createDate.nickName });
            return res.status(200).json({ redirectionId: user });
        } catch (error: any) {
            return (new UserController).returnError(error, req, res)
        }
    }
    async change(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            const changeDate: { mail: string, pass: string, nickName: string, role: string } = req.body;
            if (changeDate.pass)
                await UserService.changePass({ mail: changeDate.mail, pass: changeDate.pass, id: id });
            else if (changeDate.nickName)
                await UserService.changeNickName({ mail: changeDate.mail, nickName: changeDate.nickName, id: id });
            // else if (changeDate.role)
            //     await UserService.changeRole({ mail: changeDate.mail, nickName: changeDate.role, id: id });
            else
                await UserService.changeMail({ mail: changeDate.mail, id: id });
            return res.status(200).json("Sucsess");
        } catch (error: any) {
            return (new UserController).returnError(error, req, res)
        }
    }
}

export default new UserController;