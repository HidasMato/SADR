import React from "react";
import styles from "./Page.module.scss";
import { Route, Routes } from "react-router-dom";
import MainPage from "../../pages/Main/Main.tsx";
import Games from "../../pages/Games/Games.tsx";
import Game_rooms from "../../pages/Game_rooms/Game_rooms.tsx";
import Profile from "../../pages/Profile/Profile.tsx";
import Modal from "../Modal/Modal.tsx";
import { observer } from "mobx-react-lite";

type PageObject = {
    showLogin: boolean;
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Page = ({ showLogin, setShowLogin }: PageObject): JSX.Element => {
    const Page = () => {
        return (
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/games/:id" element={<Games />} />
                <Route path="/game_rooms/:id" element={<Game_rooms />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        );
    }
    const Modals = () => {
        return (
            <div className={styles.UnModal + ' ' + (showLogin ? styles.Modal : "")}>
                <Modal showLogin={showLogin} setShowLogin={setShowLogin}/>
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