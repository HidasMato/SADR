import ApiError from "../Exeptions/ApiError";
import GameRepository from "../Repositiories/GameRepository";
import PlayRepository from "../Repositiories/PlayRepository";
import UserRepository from "../Repositiories/UserRepository";
import { AdminRigths } from "../Types/AdminRights";
import { Roles } from "../Types/Roles";
import PlayService from "./PlayService";

class RigthsService {
    isHaveAccessOr({ roles, accessArray }: { roles: Roles; accessArray: ("gamer" | "master" | "admin")[] }): boolean {
        //Кто имеет доступ
        //Должна быть хотя бы одна роль в accessArray, которая есть в roles
        for (let role of accessArray) if (roles[role as keyof Roles]) return true;
        return false;
    }
    isHaveAccessAnd({ roles, accessArray }: { roles: Roles; accessArray: ("gamer" | "master" | "admin")[] }): boolean {
        //Кто имеет доступ
        //Должны быть все роли в accessArray, которые есть в roles
        for (let role of accessArray) if (!roles[role as keyof Roles]) return false;
        return true;
    }
    forAdmin({ roles }: { roles: Roles }): boolean {
        return this.isHaveAccessOr({ roles: roles, accessArray: ["admin"] });
    }
    forMaster({ roles }: { roles: Roles }): boolean {
        return this.isHaveAccessOr({ roles: roles, accessArray: ["master"] });
    }
    forGamer({ roles }: { roles: Roles }): boolean {
        return this.isHaveAccessOr({ roles: roles, accessArray: ["gamer"] });
    }
    forGamerOrMaster({ roles }: { roles: Roles }): boolean {
        return this.isHaveAccessOr({ roles: roles, accessArray: ["gamer", "master"] });
    }
    forGamerOrAdmin({ roles }: { roles: Roles }): boolean {
        return this.isHaveAccessOr({ roles: roles, accessArray: ["gamer", "admin"] });
    }
    forMasterOrAdmin({ roles }: { roles: Roles }): boolean {
        return this.isHaveAccessOr({ roles: roles, accessArray: ["master", "admin"] });
    }
    forGamerOrMasterOrAdmin({ roles }: { roles: Roles }): boolean {
        return this.isHaveAccessOr({ roles: roles, accessArray: ["gamer", "master", "admin"] });
    }
    forGamerAndMaster({ roles }: { roles: Roles }): boolean {
        return this.isHaveAccessAnd({ roles: roles, accessArray: ["gamer", "master"] });
    }
    forGamerAndAdmin({ roles }: { roles: Roles }): boolean {
        return this.isHaveAccessAnd({ roles: roles, accessArray: ["gamer", "admin"] });
    }
    forMasterAndAdmin({ roles }: { roles: Roles }): boolean {
        return this.isHaveAccessAnd({ roles: roles, accessArray: ["master", "admin"] });
    }
    forGamerAndMasterAndAdmin({ roles }: { roles: Roles }): boolean {
        return this.isHaveAccessAnd({ roles: roles, accessArray: ["gamer", "master", "admin"] });
    }
    async canICreateGame({ userId, roles }: { roles: Roles; userId: number }): Promise<boolean> {
        if (this.forAdmin({ roles: roles }) && (await UserRepository.getAdminRigths({ id: userId }))?.creategame) return true;
        return false;
    }
    async canIChangeGame({ userId, roles }: { roles: Roles; userId: number }): Promise<boolean> {
        if (this.forAdmin({ roles: roles }) && (await UserRepository.getAdminRigths({ id: userId }))?.changegame) return true;
        return false;
    }
    async canIDeleteGame({ userId, roles }: { roles: Roles; userId: number }): Promise<boolean> {
        if (this.forAdmin({ roles: roles }) && (await UserRepository.getAdminRigths({ id: userId }))?.deletegame) return true;
        return false;
    }
    async canICreatePlay({ userId, roles }: { roles: Roles; userId: number }): Promise<boolean> {
        if ((this.forAdmin({ roles: roles }) && (await UserRepository.getAdminRigths({ id: userId }))?.createplay) || this.forMaster({ roles: roles })) return true;
        return false;
    }
    async canIGoToPlay({ userId, roles, playId }: { roles: Roles; userId: number; playId: number }): Promise<number> {
        //0 - я не могу взаимодействовать
        //1 - могу записаться
        //2 - могу отписаться
        if ((this.forMaster({ roles: roles }) && (await PlayService.isPlaysMasterPlay({ playId: playId, masterId: userId }))) || (await PlayService.getPlayInfoById({ id: playId })).status.dateStart < new Date()) return 0;
        if (await PlayRepository.isUserOnPlay({ playId: playId, userId: userId })) return 2;
        else return 1;
    }
    async canIChangePlay({ userId, roles, playId }: { roles: Roles; userId: number; playId: number }): Promise<boolean> {
        if ((this.forMaster({ roles: roles }) && (await PlayService.isPlaysMasterPlay({ playId: playId, masterId: userId }))) || (this.forAdmin({ roles: roles }) && (await UserRepository.getAdminRigths({ id: userId }))?.changeplay))
            return true;
        return false;
    }
    async canIDeletePlay({ userId, roles }: { roles: Roles; userId: number }): Promise<boolean> {
        if (this.forAdmin({ roles: roles }) && (await UserRepository.getAdminRigths({ id: userId }))?.deleteplay) return true;
        return false;
    }
    async canIDisactivePlay({ userId, roles }: { roles: Roles; userId: number }): Promise<boolean> {
        if (this.forAdmin({ roles: roles }) && (await UserRepository.getAdminRigths({ id: userId }))?.disactivplay) return true;
        return false;
    }
    async canIGiveMasterRights({ userId, roles }: { roles: Roles; userId: number }): Promise<boolean> {
        if (this.forAdmin({ roles: roles }) && (await UserRepository.getAdminRigths({ id: userId }))?.masterrights) return true;
        return false;
    }
    async IAmMainAdmin({ userId, roles }: { roles: Roles; userId: number }): Promise<boolean> {
        if (this.forAdmin({ roles: roles }) && (await UserRepository.getAdminRigths({ id: userId }))?.mainadmin) return true;
        return false;
    }
    async haveIMasterPanel({ roles }: { roles: Roles }): Promise<boolean> {
        if (this.forMaster({ roles: roles })) return true;
        return false;
    }
    async getAllAdminsRigths({ id }: { id: number }): Promise<AdminRigths> {
        if (isNaN(id)) throw ApiError.BadRequest({ message: "Неверное значение id пользователя" });
        return UserRepository.getAdminRigths({ id: id });
    }
    async haveIAdminPanel({ roles, userId }: { roles: Roles; userId: number }): Promise<boolean> {
        if (this.forAdmin({ roles: roles }) && (await UserRepository.getAdminRigths({ id: userId }))?.mainadmin) return true;
        return false;
    }
    async canICommentPlay({ userId, playId }: { userId: number; playId: number }): Promise<boolean> {
        const play = await PlayRepository.getPlayInfoById({ id: playId });
        if (
            (await PlayRepository.getGamersOnPlay({ playId: playId })).find((v) => {
                return v == userId;
            }) &&
            play.dateend < new Date() &&
            play.status &&
            !(await PlayRepository.haveIComment({ gamerId: userId, playId: playId }))
        )
            return true;
        return false;
    }
    async canICommentGame({ userId, gameId }: { userId: number; gameId: number }): Promise<boolean> {
        //Найти вс е игры в которые играл пользователь
        console.log(await GameRepository.canIComment({ gameId: gameId, userId: userId }));
        console.log(!(await GameRepository.haveIComment({ gamerId: userId, gameId: gameId })));
        if ((await GameRepository.canIComment({ gameId: gameId, userId: userId })) && !(await GameRepository.haveIComment({ gamerId: userId, gameId: gameId }))) return true;
        return false;
    }
    async canICommentMaster({ userId, masterId }: { userId: number; masterId: number }): Promise<boolean> {
        const user = await UserRepository.getUserInfoById({ id: userId, MODE: "forAll" });
        if (!(await UserRepository.haveIComment({ gamerId: userId, masterId: masterId }))) return true;
        return false;
    }
}

export default new RigthsService();
