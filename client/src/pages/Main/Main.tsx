import styles from "./Main.module.scss";
import TestComponent from "../../components/TestComponent/TestComponent";
import ButtonGreeting from "../../components/ButtonGreeting/ButtonGreeting";

const Main = (): JSX.Element => {
    return (
        <div className={styles.Main}>
            <div className={styles.Block + " " + styles.Greetings}>
                <div>
                    <p>
                        Добро пожаловать в наш <b>клуб настольных игр</b>!
                    </p>
                </div>
                <div>
                    <p>
                        Здесь вас ждут увлекательные игры, интересные соперники
                        и незабываемая атмосфера. Давайте вместе создадим
                        незабываемыемоменты и насладимся игровыми баталиями!"
                    </p>
                </div>
            </div>
            <div className={styles.Block}>
                <div>
                    <p>
                        ПРИЕМНЫЕ ЧАСЫ: Пн. - Чтв. - с 9.30 по 17.00 Пт. - с 9.30
                        по 13.00
                        <br />
                        Перерыв на обед: Пн. - Пт. с 13.00 по 14.00
                        <br />
                        Технологический перерыв: Пн. - Чтв. - с 11.30 по 11.45 и
                        с 16.00 по 16.15 Пт. - с 11.30 по 11.45
                    </p>
                </div>
                <div className={styles.Block}>
                    <div>
                        <p>
                            УСЛУГИ: Проведение мероприятий и участие в
                            мероприятиях по игре в настольные игры
                        </p>
                    </div>
                    <div className={styles.Link}>
                        <div className={styles.Title}>
                            <p>
                                {
                                    "Привет, здесь мы играем в разные настолки. Приходи)"
                                }
                            </p>
                        </div>
                        <ButtonGreeting
                            text={
                                <p>
                                    {"Смотреть наши\nближайшие "}
                                    <b>Игротеки</b>
                                </p>
                            }
                            link={"/plays"}
                        />
                    </div>
                    <div className={styles.Link}>
                        <div className={styles.Title}>
                            <p>
                                {
                                    "Хочешь посмотреть список настолок который у нас есть?"
                                }
                            </p>
                        </div>
                        <ButtonGreeting
                            text={
                                <p>
                                    {"Смотреть наш\n"}
                                    <b>список игр</b>
                                </p>
                            }
                            link={"/games"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
