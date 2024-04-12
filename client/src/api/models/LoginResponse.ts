import { UserInfo } from "./UserInfo";
import { tokens } from "./tokens";


export interface LoginResponse {
    user: UserInfo,
    tokens: tokens
}