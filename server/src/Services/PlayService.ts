
import ApiError from '../Exeptions/ApiError';
import { UploadedFile } from 'express-fileupload';
import FileService from './FileService';
import PlayRepository from '../Repositiories/PlayRepository';
import GameRepository from '../Repositiories/GameRepository';
import UserRepository from '../Repositiories/UserRepository';
import { PlaySetting } from '../Types/PlaySetting';
import { PlayUpdate } from '../Types/PlayUpdate';

class PlayService {
    async getMasterId({ playId }: { playId: number }) {
        if (isNaN(playId))
            throw ApiError.BadRequest({ status: 461, message: "Неправильное значение id" });
        const masterId = (await PlayRepository.getPlayInfoById({ id: playId }))?.masterid;
        if (!masterId)
            throw ApiError.BadRequest({ status: 460, message: "Игры не существует" })
        return Number(masterId);
    }
    async getPlayInfoById({ id }: { id: number }) {
        if (isNaN(id))
            throw ApiError.BadRequest({ status: 461, message: "Неправильное значение id" });
        const play = await PlayRepository.getPlayInfoById({ id: id });
        if (!play)
            throw ApiError.BadRequest({ status: 460, message: "Игры не существует" })
        return play;
    }
    async getPlayList({ setting, filter }: PlaySetting) {
        if (isNaN(setting.start) || setting.start < 0)
            setting.start = 0
        if (isNaN(setting.count) || setting.count < 0 || setting.count > 20)
            setting.count = 20
        //TODO: реализовать фильт поиска
        return await PlayRepository.getPlayList({ setting: setting, filter: filter });
    }
    async deletePlay({ id }: { id: number }): Promise<boolean> {
        if (isNaN(id))
            throw ApiError.BadRequest({ status: 461, message: "Неправильное значение id" });
        return PlayRepository.deletePlay({ id: id });
    }
    async changeGamesOnPlay({ playId, games }: { playId: number, games: number[] }): Promise<boolean> {
        const gamesOnPlay = await PlayRepository.getGamesOnPlay({ playId: playId });
        let isChanges = false;
        for (let game of gamesOnPlay) {
            if (!games.includes(game)) {
                isChanges = true;
                await PlayRepository.deleteGameOfPlay({ playId: playId, gameId: game });
            }
        }
        for (let game of games) {
            if (!gamesOnPlay.includes(game)) {
                isChanges = true;
                await PlayRepository.addGameOfPlay({ playId: playId, gameId: game });
            }
        }
        return isChanges;
    }
    async updatePlay({ id, update, image }: { id: number, update: PlayUpdate, image?: UploadedFile | undefined }): Promise<boolean> {
        if (isNaN(id))
            throw ApiError.BadRequest({ message: "Неправильное значение id" })
        if (!(await PlayRepository.isPlayExists({ id: id })))
            throw ApiError.BadRequest({ status: 471, message: "Игротеки не существует" })
        let maybeOne = false, meybeGame = false;
        const updateParametrs = ['name', 'masterId', 'minplayers', 'maxplayers', 'description', 'status', 'datestart', 'dateend']
        for (let per of updateParametrs) if (update[per as keyof PlayUpdate]) { maybeOne = true; break; }
        //Обновляем игры
        if (update.games) meybeGame = await (new PlayService).changeGamesOnPlay({ playId: id, games: update.games });
        //Обновляем инфу
        if (maybeOne) await PlayRepository.updatePlay({ id: id, update: update })
        //Обновляем картинку
        if (image) await FileService.saveFile({ file: image as UploadedFile, fileName: 'play_' + id + '.png' })
        if (!maybeOne && meybeGame) return false; else return true;
    }
    async createPlay({ createInf, image }: { createInf: PlayUpdate, image?: UploadedFile | undefined }): Promise<number | boolean[]> {
        if (!createInf.name)
            throw ApiError.BadRequest({ message: "Отсутствует обязательный параметр name" })
        if (createInf.games && createInf.games.length > 0) {
            let thr = false;
            const isGamesExists = await Promise.all(createInf.games.map(async gameId => {
                const bool = await GameRepository.isGameExists({ id: gameId });
                if (!bool) thr = true;
                return bool;
            }))
            if (thr)
                return isGamesExists;
        }
        const newId = await PlayRepository.createPlay({ createInf: createInf });
        if (!newId)
            throw ApiError.BadRequest({ status: 460, message: "Не удалось создать игру" })
        if (createInf.games && createInf.games?.length > 0)
            (new PlayService).updatePlay({ id: newId, update: { games: createInf.games } as PlayUpdate })
        if (image)
            await FileService.saveFile({ file: image as UploadedFile, fileName: 'play_' + newId + '.png' })
        return newId;
    }
    async registrUserToPlay({ playId, userId }: { playId: number, userId: number }): Promise<boolean> {
        if (isNaN(playId))
            throw ApiError.BadRequest({ status: 460, message: "Неправильное значение id" });
        if (isNaN(userId))
            throw ApiError.BadRequest({ status: 461, message: "Неправильное значение id пользователя" });
        if (!(await PlayRepository.isPlayExists({ id: playId })))
            throw ApiError.BadRequest({ status: 471, message: "Игротеки не существует" })
        if (!(await UserRepository.isUserExists({ id: userId })))
            throw ApiError.BadRequest({ status: 470, message: "Пользователя не существует" })
        if (await PlayRepository.isUserOnPlay({ playId: playId, userId: userId }))
            throw ApiError.BadRequest({ message: 'Пользователь уже записан на игротеку' });
        if (await PlayRepository.isPlayMax({ playId: playId }))
            throw ApiError.BadRequest({ message: 'Мест нет' })
        return await PlayRepository.addGamerToPlay({ playId: playId, userId: userId })
    }
    async unRegistrUserToPlay({ playId, userId }: { playId: number, userId: number }): Promise<boolean> {
        if (isNaN(playId))
            throw ApiError.BadRequest({ status: 460, message: "Неправильное значение id" });
        if (isNaN(userId))
            throw ApiError.BadRequest({ status: 461, message: "Неправильное значение id пользователя" });
        if (!(await PlayRepository.isPlayExists({ id: playId })))
            throw ApiError.BadRequest({ status: 471, message: "Игротеки не существует" })
        if (!(await UserRepository.isUserExists({ id: userId })))
            throw ApiError.BadRequest({ status: 470, message: "Пользователя не существует" })
        if (!(await PlayRepository.isUserOnPlay({ playId: playId, userId: userId })))
            throw ApiError.BadRequest({ message: 'Пользователь не записан на игротеку' });
        return await PlayRepository.deleteGamerofPlay({ playId: playId, userId: userId })
    }
    async getPlaysGamer({ id }: { id: number }) {
        if (isNaN(id))
            throw ApiError.BadRequest({ status: 460, message: 'Неправильное значение id пользователя' });
        if (!(await UserRepository.isUserExists({ id: id })))
            throw ApiError.BadRequest({ status: 470, message: "Пользователя не существует" })
        const playsId = await PlayRepository.getAllGamersPlays({ gamerId: id });
        const plays = await Promise.all(playsId.map(async playId => {
            const playInfo = await PlayRepository.getPlayInfoById({ id: playId });
            const masterName = (await UserRepository.getUserInfoById({ id: playInfo.masterid, MODE: "forAll" })).nickname;
            const gamersCount = (await PlayRepository.getGamesOnPlay({ playId: id }))
            return {
                id: playId,
                name: playInfo.name,
                description: playInfo.description,
                master: {
                    id: playInfo.masterid,
                    name: masterName
                },
                players: {
                    count: gamersCount,
                    min: playInfo.minplayers,
                    max: playInfo.maxplayers
                },
                status: {
                    status: playInfo.status,
                    dateStart: playInfo.datestart,
                    dateEnd: playInfo.dateend
                }
            }
        }))
        return plays;
    }
    async getPlaysMaster({ id }: { id: number }) {
        if (isNaN(id))
            throw ApiError.BadRequest({ status: 460, message: 'Неправильное значение id пользователя' });
        if (!(await UserRepository.isMasterExists({ id: id })))
            throw ApiError.BadRequest({ status: 473, message: "Мастера не существует" })
        const playsId = await PlayRepository.getAllMastersPlays({ masterId: id })
        const plays = await Promise.all(playsId.map(async id => {
            const inf = await PlayRepository.getPlayInfoById({ id: id });
            const gamers = await PlayRepository.getAllGamersInfoOnPlays({ playId: inf.id });
            return {
                id: inf.id,
                name: inf.name,
                description: inf.description,
                players: {
                    list: gamers,
                    min: inf.minplayers,
                    max: inf.maxplayers
                },
                status: {
                    status: inf.status,
                    dateStart: inf.datestart,
                    dateEnd: inf.dateend
                }
            }
        }))
        return plays;
    }
}

export default new PlayService();