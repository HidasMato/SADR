export interface UserInfo {
    id: number,
    nickname: string,
    mail: string,
    mailVeryfity: boolean,
    role: {
        user: boolean,
        master: boolean,
        admin: boolean
    }
}