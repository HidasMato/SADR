import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import styles from "./Page.module.scss";
import { AuthContext } from "../../context/AuthContext";
import Games from "../../pages/Games/Games";
import MainPage from "../../pages/Main/Main";
import Plays from "../../pages/Plays/Plays";
import Profile from "../../pages/Profile/Profile";
import ErrorPage from "../ErrorPage/ErrorPage";
import Game from "../Game/Game";
import GameCreator from "../GameCreator/GameCreator";
import Modal from "../Modal/Modal";
import Play from "../Play/Play";
import PlayCreator from "../PlayCreator/PlayCreator";

type PageObject = {
    showLogin: boolean;
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

const Page = ({ showLogin, setShowLogin }: PageObject): JSX.Element => {
    const { isUserLogged } = useContext(AuthContext);
    const Page = () => {
        return (
            <Routes>
                {isUserLogged ? <Route path="/profile" element={<Profile />} /> : null}
                <Route path="/" element={<MainPage />} />
                <Route path="/games/" element={<Games />} />
                <Route path="/game/new" element={<GameCreator mode={"create"} />} />
                <Route path="/game/change/:id" element={<GameCreator mode={"change"} />} />
                <Route path="/game/:id" element={<Game />} />
                <Route path="/plays" element={<Plays />} />
                <Route path="/play/new" element={<PlayCreator mode="create" />} />
                <Route path="/play/change/:id" element={<PlayCreator mode="change" />} />
                <Route path="/play/:id" element={<Play />} />
                <Route path="/*" element={<ErrorPage />} />
            </Routes>
        );
    };
    const Modals = () => {
        return (
            <div className={styles.UnModal + " " + (showLogin ? styles.Modal : "")}>
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
