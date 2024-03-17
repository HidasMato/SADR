import styles from "./App.module.scss";
import React from "react";
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Main from "./pages/Main/Main.tsx";
import Games from "./pages/Games/Games.tsx";
import Game_rooms from "./pages/Game_rooms/Game_rooms.tsx";
import Profile from "./pages/Profile/Profile.tsx";

export const App = () => (
	
	<Router>
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD@400,1,0" />
		<header className={styles.AppHeader}>
			<nav className={styles.Nav}>
				<Link className={styles.Logo} to="/"><img src={"https://placehold.co/50"} alt="Главная" /></Link>
				<Link className={styles.Link} to="/games/1"><span className="material-symbols-outlined size-48">casino</span>Игры</Link>
				<Link className={styles.Link} to="/game_rooms/1"><span className="material-symbols-outlined size-48">tactic</span>Игротеки</Link>
				<Link className={styles.Link} to="/profile"><span className="material-symbols-outlined size-48">account_circle</span>Профиль</Link>
			</nav>
		</header>

		<main className={styles.App}>
			<Routes>
				<Route path="/" element={<Main />}/>
				<Route path="/games/:id" element={<Games />}/>
				<Route path="/game_rooms/:id" element={<Game_rooms />}/>
				<Route path="/profile" element={<Profile />}/>
			</Routes>
		</main>

		<footer className={styles.AppFooter}>
			<h2>HELP US</h2>
		</footer>
	</Router>
);

export default App;