import { Roles } from "../Types/Roles";
import PlayService from "./PlayService";
import RigthsService from "./RigthsService";

class RuleService {
    async canICreateGame({ userId, roles }: { roles: Roles; userId: number }): Promise<boolean> {
        if (!RigthsService.forAdmin({ roles: roles })) return false;
        // Иммитация проверки, что у админа есть плашка может создавать игры
        return userId == 1;
    }
    async canIChangeGame({ userId, roles }: { roles: Roles; userId: number }): Promise<boolean> {
        if (!RigthsService.forAdmin({ roles: roles })) return false;
        // Иммитация проверки, что у админа есть плашка может изменять игры
        return userId == 1;
    }
    async canIDeleteGame({ userId, roles }: { roles: Roles; userId: number }): Promise<boolean> {
        if (!RigthsService.forAdmin({ roles: roles })) return false;
        // Иммитация проверки, что у админа есть плашка может изменять игры
        return userId == 1;
    }
    async canICreatePlay({ userId, roles }: { roles: Roles; userId: number }): Promise<boolean> {
        // Иммитация, что у админа есть возможность создавать игротеки
        if ((RigthsService.forAdmin({ roles: roles }) && userId == 1) || RigthsService.forMaster({ roles: roles })) return true;
        return false;
    }
    async canIChangePlay({ userId, roles, playId }: { roles: Roles; userId: number; playId: number }): Promise<boolean> {
        if ((RigthsService.forMaster({ roles: roles as Roles }) && (await PlayService.isPlaysMasterPlay({ playId: playId, masterId: userId }))) || (RigthsService.forAdmin({ roles: roles as Roles }) && userId == 1))
            // Иммитация, что у админа есть возможность редактировать игротеки и у мастера айди совпадает с игротекой
            return true;
        return false;
    }
    async canIDeletePlay({ userId, roles, playId }: { roles: Roles; userId: number; playId: number }): Promise<boolean> {
        if (RigthsService.forAdmin({ roles: roles as Roles }) && userId == 1)
            // Иммитация, что у админа есть возможность редактировать игротеки
            return true;
        return false;
    }
}

export default new RuleService();
