import React from "react";
import styles from "./Footer.module.scss";

type GamesObject = {

}

export default (): JSX.Element => {
    return (
        <footer className={styles.Main}>
            <div className={styles.Content}>
                <h2>HELP US</h2>
            </div>
        </footer>
    );
};
