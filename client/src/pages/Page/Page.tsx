import React from "react";
import styles from "./Page.module.scss";
import { Route, Routes } from "react-router-dom";
import MainPage from "../../pages/Main/Main.tsx";
import Games from "../../pages/Games/Games.tsx";
import Plays from "../../pages/Plays/Plays.tsx";
import Profile from "../../pages/Profile/Profile.tsx";
import Modal from "../Modal/Modal.tsx";
import { observer } from "mobx-react-lite";
import Play from "../Play/Play.tsx";
import Game from "../Game/Game.tsx";

type PageObject = {
    showLogin: boolean;
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Page = ({ showLogin, setShowLogin }: PageObject): JSX.Element => {
    const Page = () => {
        return (
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/games" element={<Games />} />
                <Route path="/game/:id" element={<Game />} />
                <Route path="/plays" element={<Plays />} />
                <Route path="/play/:id" element={<Play />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        );
    }
    const Modals = () => {
        return (
            <div className={styles.UnModal + ' ' + (showLogin ? styles.Modal : "")}>
                <Modal showLogin={showLogin} setShowLogin={setShowLogin} />
            </div>
        )
    }
    const Main = () => {
        return (
            <div className={styles.Main}>
                <div className={styles.Content}>
                    {Modals()}
                    {Page()}
                </div>
            </div>
        );
    }
    return Main();
};

export default observer(Page)