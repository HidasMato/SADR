import React from "react";
import styles from "./Footer.module.scss";
import { observer } from "mobx-react-lite";

type GamesObject = {

}

const Footer =  (): JSX.Element => {
    return (
        <footer className={styles.Main}>
            <div className={styles.Content}>
                <h2>HELP US</h2>
            </div>
        </footer>
    );
};

export default observer(Footer)