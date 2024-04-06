import { Request, Response, NextFunction } from "express";
import ApiError from "../Exeptions/ApiError";
import TokenService from "../Services/TokenService";
import UserService from "../Services/UserService";

async function AuthMiddleWare(req: Request, res: Response, next: NextFunction) {
    try {

        req.body.roles = {
            user: false,
            master: false,
            admin: false
        }
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader)
            return next();
        const accessToken = authorizationHeader.split(' ')[1]
        if (!accessToken)
            return next();
        const user = await TokenService.validateAccessToken({ token: accessToken });
        if (!user)
            return next();
        const role = await UserService.getUserRole({ id: user.id })
        req.body.roles = role;
        return next();
    } catch (error) {
        console.log(error)
        next(ApiError.UnavtorisationError())
    }
}

export default AuthMiddleWare;