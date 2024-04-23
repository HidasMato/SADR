import styles from "./Page.module.scss";
import { Route, Routes } from "react-router-dom";
import MainPage from "../../pages/Main/Main";
import Games from "../../pages/Games/Games";
import Plays from "../../pages/Plays/Plays";
import Profile from "../../pages/Profile/Profile";
import Modal from "../Modal/Modal";
import Play from "../Play/Play";
import Game from "../Game/Game";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import ErrorPage from "../ErrorPage/ErrorPage";

type PageObject = {
    showLogin: boolean;
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

const Page = ({ showLogin, setShowLogin }: PageObject): JSX.Element => {
    const { isUserLogged } = useContext(AuthContext);
    const Page = () => {
        return (
            <Routes>
                {isUserLogged ? (
                    <Route path="/profile" element={<Profile />} />
                ) : null}
                <Route path="/" element={<MainPage />} />
                <Route path="/games/" element={<Games />} />
                <Route path="/game/:id" element={<Game />} />
                <Route path="/plays" element={<Plays />} />
                <Route path="/play/:id" element={<Play />} />
                <Route path="/*" element={<ErrorPage />} />
            </Routes>
        );
    };
    const Modals = () => {
        return (
            <div
                className={
                    styles.UnModal + " " + (showLogin ? styles.Modal : "")
                }>
                <Modal showLogin={showLogin} setShowLogin={setShowLogin} />
            </div>
        );
    };
    const Main = () => {
        return (
            <div className={styles.Main}>
                <div className={styles.Content}>
                    {Modals()}
                    {Page()}
                </div>
            </div>
        );
    };
    return Main();
};

export default Page;
