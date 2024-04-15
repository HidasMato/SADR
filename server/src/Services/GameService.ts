import ApiError from '../Exeptions/ApiError';
import { UploadedFile } from 'express-fileupload';
import FileService from './FileService';
import GameRepository from '../Repositiories/GameRepository';

type getList = {
    setting: {
        start: number,
        count: number
    },
    filter: {}
}
type update = {
    name: string | undefined,
    minplayers: number | undefined,
    maxplayers: number | undefined,
    mintimeplay: number | undefined,
    maxtimeplay: number | undefined,
    hardless: number | undefined,
    description: string | undefined
}

class GameService {
    async getGameList({ setting, filter }: getList) {
        if (isNaN(setting.start) || setting.start < 0)
            setting.start = 0
        if (isNaN(setting.count) || setting.count < 0 || setting.count > 20)
            setting.count = 20
        //TODO: реализовать фильт поиска
        return await GameRepository.getGameList({ setting: setting, filter: filter });
    }
    async getGameInfoById({ id }: { id: number }) {
        if (isNaN(id))
            throw ApiError.BadRequest({ status: 460, message: "Неправильное значение id" })
        const game = await GameRepository.getGameInfoById({ id: id })
        if (!game)
            return ApiError.BadRequest({ status: 460, message: "Нет такого id в базе" });
        return game;
    }
    async delete({ id }: { id: number }) {
        if (isNaN(id))
            throw ApiError.BadRequest({ status: 461, message: "Неправильное значение id" })
        if (await GameRepository.isGameExists({ id: id }))
            throw ApiError.BadRequest({ status: 462, message: "Игры не существует" })
        const isTrue = GameRepository.deleteGame({ id: id });
        if (!isTrue)
            throw ApiError.BadRequest({ status: 460, message: "Не удалось удалить" })
    }
    async update({ id, update, image }: { id: number, update: update, image: UploadedFile | undefined }) {
        if (isNaN(id))
            throw ApiError.BadRequest({ status: 461, message: "Неправильное значение id" })
        if (await GameRepository.isGameExists({ id: id }))
            throw ApiError.BadRequest({ status: 462, message: "Игры не существует" })
        let maybeOne = false;
        for (let per in update) { if (update[per as keyof update]) { maybeOne = true; break; } }
        if (!maybeOne)
            throw ApiError.BadRequest({ message: "Нет параметров для редактирования" })
        const isTrue = GameRepository.updateGame({ id: id, update: update });
        if (!isTrue)
            throw ApiError.BadRequest({ status: 472, message: "Не удалось обновить" })
        if (image)
            await FileService.saveFile({ file: image as UploadedFile, fileName: 'game_' + id + '.png' })
    }
    async create({ createInf, image }: { createInf: update, image?: UploadedFile | undefined }) {
        if (!createInf.name)
            throw ApiError.BadRequest({ message: "Отсутствует обязательный параметр name" })
        const newId = await GameRepository.createGame({ createInf: createInf });
        if (image)
            await FileService.saveFile({ file: image as UploadedFile, fileName: 'game_' + newId + '.png' })
        return newId;
    }
}

export default new GameService();