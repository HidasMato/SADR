import styles from "./App.module.scss";
import React, { useState } from "react";
import { BrowserRouter as Router} from "react-router-dom";
import Header from "./pages/Header/Header.tsx";
import Footer from "./pages/Footer/Footer.tsx";
import Page from "./pages/Page/Page.tsx";

const App = (): JSX.Element => {
    const [showLogin, setShowLogin] = useState(false);
    
    
    return (
        <div className={styles.Main}>
            <Router>
                <Header auth={false} showLogin={showLogin} setShowLogin={setShowLogin} />
                <Page showLogin={showLogin} setShowLogin={setShowLogin}/>
                <Footer/>
            </Router>
        </div>
    );
};


export default App;