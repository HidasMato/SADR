import ApiError from "../Exeptions/ApiError";
import { UploadedFile } from "express-fileupload";
import FileService from "./FileService";
import PlayRepository from "../Repositiories/PlayRepository";
import GameRepository from "../Repositiories/GameRepository";
import UserRepository from "../Repositiories/UserRepository";
import { PlaySetting } from "../Types/PlaySetting";
import { PlayCreate } from "../Types/PlayCreate";

class PlayService {
    async getMasterId({ playId }: { playId: number }) {
        if (isNaN(playId))
            throw ApiError.BadRequest({
                status: 461,
                message: "Неправильное значение id",
            });
        const masterId = (await PlayRepository.getPlayInfoById({ id: playId }))?.masterid;
        if (!masterId)
            throw ApiError.BadRequest({
                status: 460,
                message: "Игры не существует",
            });
        return Number(masterId);
    }
    async getPlayInfoById({ id }: { id: number }) {
        if (isNaN(id))
            throw ApiError.BadRequest({
                status: 461,
                message: "Неправильное значение id",
            });
        const play = await PlayRepository.getPlayInfoById({ id: id });
        if (!play)
            throw ApiError.BadRequest({
                status: 460,
                message: "Игры не существует",
            });
        const gamersCount = await PlayRepository.getGamersOnPlay({
            playId: Number(play.id),
        });
        const games = await PlayRepository.getGamesOnPlay({ playId: id });
        return {
            id: play.id,
            name: play.name,
            master: { id: play.masterid, name: play.mastername },
            description: play.description,
            players: {
                count: gamersCount.length,
                min: play.minplayers,
                max: play.maxplayers,
            },
            games: games,
            status: {
                status: play.status,
                dateStart: play.datestart,
                dateEnd: play.dateend,
            },
        };
    }
    async getPlayList({ setting, filter }: PlaySetting) {
        if (setting.page == undefined) setting.page = 1;
        else if (isNaN(setting.page) || setting.page < 1) setting.page = 1;
        if (filter.masterid != undefined)
            if (isNaN(filter.masterid)) filter.masterid = undefined;
            else filter.masterid = Number(filter.masterid);
        if (filter.freeplace != undefined)
            if (isNaN(filter.freeplace)) filter.freeplace = undefined;
            else filter.freeplace = Number(filter.freeplace);
        const plays = await PlayRepository.getPlayList({
            setting: setting,
            filter: filter,
        });
        return {
            plays: await Promise.all(
                plays.plays.map(async (play) => {
                    const masterName = (
                        await UserRepository.getUserInfoById({
                            id: play.masterid,
                            MODE: "forAll",
                        })
                    ).name;
                    const gamersCount = await PlayRepository.getGamersOnPlay({
                        playId: Number(play.id),
                    });
                    return {
                        id: play.id,
                        name: play.name,
                        master: { id: play.masterid, name: masterName },
                        players: {
                            count: gamersCount.length,
                            min: play.minplayers,
                            max: play.maxplayers,
                        },
                        status: {
                            status: play.status,
                            dateStart: play.datestart,
                            dateEnd: play.dateend,
                        },
                    };
                }),
            ),
            count: plays.count,
        };
    }
    async deletePlay({ id }: { id: number }): Promise<boolean> {
        if (isNaN(id))
            throw ApiError.BadRequest({
                status: 461,
                message: "Неправильное значение id",
            });
        return PlayRepository.deletePlay({ id: id });
    }
    async changeGamesOnPlay({ playId, games }: { playId: number; games: number[] }) {
        const gamesOnPlay = await PlayRepository.getGamesIdOnPlay({ playId: playId });
        for (let game of gamesOnPlay) if (!games.includes(game)) await PlayRepository.deleteGameOfPlay({ playId: playId, gameId: game });
        for (let game of games) if (!gamesOnPlay.includes(game)) await PlayRepository.addGameOfPlay({ playId: playId, gameId: game });
    }
    async changeCreatePlay({ id, inf, image }: { id?: number; inf: PlayCreate; image?: UploadedFile | undefined }): Promise<number | boolean[]> {
        if (id !== undefined) {
            if (isNaN(id)) throw ApiError.BadRequest({ message: "Неправильное значение id" });
            if (!(await PlayRepository.isPlayExists({ id: id }))) throw ApiError.BadRequest({ status: 471, message: "Игротеки не существует" });
        }
        if (inf.name === undefined || inf.name === "") throw ApiError.BadRequest({ message: "Отсутствует обязательный параметр name" });
        //Проверить, что имя уникально?
        if (isNaN(inf.masterId)) throw ApiError.BadRequest({ message: "Мастер не выбран" });
        if (isNaN(inf.minplayers)) throw ApiError.BadRequest({ message: "Минимальное количество игроков не определено" });
        if (isNaN(inf.maxplayers)) throw ApiError.BadRequest({ message: "Максимальное количество игроков не определено" });
        if (inf.minplayers >= inf.maxplayers) throw ApiError.BadRequest({ message: "Неверно указано количество игроков" });
        if (inf.datestart == undefined) throw ApiError.BadRequest({ message: "Дата начала не определена" });
        if (inf.dateend == undefined) throw ApiError.BadRequest({ message: "Дата окончания не определена" });
        if (inf.dateend.valueOf() - inf.datestart.valueOf() < 1000 * 60 * 60 * 1) throw ApiError.BadRequest({ message: "Длительность игротеки меньше часа" });
        if (inf.dateend.valueOf() - inf.datestart.valueOf() > 1000 * 60 * 60 * 24) throw ApiError.BadRequest({ message: "Длительность игротеки больше дня" });
        if (inf.description == undefined) throw ApiError.BadRequest({ message: "Описание неверно" });
        if (inf.status == undefined) throw ApiError.BadRequest({ message: "Беда со статусом" });
        if (inf.games.length > 0) {
            let thr = false;
            const isGamesExists = await Promise.all(
                inf.games.map(async (gameId) => {
                    const bool = await GameRepository.isGameExists({ id: gameId });
                    if (!bool) thr = true;
                    return { exists: bool, id: gameId };
                }),
            );
            if (thr) throw ApiError.BadRequest({ status: 462, message: "Игры не найдены", errors: isGamesExists });
        }
        if (id == undefined) {
            id = await PlayRepository.createPlay({ create: inf });
            if (!id) throw ApiError.BadRequest({ status: 460, message: "Не удалось создать игру" });
        } else {
            if (!(await PlayRepository.updatePlay({ id: id, update: inf }))) throw ApiError.BadRequest({ status: 460, message: "Не удалось изменить игру" });
        }
        await this.changeGamesOnPlay({ playId: id, games: inf.games });
        if (image) await FileService.saveFile({ file: image as UploadedFile, fileName: id + "", folder: "plays" });
        return id;
    }
    async registrUserToPlay({ playId, userId }: { playId: number; userId: number }): Promise<boolean> {
        if (isNaN(playId))
            throw ApiError.BadRequest({
                status: 460,
                message: "Неправильное значение id",
            });
        if (isNaN(userId))
            throw ApiError.BadRequest({
                status: 461,
                message: "Неправильное значение id пользователя",
            });
        if (!(await PlayRepository.isPlayExists({ id: playId })))
            throw ApiError.BadRequest({
                status: 471,
                message: "Игротеки не существует",
            });
        const user = await UserRepository.getUserInfoById({ id: userId, MODE: "sequrity" });
        if (!user)
            throw ApiError.BadRequest({
                status: 470,
                message: "Пользователя не существует",
            });
        if (!user.mailveryfity)
            throw ApiError.BadRequest({
                status: 470,
                message: "Почта не подтвверждена",
            });
        if (
            await PlayRepository.isUserOnPlay({
                playId: playId,
                userId: userId,
            })
        )
            throw ApiError.BadRequest({
                message: "Пользователь уже записан на игротеку",
            });
        if (await PlayRepository.isPlayMax({ playId: playId })) throw ApiError.BadRequest({ message: "Мест нет" });
        return await PlayRepository.addGamerToPlay({
            playId: playId,
            userId: userId,
        });
    }
    async unRegistrUserToPlay({ playId, userId }: { playId: number; userId: number }): Promise<boolean> {
        if (isNaN(playId))
            throw ApiError.BadRequest({
                status: 460,
                message: "Неправильное значение id",
            });
        if (isNaN(userId))
            throw ApiError.BadRequest({
                status: 461,
                message: "Неправильное значение id пользователя",
            });
        if (!(await PlayRepository.isPlayExists({ id: playId })))
            throw ApiError.BadRequest({
                status: 471,
                message: "Игротеки не существует",
            });
        if (!(await UserRepository.isUserExists({ id: userId })))
            throw ApiError.BadRequest({
                status: 470,
                message: "Пользователя не существует",
            });
        if (
            !(await PlayRepository.isUserOnPlay({
                playId: playId,
                userId: userId,
            }))
        )
            throw ApiError.BadRequest({
                message: "Пользователь не записан на игротеку",
            });
        return await PlayRepository.deleteGamerofPlay({
            playId: playId,
            userId: userId,
        });
    }
    async getPlaysGamer({ id }: { id: number }) {
        if (isNaN(id))
            throw ApiError.BadRequest({
                status: 460,
                message: "Неправильное значение id пользователя",
            });
        if (!(await UserRepository.isUserExists({ id: id })))
            throw ApiError.BadRequest({
                status: 470,
                message: "Пользователя не существует",
            });
        const playsId = await PlayRepository.getAllGamersPlays({ gamerId: id });
        const plays = await Promise.all(
            playsId.map(async (playId) => {
                const playInfo = await PlayRepository.getPlayInfoById({
                    id: playId,
                });
                const masterName = (
                    await UserRepository.getUserInfoById({
                        id: playInfo.masterid,
                        MODE: "forAll",
                    })
                ).name;
                const gamersCount = await PlayRepository.getGamersOnPlay({
                    playId: id,
                });
                return {
                    id: playId,
                    name: playInfo.name,
                    description: playInfo.description,
                    master: {
                        id: playInfo.masterid,
                        name: masterName,
                    },
                    players: {
                        count: gamersCount.length,
                        min: playInfo.minplayers,
                        max: playInfo.maxplayers,
                    },
                    status: {
                        status: playInfo.status,
                        dateStart: playInfo.datestart,
                        dateEnd: playInfo.dateend,
                    },
                };
            }),
        );
        return plays;
    }
    async getPlaysMaster({ id }: { id: number }) {
        if (isNaN(id))
            throw ApiError.BadRequest({
                status: 460,
                message: "Неправильное значение id пользователя",
            });
        if (!(await UserRepository.isMasterExists({ id: id })))
            throw ApiError.BadRequest({
                status: 473,
                message: "Мастера не существует",
            });
        const playsId = await PlayRepository.getAllMastersPlays({
            masterId: id,
        });
        const plays = await Promise.all(
            playsId.map(async (id) => {
                const inf = await PlayRepository.getPlayInfoById({ id: id });
                const gamers = await PlayRepository.getAllGamersInfoOnPlays({
                    playId: inf.id,
                });
                return {
                    id: inf.id,
                    name: inf.name,
                    description: inf.description,
                    players: {
                        list: gamers,
                        min: inf.minplayers,
                        max: inf.maxplayers,
                    },
                    status: {
                        status: inf.status,
                        dateStart: inf.datestart,
                        dateEnd: inf.dateend,
                    },
                };
            }),
        );
        return plays;
    }
    async isPlaysMasterPlay({ playId, masterId }: { playId: number; masterId: number }) {
        if (isNaN(playId))
            throw ApiError.BadRequest({
                status: 461,
                message: "Неправильное значение id",
            });
        if (isNaN(masterId))
            throw ApiError.BadRequest({
                status: 461,
                message: "Неправильное значение id",
            });
        return await PlayRepository.isPlaysMasterPlay({ playId, masterId });
    }
    async getPlaysGame({ id }: { id: number }) {
        if (isNaN(id))
            throw ApiError.BadRequest({
                status: 461,
                message: "Неправильное значение id",
            });
        return (await PlayRepository.getPlaysGame({ id })).map((play: any) => {
            return {
                id: play.id,
                name: play.name,
                master: { id: play.masterid, name: play.mastername },
                players: {
                    count: play.playerscount,
                    min: play.minplayers,
                    max: play.maxplayers,
                },
                status: {
                    status: play.status,
                    dateStart: play.datestart,
                    dateEnd: play.dateend,
                },
            };
        });
    }
}

export default new PlayService();
