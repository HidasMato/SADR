import { Request, Response, NextFunction } from "express";
import ApiError from "../Exeptions/ApiError";

async function LogMiddleWare(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(`${req.ip} ${req.method} ${req.url}`)
        return next();
    } catch (error) {
        console.log(error)
        next(ApiError.BadRequest({message: "Ошибка логгирования"}))
    }
}

export default LogMiddleWare;