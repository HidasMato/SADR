import styles from "./App.module.scss";
import { useContext, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./pages/Header/Header";
import Footer from "./pages/Footer/Footer";
import Page from "./pages/Page/Page";
import { AuthContext } from "./context/AuthContext";

const App = (): JSX.Element => {
    const [showLogin, setShowLogin] = useState(false);
    const { isAppReady } = useContext(AuthContext);
    if (isAppReady)
        return (
            <div className={styles.Main}>
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
