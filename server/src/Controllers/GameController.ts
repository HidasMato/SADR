
import { Request, Response, response } from 'express';
import { NoticeMessage } from 'pg-protocol/dist/messages';
import GameService from '../Services/GameService';
type update = {
    name: string | undefined,
    minPlayers: number | undefined,
    maxPlayers: number | undefined,
    minTimePlay: number | undefined,
    maxTimePlay: number | undefined,
    hardless: number | undefined,
    description: string | undefined,
    img: string | undefined
}


class GameController {
    returnError(Error: Error, req: Request, res: Response) {
        console.log(Error);
        return res.status(401).json(Error.message);
    }
    async getList(req: Request, res: Response): Promise<Response> {
        try {
            const setting: { start: number, count: number } = req.body;
            const filter = req.query;
            const arrGame = await GameService.getGameList({ settingList: setting, filter: filter });
            if (arrGame.length == 0)
                return res.status(403).json({ message: "В базе данных больше нет игр" });
            return res.status(200).json(arrGame);
        } catch (error: any) {
            console.error(error);
            return res.status(500).json('Ошибка выборки');
        }
    }
    async getOneInfo(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            const response = await GameService.getGameInfoById({ id });
            if (!response)
                return res.status(402).json({ message: "Нет такого id в базе" });
            return res.status(200).json(response);
        } catch (error: any) {
            console.error(error);
            return res.status(500).json('Ошибка выборки');
        }
    }
    async create(req: Request, res: Response): Promise<Response> {
        try {
            const create: update = req.body;
            const result = await GameService.create({ createInf: create });
            return res.status(200).json({ redirectionId: result });
        } catch (error: any) {
            return (new GameController).returnError(error, req, res)
        }
    };
    async update(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            const update: update = req.body;
            await GameService.update({ id: id, update: update })
            return res.status(200).json({ message: "Изменение успешно" });
        } catch (error: any) {
            return (new GameController).returnError(error, req, res)
        }
    };
    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                return res.status(401).json({ message: "Неправильное значение id" });
            const result = await GameService.delete({ id });
            if (result != 0)
                return res.status(200).json({ message: "Удаление успешно" });
            else
                return res.status(401).json({ message: "Удаление не произошло" });
        } catch (error: any) {
            return (new GameController).returnError(error, req, res)
        }
    };

}

export default new GameController;