import styles from "./App.module.scss";
import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./pages/Header/Header.tsx";
import Footer from "./pages/Footer/Footer.tsx";
import Page from "./pages/Page/Page.tsx";
import { Context } from "./index.tsx";
import { observer } from 'mobx-react-lite';

const App = (): JSX.Element => {
    const [showLogin, setShowLogin] = useState(false);
    const { store } = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth().then((a) => {
                if (a.status == 200)
                    store.setAuth(true)
                else
                    store.setAuth(false)
            })
        } else
            store.setAuth(false)
    }, [])

    return (
        <div className={styles.Main}>
            <Router>
                <Header showLogin={showLogin} setShowLogin={setShowLogin} />
                <Page showLogin={showLogin} setShowLogin={setShowLogin} />
                <Footer />
            </Router>
        </div>
    );
};


export default observer(App);

