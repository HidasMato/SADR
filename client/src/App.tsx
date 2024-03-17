import style from "./App.module.scss";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Main from "./pages/Main/Main.tsx";
import Games from "./pages/Games/Games.tsx";
import { ReactComponent as GamesIcon } from './images/casino.svg';
import Game_rooms from "./pages/Game_rooms/Game_rooms.tsx";
import { ReactComponent as Game_roomsIcon } from './images/tactic.svg';
import Profile from "./pages/Profile/Profile.tsx";
import { ReactComponent as ProfileIcon } from './images/account_circle.svg';

export const App = () => (
	
	<Router>
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD@400,1,0" />
		<header className={style.AppHeader}>
			<nav className={style.Nav}>
				<Link className={style.Logo} to="/"><img src={"https://placehold.co/50"} alt="Главная" /></Link>
				<Link className={style.Link} to="/games/1"><GamesIcon/>Игры</Link>
				<Link className={style.Link} to="/game_rooms/1"><Game_roomsIcon/>Игротеки</Link>
				<Link className={style.Link} to="/profile"><ProfileIcon/>Профиль</Link>
			</nav>
		</header>

		<main className={style.App}>
			<Routes>
				<Route path="/" element={<Main />}/>
				<Route path="/games/:id" element={<Games />}/>
				<Route path="/game_rooms/:id" element={<Game_rooms />}/>
				<Route path="/profile" element={<Profile />}/>
			</Routes>
		</main>

		<footer className={style.AppFooter}>
			<h2>HELP US</h2>
		</footer>
	</Router>
);

export default App;