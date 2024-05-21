import SendMessage from "./SendMessage";
import bcrypt from "bcrypt";
import TokenService from "./TokenService";
import ApiError from "../Exeptions/ApiError";
import UserRepository from "../Repositiories/UserRepository";
import { Roles } from "../Types/Roles";
import { UserSetting } from "../Types/UserSetting";
import { UserToCookie } from "../Types/UserToCookie";
import UserController from "../Controllers/UserController";
class UserService {
    static createDateAsUTC() {
        const date = new Date();
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
    }
    static async getCache(pass: string) {
        return await bcrypt.hash(pass, 3);
    }
    //FIXME: Нормальная проверка почты
    static getTrueMail(mail: string): void {
        if (mail.length == 0) throw ApiError.BadRequest({ message: "Пустое поле почты" });
        if (mail.indexOf("@") <= 0 || mail.indexOf("@") === mail.length - 1) throw ApiError.BadRequest({ message: "Неверный формат почты" });
    }
    //FIXME: Нормальная проверка пароля
    static getTruePass(pass: string): void {
        if (pass.length < 8 || pass.length > 40) throw ApiError.BadRequest({ message: "Неверная длина пароля" });
        for (let symbol of pass.split("")) {
            //Спецсимволы
            if ("_@#$$%^&?.,".indexOf(symbol) == -1 && (symbol < "a" || symbol > "z") && (symbol < "A" || symbol > "Z") && (symbol < "0" || symbol > "9"))
                throw ApiError.BadRequest({
                    message: "Неверные символы в пароле",
                });
        }
    }
    //FIXME: Нормальная проверка ника
    static getTrueName(name: string): void {
        if (name.length < 4 || name.length > 40) throw ApiError.BadRequest({ message: "Неверная длина никнема" });
        for (let symbol of name.split("")) {
            //Спецсимволы
            if ("_@#$$%^&?.".indexOf(symbol) == -1 && (symbol < "0" || symbol > "9") && symbol.toLowerCase() == symbol.toUpperCase())
                throw ApiError.BadRequest({
                    message: "Неверные символы в никнейме",
                });
        }
    }
    async getUserRole({ id }: { id: number }) {
        const role = {
            gamer: false,
            master: false,
            admin: false,
        };
        if (await UserRepository.isUserUser({ id: id })) {
            role.gamer = true;
            if ((await UserRepository.isUserMaster({ id: id })) && (await UserRepository.getMasterActive({ id: id }))) role.master = true;
            if (await UserRepository.isUserAdmin({ id: id })) role.admin = true;
            return role;
        }
        return role;
    }
    async getUserInfoById({ id, MODE }: { id: number; MODE: "sequrity" | "forAll" }) {
        if (isNaN(id)) throw ApiError.UnavtorisationError();
        const userInfo = await UserRepository.getUserInfoById({
            id: id,
            MODE: MODE,
        });
        if (!userInfo)
            throw ApiError.BadRequest({
                status: 470,
                message: "Пользователя не существует",
            });
        userInfo.roles = await this.getUserRole({ id: userInfo.id });
        return userInfo;
    }
    async getUserList() {
        return await UserRepository.getUserList();
    }
    async getAllMasters() {
        return await UserRepository.getAllMasters();
    }
    async changePass({ id, mail, pass, oldPass }: { id: number; mail: string; pass: string; oldPass: string }) {
        if (isNaN(id)) throw ApiError.BadRequest({ message: "Неправильное значение id" });
        UserService.getTrueMail(mail);
        UserService.getTruePass(pass);
        const passcache = (await UserRepository.findUserMail({ mail: mail }))?.passcache;
        if (!passcache) throw ApiError.BadRequest({ message: "Почты не существует" });
        if (!(await bcrypt.compare(oldPass, passcache))) throw ApiError.BadRequest({ message: "Неверный пароль" });
        if (
            !(await UserRepository.changePass({
                cache: await UserService.getCache(pass),
                id: id,
                mail: mail,
            }))
        )
            throw ApiError.BadRequest({
                status: 470,
                message: "Пользователя не существует",
            });
        await SendMessage.notification({
            text: "Пароль был изменен",
            mail: mail,
        });
    }
    async changename({ id, mail, name }: { id: number; mail: string; name: string }) {
        if (isNaN(id)) throw ApiError.BadRequest({ message: "Неправильное значение id" });
        UserService.getTrueMail(mail);
        UserService.getTrueName(name);
        if (
            !(await UserRepository.changename({
                id: id,
                name: name,
                mail: mail,
            }))
        )
            throw ApiError.BadRequest({
                status: 470,
                message: "Пользователя не существует",
            });
        SendMessage.notification({ text: "Никнейм был изменен", mail: mail });
    }
    async changeRole({ id, role, mail }: { mail: string; id: number; role: string }) {
        if (isNaN(id)) throw ApiError.BadRequest({ message: "Неправильное значение id" });
        UserService.getTrueMail(mail);
        if (!(await UserRepository.isUserExists({ id: id })))
            throw ApiError.BadRequest({
                status: 470,
                message: "Пользователя не существует",
            });
        const userRoles = await this.getUserRole({ id: id });
        let active: boolean | undefined;
        switch (role) {
            case "gamer": {
                if (!userRoles.master) {
                    active = await UserRepository.getMasterActive({ id: id });
                    if (active == undefined)
                        throw ApiError.BadRequest({
                            message: "Пользователь не был мастером",
                        });
                    else if (active == false)
                        throw ApiError.BadRequest({
                            message: "Пользователь уже был расформирован",
                        });
                } else {
                    await UserRepository.downMaster({ id: id });
                    SendMessage.notification({
                        text: "Ваша роль была понижена до игрока",
                        mail: mail,
                    });
                }
                break;
            }
            case "master": {
                active = await UserRepository.getMasterActive({ id: id });
                if (active == undefined) {
                    await UserRepository.upgradeUserToMater({ id: id });
                    SendMessage.notification({
                        text: "Вам была дарована роль мастера",
                        mail: mail,
                    });
                } else if (active == false) {
                    await UserRepository.returnMaster({ id: id });
                    SendMessage.notification({
                        text: "Вам была возвращена роль мастера",
                        mail: mail,
                    });
                } else
                    throw ApiError.BadRequest({
                        message: "Пользователь уже мастер",
                    });
                break;
            }
            case "admin": {
                if(await UserRepository.getAdminRigths({id:id})) 
                active = await UserRepository.getMasterActive({ id: id });
                if (active == undefined) {
                    await UserRepository.upgradeUserToMater({ id: id });
                    SendMessage.notification({
                        text: "Вам была дарована роль мастера",
                        mail: mail,
                    });
                } else if (active == false) {
                    await UserRepository.returnMaster({ id: id });
                    SendMessage.notification({
                        text: "Вам была возвращена роль мастера",
                        mail: mail,
                    });
                } else
                    throw ApiError.BadRequest({
                        message: "Пользователь уже мастер",
                    });
                break;
            }
        }
    }
    async changeDescription({ id, description, mail }: { mail: string; id: number; description: string }) {
        if (isNaN(id)) throw ApiError.BadRequest({ message: "Неправильное значение id" });
        UserService.getTrueMail(mail);
        if (
            !(await UserRepository.changeDescription({
                id: id,
                description: description,
            }))
        )
            throw ApiError.BadRequest({
                status: 473,
                message: "Мастера не существует",
            });
    }
    async changeMail({ id, mail }: { id: number; mail: string }) {
        if (isNaN(id)) throw ApiError.BadRequest({ message: "Неправильное значение id" });
        UserService.getTrueMail(mail);
        if (await UserRepository.isMailExists({ mail: mail }))
            throw ApiError.BadRequest({
                status: 470,
                message: "Почта уже занята",
            });
        if (!(await UserRepository.changeMail({ id: id, mail: mail })))
            throw ApiError.BadRequest({
                status: 470,
                message: "Пользователя не существует",
            });
        SendMessage.sendMailAccess({
            type: "changemail",
            mail: mail,
            userid: id,
        });
    }
    async newLink({ id }: { id: number }) {
        if (isNaN(id)) throw ApiError.BadRequest({ message: "Неправильное значение id" });
        const user = await UserRepository.getUserInfoById({ id: id, MODE: "sequrity" });
        await SendMessage.sendMailAccess({
            type: "againMail",
            mail: user.mail,
            userid: user.id,
        });
        return true;
    }
    async activateLink({ link }: { link: string }) {
        const res = await UserRepository.getMyLinkActivate({ link: link });
        if (!res)
            throw ApiError.BadRequest({
                message: "Время действия ссылки истекло",
            });
        await UserRepository.deleteMyLink({ userid: res.userid });
        if (res.dateend < UserService.createDateAsUTC()) {
            throw ApiError.BadRequest({
                message: "Время действия ссылки истекло",
            });
        }
        await UserRepository.changeMailVerifity({
            userid: res.userid,
            mail: res.mail,
            value: true,
        });
    }
    async registration({ mail, name, pass, hash }: { mail: string; name: string; pass: string; hash: string }) {
        UserService.getTrueMail(mail);
        if (await UserRepository.isMailExists({ mail: mail })) throw ApiError.BadRequest({ message: "Почта уже использована" });
        UserService.getTrueName(name);
        if (await UserRepository.isNameExists({ name: name })) throw ApiError.BadRequest({ message: "Никнейм уже использована" });
        UserService.getTruePass(pass);
        const id = await UserRepository.addUser({
            mail: mail,
            cache: await UserService.getCache(pass),
            name: name,
        });
        await SendMessage.sendMailAccess({
            type: "registration",
            mail: mail,
            userid: id,
        });
        return await this.getNewToken({ id: id, hash: hash });
    }
    async login({ mail, pass, hash }: { mail: string; pass: string; hash: string }) {
        UserService.getTrueMail(mail);
        UserService.getTruePass(pass);
        const user = await UserRepository.findUserMail({ mail: mail });
        if (!user) throw ApiError.BadRequest({ message: "Почты не существует" });
        if (!(await bcrypt.compare(pass, user.passcache))) throw ApiError.BadRequest({ message: "Неверный пароль" });
        return await this.getNewToken({ id: user.id, hash: hash });
    }
    async logout({ refreshToken }: { refreshToken: string }) {
        await TokenService.removeToken({ refreshToken });
    }
    async refresh({ oldRefreshToken, hash }: { oldRefreshToken: string; hash: string }) {
        if (!oldRefreshToken) {
            await TokenService.removeToken({ refreshToken: oldRefreshToken });
            throw ApiError.UnavtorisationError();
        }
        const user = await TokenService.validateRefreshToken({
            token: oldRefreshToken,
        });
        if (
            !user ||
            (await UserRepository.getRefreshToken({
                id: user?.id,
                hash: hash,
            })) != oldRefreshToken
        ) {
            await TokenService.removeToken({ refreshToken: oldRefreshToken });
            throw ApiError.UnavtorisationError();
        }
        await TokenService.removeToken({ refreshToken: oldRefreshToken });
        return await this.getNewToken({ id: user.id, hash: hash });
    }
    async getNewToken({ id, hash }: { id: number; hash: string }) {
        const newUser = await new UserService().getUserInfoById({
            id: id,
            MODE: "sequrity",
        });
        const tokens = await TokenService.generateToken({
            payload: {
                id: newUser.id,
                mail: newUser.mail,
                name: newUser.name,
            },
        });
        await TokenService.deleteFingerprint({ hash: hash });
        await TokenService.saveToken({
            userId: newUser.id,
            refreshToken: tokens.refreshToken,
            hash: hash,
        });
        return tokens;
    }
    async sendMail({ id, message, users }: { id: number; message: string; users: number[] }) {
        for (let i = 0; i < users.length; i++) {
            const user = await UserRepository.getUserInfoById({ id: users[i], MODE: "sequrity" });
            if (user) SendMessage.senCustomMail({ mail: user.mail, text: message, title: "Сообщение от мастера" });
        }
        return true;
    }
}

export default new UserService();
