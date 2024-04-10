import React, { useState } from "react";
import styles from "./Header.module.scss";
import { Link } from "react-router-dom";
import { ReactComponent as LogoIcon } from '../../images/logo.svg';
import { ReactComponent as ProfileIcon } from '../../images/account_circle.svg';
import { ReactComponent as Game_roomsIcon } from '../../images/tactic.svg';
import { ReactComponent as GamesIcon } from '../../images/casino.svg';

type HeaderObject = {
    auth: boolean;
    showLogin: boolean;
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export default ({ auth, showLogin, setShowLogin }: HeaderObject): JSX.Element => {
    const ProfileOutProfile = () => {
        if (auth)
            return Profile();
        return OutProfile();
    };
    const Profile = () => {
        return (
            <Link className={styles.Link} to="/profile">
                <ProfileIcon className={styles.Icon} />
                <div className={styles.Text}>Профиль</div>
            </Link>
        );
    };
    const OutProfile = () => {
        return (
            <div className={styles.Link} onClick={() => { setShowLogin(!showLogin) }}>
                <ProfileIcon className={styles.Icon} />
                <div className={styles.Text}>Вход</div>
            </div>
        );
    };
    const Logo = () => {
        return (
            <Link to="/">
                <LogoIcon className={styles.Logo}></LogoIcon>
            </Link>
        );
    };
    const Games = () => {
        return (
            <Link className={styles.Link} to="/games/1">
                <GamesIcon className={styles.Icon} />
                <div className={styles.Text}>Игры</div>
            </Link>
        );
    };
    const Plays = () => {
        return (
            <Link className={styles.Link} to="/game_rooms/1">
                <Game_roomsIcon className={styles.Icon} />
                <div className={styles.Text}>Игротеки</div>
            </Link>
        );
    };
    const Main = () => {
        return (
            <header className={styles.Main}>
                <nav className={styles.Nav}>
                    {Logo()}
                    {Games()}
                    {Plays()}
                    {ProfileOutProfile()}
                </nav>
            </header>
        )
    }
    return Main();
};
