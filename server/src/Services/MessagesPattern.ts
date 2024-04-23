import { SERVER_URL } from "../../tokens.json";

class MessagesPattern {
    registrationMail({ activationLink }: { activationLink: string }) {
        return `
        <div>
        <h1>
        Для участия в наших игротеках требуется подтверждение почтового ящика
        Пожалуйста подтвердите его по следующей ссылке: <a href="${SERVER_URL}/api/user/activate/${activationLink}">${SERVER_URL}/api/user/activate/${activationLink}</a>
        </h1>
        </div>
        `;
    }
    changeMail({ activationLink }: { activationLink: string }) {
        return `
        <div>
        <h1>
        Вы оставили заявку на смену почтового ящика
        Пожалуйста подтвердите его по следующей ссылке: <a href="${SERVER_URL}/api/user/activate/${activationLink}">${SERVER_URL}/api/user/activate/${activationLink}</a>
        </h1>
        </div>
        `;
    }
}

export default new MessagesPattern();
