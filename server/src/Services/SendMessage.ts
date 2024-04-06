import * as uuid from 'uuid';
import nodemailer from 'nodemailer'
import { pool } from './_getPool';
import { MAIL_DATA } from '../../tokens.json'
import MessagesPattern from './MessagesPattern';

class SendMessage {
    async mail({ to, message, title }: { to: string, message: string, title: string }) {
        const transporter = nodemailer.createTransport({
            host: MAIL_DATA.HOST,
            port: MAIL_DATA.PORT,
            secure: true,
            auth: {
                user: MAIL_DATA.USER_MAIL,
                pass: MAIL_DATA.USER_PASSWORD
            }
        })
        await transporter.sendMail({
            from: `Общество любителей настолок <${MAIL_DATA.USER_MAIL}>`,
            to: to,
            subject: title,
            text: ``,
            html: message
        })
    }
    async sendMailAccess({ mail, userid, type }: { mail: string, userid: number, type: "registration" | "changemail" }) {
        const activationLink = uuid.v4();
        await pool.query(`INSERT INTO maillink (mail, userid, link, dateend) VALUES ($1, $2, $3, now() + '5 hour'::interval);`, [mail, userid, activationLink])
        if (type == "registration")
            this.mail({
                to: mail, title: "Регистрация на сайте любителинастолок.рф", message: MessagesPattern.registrationMail({ activationLink: activationLink })
            })
        else
            this.mail({
                to: mail, title: "Смена привяанной почты на сайте любителинастолок.рф", message: MessagesPattern.changeMail({ activationLink: activationLink })
            })
    }

    async notification({ mail, text }: { mail: string, text: string }) {
        this.mail({ to: mail, title: "Уведомление на сайте любителинастолок.рф", message: text })
    }
}

export default new SendMessage();