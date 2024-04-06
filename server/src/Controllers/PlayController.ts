
import { NextFunction, Request, Response, response } from 'express';
import PlayService from '../Services/PlayService';
import { UploadedFile } from 'express-fileupload';
import FileService from '../Services/FileService';
import ApiError from '../Exeptions/ApiError';

type update = {
    name: string | undefined,
    masterId: number | undefined,
    minplayers: number | undefined,
    maxplayers: number | undefined,
    description: string | undefined,
    status: boolean | undefined,
    img: string | undefined,
    datestart: Date | undefined,
    dateend: Date | undefined,
    games: number[] | undefined
}


class PlayController {
    async getOneInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw ApiError.BadRequest({ message: "Неправильное значение id" })
            const response = await PlayService.getPlayInfoById({ id });
            if (!response)
                return res.status(402).json({ message: "Нет такого id в базе" });
            return res.json(response);
        } catch (error: any) {
            next(error)
        }
    }
    async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const setting: { start: number, count: number } = req.body;
            const filter = req.query;
            const arrPlay = await PlayService.getPlayList({ settingList: setting, filter: filter });
            if (arrPlay.length == 0)
                return res.status(403).json({ message: "В базе данных больше нет игротек" });
            return res.json(arrPlay);
        } catch (error: any) {
            next(error)
        }
    }
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const create: update = req.body;
            if (!create.name)
                throw ApiError.BadRequest({ message: "Отсутствует обязательный параметр name" })
            const result = await PlayService.create({ createInf: create });
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
                update.img = await FileService.saveFile({ file: image as UploadedFile, fileName: 'Play_' + id + '.png' })
            await PlayService.update({ id: id, update: update })
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
            const result = await PlayService.delete({ id });
            if (result != 0)
                return res.json({ message: "Удаление успешно" });
            else
                return res.status(401).json({ message: "Удаление не произошло" });
        } catch (error: any) {
            next(error)
        }
    };
    async plusUser(req: Request, res: Response, next: NextFunction) {
        try {
            const playId = parseInt(req.params.id);
            const { userId }: { userId: number } = req.body;
            if (isNaN(playId))
                return res.status(401).json({ message: "Неправильное значение id" });
            if (isNaN(userId))
                return res.status(401).json({ message: "Неправильное значение id пользователя" });
            await PlayService.registrUserToPlay({ playId: playId, userId: userId })
            return res.json({ message: "Пользователь добавлен" });
        } catch (error: any) {
            next(error)
        }
    };
    async minusUser(req: Request, res: Response, next: NextFunction) {
        try {
            const playId = parseInt(req.params.id);
            const { userId }: { userId: number } = req.body;
            if (isNaN(playId))
                return res.status(401).json({ message: "Неправильное значение id" });
            if (isNaN(userId))
                return res.status(401).json({ message: "Неправильное значение id пользователя" });
            await PlayService.unRegistrUserToPlay({ playId: playId, userId: userId })
            return res.json({ message: "Пользователь удален" });
        } catch (error: any) {
            next(error)
        }
    };

}

export default new PlayController();