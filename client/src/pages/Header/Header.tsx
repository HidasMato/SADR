import React, { useContext, useState } from "react";
import styles from "./Header.module.scss";
import { Link } from "react-router-dom";
import { ReactComponent as LogoIcon } from '../../images/logo.svg';
import { ReactComponent as ProfileIcon } from '../../images/account_circle.svg';
import { ReactComponent as Game_roomsIcon } from '../../images/tactic.svg';
import { ReactComponent as GamesIcon } from '../../images/casino.svg';
import { Context } from "../../index.tsx";

type HeaderObject = {
    showLogin: boolean;
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export default ({ showLogin, setShowLogin }: HeaderObject): JSX.Element => {
    const Main = () => {
        const { store } = useContext(Context);
        return (
            <header className={styles.Main}>
                <nav className={styles.Nav}>
                    <Link to="/">
                        <LogoIcon className={styles.Logo}></LogoIcon>
                    </Link>
                    <Link className={styles.Link} to="/games/1">
                        <GamesIcon className={styles.Icon} />
                        <div className={styles.Text}>Игры</div>
                    </Link>
                    <Link className={styles.Link} to="/game_rooms/1">
                        <Game_roomsIcon className={styles.Icon} />
                        <div className={styles.Text}>Игротеки</div>
                    </Link>
                    {store.isAuth ?
                        <Link className={styles.Link} to="/profile">
                            <ProfileIcon className={styles.Icon} />
                            <div className={styles.Text}>Профиль</div>
                        </Link>
                        :
                        <div className={styles.Link} onClick={() => { setShowLogin(!showLogin) }}>
                            <ProfileIcon className={styles.Icon} />
                            <div className={styles.Text}>Вход</div>
                        </div>
                    }
                </nav>
            </header>
        )
    }
    return Main();
};
