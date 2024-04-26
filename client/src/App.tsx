import { useContext, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import styles from "./App.module.scss";
import { AuthContext } from "./context/AuthContext";
import Footer from "./pages/Footer/Footer";
import Header from "./pages/Header/Header";
import Page from "./pages/Page/Page";

const App = (): JSX.Element => {
    const [showLogin, setShowLogin] = useState(false);
    const { isAppReady } = useContext(AuthContext);
    if (isAppReady)
        return (
            <div className={styles.Main} id="Main">
                <Router>
                    <Header showLogin={showLogin} setShowLogin={setShowLogin} />
                    <Page showLogin={showLogin} setShowLogin={setShowLogin} />
                    <Footer />
                </Router>
            </div>
        );
    else return <div className={styles.Main}>Загрузка</div>;
};

export default App;
