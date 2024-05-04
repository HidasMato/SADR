import ApiError from "../Exeptions/ApiError";
import { UploadedFile } from "express-fileupload";
import FileService from "./FileService";
import GameRepository from "../Repositiories/GameRepository";
import { GameSetting } from "../Types/GameSetting";
import { GameUpdate } from "../Types/GameUpdate";

class GameService {
    async getGameList({ setting, filter }: GameSetting) {
        if (setting.page == undefined) setting.page = 1;
        else if (isNaN(setting.page) || setting.page < 1) setting.page = 1;
        if (filter.hardless != undefined)
            if (isNaN(filter.hardless)) filter.hardless = undefined;
            else filter.hardless = Number(filter.hardless);
        if (filter.player != undefined)
            if (isNaN(filter.player)) filter.player = undefined;
            else filter.player = Number(filter.player);
        if (filter.time != undefined)
            if (isNaN(filter.time)) filter.time = undefined;
            else filter.time = Number(filter.time);
        return await GameRepository.getGameList({
            setting: setting,
            filter: filter,
        });
    }
    async getAllGames() {
        return await GameRepository.getAllGame();
    }
    async getGameInfoById({ id }: { id: number }) {
        if (isNaN(id))
            throw ApiError.BadRequest({
                status: 460,
                message: "Неправильное значение id",
            });
        const game = await GameRepository.getGameInfoById({ id: id });
        if (!game)
            throw ApiError.BadRequest({
                status: 460,
                message: "Нет такого id в базе",
            });
        return game;
    }
    async delete({ id }: { id: number }) {
        if (isNaN(id))
            throw ApiError.BadRequest({
                status: 461,
                message: "Неправильное значение id",
            });
        if (!(await GameRepository.isGameExists({ id: id })))
            throw ApiError.BadRequest({
                status: 462,
                message: "Игры не существует",
            });
        const isTrue = await GameRepository.deleteGame({ id: id });
        if (!isTrue)
            throw ApiError.BadRequest({
                status: 460,
                message: "Не удалось удалить",
            });
    }
    async update({ id, update, image }: { id: number; update: GameUpdate; image: UploadedFile | undefined }) {
        //TODO: Вставить проверку уникальности имени
        if (isNaN(id))
            throw ApiError.BadRequest({
                status: 461,
                message: "Неправильное значение id",
            });
        if (!(await GameRepository.isGameExists({ id: id })))
            throw ApiError.BadRequest({
                status: 462,
                message: "Игры не существует",
            });
        let maybeOne = false;
        for (let per in update) {
            if (update[per as keyof GameUpdate]) {
                maybeOne = true;
                break;
            }
        }
        if (!maybeOne)
            throw ApiError.BadRequest({
                message: "Нет параметров для редактирования",
            });
        const isTrue = GameRepository.updateGame({ id: id, update: update });
        if (!isTrue)
            throw ApiError.BadRequest({
                status: 472,
                message: "Не удалось обновить",
            });
        if (image)
            await FileService.saveFile({
                file: image as UploadedFile,
                fileName: id + "",
                folder: "games",
            });
    }
    async create({ createInf, image }: { createInf: GameUpdate; image?: UploadedFile | undefined }) {
        if (!createInf.name)
            throw ApiError.BadRequest({
                message: "Отсутствует обязательный параметр name",
            });
        //TODO: Вставить проверку уникальности имени
        const newId = await GameRepository.createGame({ createInf: createInf });
        if (image)
            await FileService.saveFile({
                file: image as UploadedFile,
                fileName: newId + "",
                folder: "games",
            });
        return newId;
    }
}

export default new GameService();
