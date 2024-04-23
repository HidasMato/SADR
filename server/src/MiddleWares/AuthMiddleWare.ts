import { Request, Response, NextFunction } from "express";
import ApiError from "../Exeptions/ApiError";
import TokenService from "../Services/TokenService";
import UserService from "../Services/UserService";

async function AuthMiddleWare(req: Request, res: Response, next: NextFunction) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) return next();
        const accessToken = authorizationHeader.split(" ")[1];
        if (!accessToken) return next();
        const user = await TokenService.validateAccessToken({
            token: accessToken,
        });
        if (!user) return next();
        const roles = await UserService.getUserRole({ id: user.id });
        req.body.roles = roles;
        req.body.uid = user.id;
        // let logStr = ''
        // if (!roles.gamer)
        //     logStr = 'Не пользователь'
        // else {
        //     logStr = "Игрок"
        //     if (roles.master)
        //         logStr += ', Мастер'
        //     if (roles.admin)
        //         logStr += ', Админ'
        // }
        // console.log(logStr)
        return next();
    } catch (error) {
        console.log(error);
        next(ApiError.UnavtorisationError());
    }
}

export default AuthMiddleWare;
