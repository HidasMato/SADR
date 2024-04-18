import { Roles } from "./Roles";

export type UserToCookie = {
    mail: string,
    nickname: string,
    id: number,
    mailveryfity: boolean,
    roles: Roles
};