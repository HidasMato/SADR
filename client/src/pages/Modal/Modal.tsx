import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Modal.module.scss";
import { Context } from "../../index.tsx";
import { observer } from "mobx-react-lite";

type ModalObject = {
    showLogin: boolean;
    setShowLogin: any;
}

const Modal =({ showLogin, setShowLogin }: ModalObject): JSX.Element => {
    const [mailLogin, setMailLogin] = useState('blue_kitty@mail.ru');
    const [passLogin, setPassLogin] = useState('qwertyuiop');
    const SbrosLogin = () => {
        setMailLogin('blue_kitty@mail.ru');
        setPassLogin('qwertyuiop');
    }
    const SbrosReg = () => {
        setMailRegistration('');
        setNameRegistration('');
        setPass1Registration('');
        setPass2Registration('');
    }
    const [mailRegistration, setMailRegistration] = useState('');
    const [nameRegistration, setNameRegistration] = useState('');
    const [pass1Registration, setPass1Registration] = useState('');
    const [pass2Registration, setPass2Registration] = useState('');
    const [isLogin, setIsLogin] = useState(true)
    const { store } = useContext(Context)
    const ref = useRef<HTMLDivElement>(null);
    const checkIfClickedOutside = (e: any) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setShowLogin(false);
            SbrosLogin();
            SbrosReg();
            setIsLogin(true);
            document.removeEventListener('mousedown', checkIfClickedOutside);
        }
    };
    useEffect(() => {
        if (showLogin)
            document.addEventListener('mousedown', checkIfClickedOutside);
    }, [showLogin]);
    const CheckMail = (mail: string) => {
        return true;
    }
    const CheckPass = (pass: string) => {
        return true;
    }
    const CheckName = (name: string) => {
        return true;
    }
    const Vhod = async () => {
        CheckMail(mailLogin);
        CheckPass(passLogin);
        const a = await store.login(mailLogin, passLogin)
        if (a.status == 200) {
            setShowLogin(false)
            SbrosLogin();
        } else {
            alert(a.message)
        }
    }
    const Registration = async () => {
        CheckMail(mailRegistration);
        CheckPass(pass1Registration);
        CheckPass(nameRegistration);
        const a = await store.registration(mailRegistration, pass1Registration, nameRegistration)
        if (a.status == 200) {
            setShowLogin(false)
            SbrosReg();
        } else {
            alert(a.message)
        }
    }
    const getLogin = () => {
        return (
            <div key={'log'} className={styles.InContainer}>
                <div className={styles.Title}>Вход</div>
                <div className={styles.Parametr}>
                    <div><label htmlFor='mail'>Ваше величество</label></div>
                    <input type="text" name='mail' id='mail' value={mailLogin} onChange={e => setMailLogin(e.target.value)} />
                </div>
                <div className={styles.Parametr}>
                    <div><label htmlFor='pass'>Пароль</label></div>
                    <input type="password" name='pass' id='pass' value={passLogin} onChange={e => setPassLogin(e.target.value)} />
                </div>
                <button onClick={Vhod} className={styles.Active + ' ' + styles.Vhod}>Вход</button>
                <button onClick={() => {
                    setIsLogin(false);
                    SbrosLogin();
                }}>Зарегестрироваться</button>
            </div>
        )
    }
    const getRegistration = () => {
        return (
            <div key={'reg'} className={styles.InContainer}>
                <div className={styles.Title}>Регистрация</div>
                <div className={styles.Parametr}>
                    <div><label htmlFor='name'>Как Вас величать?</label></div>
                    <input type="text" name='name' id='name' value={nameRegistration} onChange={e => setNameRegistration(e.target.value)} />
                </div>
                <div className={styles.Parametr}>
                    <div><label htmlFor='mail'>Куда слать письма?</label></div>
                    <input type="text" name='mail' id='mail' value={mailRegistration} onChange={e => setMailRegistration(e.target.value)} />
                </div>
                <div className={styles.Parametr}>
                    <div><label htmlFor='pass'>Вообразите пароль</label></div>
                    <input type="password" name='pass' id='pass' value={pass1Registration} onChange={e => setPass1Registration(e.target.value)} />
                </div>
                <div className={styles.Parametr}>
                    <div><label htmlFor='pass2'>Вспомните пароль</label></div>
                    <input type="password" name='pass2' id='pass2' value={pass2Registration} onChange={e => setPass2Registration(e.target.value)} />
                </div>
                <button onClick={Registration} className={styles.Active}>Зарегестрироваться</button>
                <button className={styles.Vhod} onClick={() => {
                    setIsLogin(true);
                    SbrosReg();
                }}>Вход</button>
            </div>
        )
    }
    const Main = () => {
        return (
            <div className={styles.Main}>
                <div className={styles.PreContainer}>
                    <div ref={ref} className={styles.Container}>
                        {isLogin ? getLogin() : getRegistration()}
                    </div>
                </div>
            </div>
        );
    }
    return Main();
};

export default observer(Modal)