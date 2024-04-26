import { useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";
import { AuthContext } from "../../context/AuthContext";
import { ReactComponent as ProfileIcon } from "../../images/account_circle.svg";
import { ReactComponent as GamesIcon } from "../../images/casino.svg";
import { ReactComponent as LogoIcon } from "../../images/logo.svg";
import { ReactComponent as PlaysIcon } from "../../images/stactic.svg";

type HeaderObject = {
    showLogin: boolean;
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header = ({ showLogin, setShowLogin }: HeaderObject): JSX.Element => {
    const { isUserLogged } = useContext(AuthContext);
    const Main = () => {
        return (
            <header className={styles.Main}>
                <nav className={styles.Nav}>
                    <Link to="/">
                        <LogoIcon className={styles.Logo}></LogoIcon>
                    </Link>
                    <Link className={styles.Link} to="/games">
                        <GamesIcon className={styles.Icon} />
                        <div className={styles.Text}>Игры</div>
                    </Link>
                    <Link className={styles.Link} to="/plays">
                        <PlaysIcon className={styles.Icon} />
                        <div className={styles.Text}>Игротеки</div>
                    </Link>
                    {isUserLogged ? (
                        <Link className={styles.Link} to={`/profile`}>
                            <ProfileIcon className={styles.Icon} />
                            <div className={styles.Text}>Профиль</div>
                        </Link>
                    ) : (
                        <button
                            className={styles.Link}
                            onClick={() => {
                                setShowLogin(!showLogin);
                            }}
                        >
                            <ProfileIcon className={styles.Icon} />
                            <div className={styles.Text}>Вход</div>
                        </button>
                    )}
                </nav>
            </header>
        );
    };
    return Main();
};

export default Header;
