import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Modal.module.scss";
import { AuthContext } from "../../context/AuthContext";

type ModalObject = {
    showLogin: boolean;
    setShowLogin: any;
};

const Modal = ({ showLogin, setShowLogin }: ModalObject): JSX.Element => {
    const { login, registration } = useContext(AuthContext);
    const navigate = useNavigate();
    const [mailLogin, setMailLogin] = useState("");
    const [passLogin, setPassLogin] = useState("");
    const SbrosLogin = () => {
        setMailLogin("");
        setPassLogin("");
    };
    const SbrosReg = () => {
        setMailRegistration("");
        setNameRegistration("");
        setPass1Registration("");
        setPass2Registration("");
    };
    const [mailRegistration, setMailRegistration] = useState("");
    const [nameRegistration, setNameRegistration] = useState("");
    const [pass1Registration, setPass1Registration] = useState("");
    const [pass2Registration, setPass2Registration] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const ref = useRef<HTMLDivElement>(null);
    const checkIfClickedOutside = (e: any) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setShowLogin(false);
            SbrosLogin();
            SbrosReg();
            setIsLogin(true);
            document.removeEventListener("mousedown", checkIfClickedOutside);
        }
    };
    useEffect(() => {
        if (showLogin) document.addEventListener("mousedown", checkIfClickedOutside);
    }, [showLogin]);
    const CheckMail = (mail: string) => {
        return true;
    };
    const CheckPass = (pass: string) => {
        return true;
    };
    const CheckName = (name: string) => {
        return true;
    };
    const Vhod = () => {
        CheckMail(mailLogin);
        CheckPass(passLogin);
        login({ mail: mailLogin, pass: passLogin }).then((a) => {
            if (a.status === 200) {
                setShowLogin(false);
                SbrosLogin();
                navigate(0);
            } else {
                //TODO: Это заменить на визуальные показания неверности хуйни
                alert(a.message);
            }
        });
    };
    const Registration = () => {
        if (pass1Registration !== pass2Registration) return 1; // Ошибка
        CheckMail(mailRegistration);
        CheckPass(pass1Registration);
        CheckName(nameRegistration);
        registration({
            mail: mailRegistration,
            pass: pass1Registration,
            name: nameRegistration,
        }).then((a) => {
            if (a.status === 200) {
                setShowLogin(false);
                SbrosReg();
                navigate(0);
            } else {
                //TODO: Это заменить на визуальные показания неверности хуйни
                alert(a.message);
            }
        });
    };
    const getLogin = () => {
        return (
            <div key={"log"} className={styles.InContainer}>
                <div className={styles.Title}>Вход</div>
                <div className={styles.Parametr}>
                    <div>
                        <label htmlFor="mail">Ваше величество</label>
                    </div>
                    <input
                        type="email"
                        name="mail"
                        id="mail"
                        value={mailLogin}
                        onChange={(e) => setMailLogin(e.target.value)}
                    />
                </div>
                <div className={styles.Parametr}>
                    <div>
                        <label htmlFor="pass">Пароль</label>
                    </div>
                    <input
                        type="password"
                        name="pass"
                        id="pass"
                        value={passLogin}
                        onChange={(e) => setPassLogin(e.target.value)}
                    />
                </div>
                <button onClick={Vhod} className={styles.Active + " " + styles.Vhod}>
                    Вход
                </button>
                <button
                    onClick={() => {
                        setIsLogin(false);
                        SbrosLogin();
                    }}
                >
                    Зарегестрироваться
                </button>
            </div>
        );
    };
    const getRegistration = () => {
        return (
            <div key={"reg"} className={styles.InContainer}>
                <div className={styles.Title}>Регистрация</div>
                <div className={styles.Parametr}>
                    <div>
                        <label htmlFor="name">Как Вас величать?</label>
                    </div>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={nameRegistration}
                        onChange={(e) => setNameRegistration(e.target.value)}
                    />
                </div>
                <div className={styles.Parametr}>
                    <div>
                        <label htmlFor="mail">Куда слать письма?</label>
                    </div>
                    <input
                        type="email"
                        name="mail"
                        id="mail"
                        value={mailRegistration}
                        onChange={(e) => setMailRegistration(e.target.value)}
                    />
                </div>
                <div className={styles.Parametr}>
                    <div>
                        <label htmlFor="pass">Вообразите пароль</label>
                    </div>
                    <input
                        type="password"
                        name="pass"
                        id="pass"
                        value={pass1Registration}
                        onChange={(e) => setPass1Registration(e.target.value)}
                    />
                </div>
                <div className={styles.Parametr}>
                    <div>
                        <label htmlFor="pass2">Вспомните пароль</label>
                    </div>
                    <input
                        type="password"
                        name="pass2"
                        id="pass2"
                        value={pass2Registration}
                        onChange={(e) => setPass2Registration(e.target.value)}
                    />
                </div>
                <button onClick={Registration} className={styles.Active}>
                    Зарегестрироваться
                </button>
                <button
                    className={styles.Vhod}
                    onClick={() => {
                        setIsLogin(true);
                        SbrosReg();
                    }}
                >
                    Вход
                </button>
            </div>
        );
    };
    const Main = () => {
        return (
            <div className={styles.Main}>
                <div className={styles.PreContainer}>
                    <div ref={ref} className={styles.Container}>
                        {isLogin ? getLogin() : getRegistration()}
                        <div className={styles.MyProfiles}>
                            <button
                                onClick={() => {
                                    setMailLogin("mySun@mail.ru");
                                    setPassLogin("1234567890");
                                }}
                            >
                                Солнышко
                            </button>
                            <button
                                onClick={() => {
                                    setMailLogin("blue_kitty@mail.ru");
                                    setPassLogin("qwertyuiop");
                                }}
                            >
                                Синий KUT
                            </button>
                            <button
                                onClick={() => {
                                    setMailLogin("alex10821@mail.ru");
                                    setPassLogin("SupForMe");
                                }}
                            >
                                Противная сирена
                            </button>
                            <button
                                onClick={() => {
                                    setMailLogin("loloporow@mail.ru");
                                    setPassLogin("AbraKedabra");
                                }}
                            >
                                Капелька
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    return Main();
};

export default Modal;
