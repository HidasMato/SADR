import { UserInfo } from "./UserInfo";
import { tokens } from "./tokens";


export interface AuthResponse {
    user: UserInfo,
    tokens: tokens
}