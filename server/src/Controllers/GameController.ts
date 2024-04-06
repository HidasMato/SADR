
import { NextFunction, Request, Response, response } from 'express';
import GameService from '../Services/GameService';
import { UploadedFile } from 'express-fileupload';
import FileService from '../Services/FileService';
import ApiError from '../Exeptions/ApiError';
type update = {
    name: string | undefined,
    minplayers: number | undefined,
    maxplayers: number | undefined,
    mintimeplay: number | undefined,
    maxtimeplay: number | undefined,
    hardless: number | undefined,
    description: string | undefined,
    img: string | undefined
}

class GameController {
    async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const setting: { start: number, count: number } = req.body;
            const filter = req.query;
            const arrGame = await GameService.getGameList({ settingList: setting, filter: filter });
            if (arrGame.length == 0)
                return res.status(403).json({ message: "В базе данных больше нет игр" });
            return res.json(arrGame);
        } catch (error: any) {
            next(error)
        }
    }
    async getOneInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw ApiError.BadRequest({ message: "Неправильное значение id" })
            const response = await GameService.getGameInfoById({ id });
            if (!response)
                return res.status(402).json({ message: "Нет такого id в базе" });
            return res.json(response);
        } catch (error: any) {
            next(error)
        }
    }
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const create: update = req.body;
            const result = await GameService.create({ createInf: create });
            return res.json({ redirectionId: result });
        } catch (error: any) {
            next(error)
        }
    };
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const image = req.files?.image;
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw ApiError.BadRequest({ message: "Неправильное значение id" })
            const update: update = req.body;
            if (image)
                update.img = await FileService.saveFile({ file: image as UploadedFile, fileName: 'game_' + id + '.png' })
            await GameService.update({ id: id, update: update })
            return res.json({ message: "Изменение успешно" });
        } catch (error: any) {
            next(error)
        }
    };
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                return res.status(401).json({ message: "Неправильное значение id" });
            const result = await GameService.delete({ id });
            if (result != 0)
                return res.json({ message: "Удаление успешно" });
            else
                return res.status(401).json({ message: "Удаление не произошло" });
        } catch (error: any) {
            next(error)
        }
    };

}

export default new GameController();