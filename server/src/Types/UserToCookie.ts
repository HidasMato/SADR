import { Roles } from "./Roles";

export type UserToCookie = {
    mail: string;
    name: string;
    id: number;
    mailveryfity: boolean;
    roles: Roles;
};
