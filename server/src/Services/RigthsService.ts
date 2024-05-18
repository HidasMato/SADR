import PlayRepository from "../Repositiories/PlayRepository";
import UserRepository from "../Repositiories/UserRepository";
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
        if (this.forMaster({ roles: roles }) && (await PlayService.isPlaysMasterPlay({ playId: playId, masterId: userId }))) return 0;
        if (await PlayRepository.isUserOnPlay({ playId: playId, userId: userId })) return 2;
        else return 1;
    }
    async canIChangePlay({ userId, roles, playId }: { roles: Roles; userId: number; playId: number }): Promise<boolean> {
        if ((this.forMaster({ roles: roles as Roles }) && (await PlayService.isPlaysMasterPlay({ playId: playId, masterId: userId }))) || (this.forAdmin({ roles: roles as Roles }) && (await UserRepository.getAdminRigths({ id: userId }))?.changeplay))
            // Иммитация, что у админа есть возможность редактировать игротеки и у мастера айди совпадает с игротекой
            return true;
        return false;
    }
    async canIDeletePlay({ userId, roles }: { roles: Roles; userId: number}): Promise<boolean> {
        if (this.forAdmin({ roles: roles as Roles }) && (await UserRepository.getAdminRigths({ id: userId }))?.deleteplay)
            // Иммитация, что у админа есть возможность редактировать игротеки
            return true;
        return false;
    }
    async haveIMasterPanel({ roles }: { roles: Roles }): Promise<boolean> {
        if (this.forMaster({ roles: roles as Roles })) return true;
        return false;
    }
    async haveIAdminPanel({ roles }: { roles: Roles }): Promise<boolean> {
        if (this.forAdmin({ roles: roles as Roles }))
            return true;
        return false;
    }
}

export default new RigthsService();
