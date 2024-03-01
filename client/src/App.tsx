import styles from "./App.module.scss";
import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
} from "react-router-dom";
import Main from "./pages/Main/Main.tsx";

export const App = () => (
	<Router>
		<header>
			<nav>
				<Link to="/">Главная</Link>
				<Link to="/about/1">Контакты</Link>
				<Link to="/users">Пользователи</Link>
			</nav>
		</header>

		<main>
			{/* <Routes> рендерит первый <Route>, совпавший с URL */}
			<Routes>
				<Route path="/about/:id" element={<Main />}/> {/* :id  */}
				<Route path="/users" element={<Users />}/>
        <Route path="/" element={<Home />}/>
			</Routes>
		</main>
	</Router>
);

const Home = () => <h2>Главная</h2>;

const About = () => <h2>Контакты</h2>;

const Users = () => <h2>Пользователи</h2>;

export default App;