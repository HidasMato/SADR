import { Request, Response, NextFunction } from "express";
import ApiError from "../Exeptions/ApiError";

function ErrorMiddleWare(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    console.log(err);
    if (err instanceof ApiError)
        return res
            .status(err.status)
            .json({ message: err.message, errors: err.errors });
    return res.status(500).json({ message: "Непредвиденная ошибка" });
}

export default ErrorMiddleWare;
