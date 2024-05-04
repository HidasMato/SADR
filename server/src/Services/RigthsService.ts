import { Roles } from "../Types/Roles";

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
}

export default new RigthsService();
