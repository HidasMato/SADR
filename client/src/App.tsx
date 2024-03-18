import styles from "./App.module.scss";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Main from "./pages/Main/Main.tsx";
import Games from "./pages/Games/Games.tsx";
import { ReactComponent as GamesIcon } from './images/casino.svg';
import Game_rooms from "./pages/Game_rooms/Game_rooms.tsx";
import { ReactComponent as Game_roomsIcon } from './images/tactic.svg';
import Profile from "./pages/Profile/Profile.tsx";
import { ReactComponent as ProfileIcon } from './images/account_circle.svg';

const App = (): JSX.Element => {
    return (
        <div className={styles.Main}>
            <Router>
                <header className={styles.Header}>
                    <nav className={styles.Nav}>
                        {/* <Link className={styles.Logo} to="/"><img className={styles.Icon} src={"https://placehold.co/150" } alt="Главная" /></Link> */}
                        <Link to="/">
                            <div className={styles.Logo}></div>
                        </Link>
                        <Link className={styles.Link} to="/games/1">
                            <GamesIcon className={styles.Icon}/>
                            <div className={styles.Text}>Игры</div>
                        </Link>
                        <Link className={styles.Link} to="/game_rooms/1">
                            <Game_roomsIcon className={styles.Icon} />
                            <div className={styles.Text}>Игротеки</div>
                        </Link>
                        <Link className={styles.Link} to="/profile">
                            <ProfileIcon className={styles.Icon} />
                            <div className={styles.Text}>Профиль</div>
                        </Link>
                    </nav>
                </header>

                <div className={styles.Page}>
                    <Routes>
                        <Route path="/" element={<Main />} />
                        <Route path="/games/:id" element={<Games />} />
                        <Route path="/game_rooms/:id" element={<Game_rooms />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </div>

                <footer className={styles.Footer}>
                    <h2>HELP US</h2>
                </footer>
            </Router>
        </div>
    );
};


export default App;