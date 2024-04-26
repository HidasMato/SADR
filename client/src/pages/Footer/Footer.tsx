import styles from "./Footer.module.scss";

const Footer = (): JSX.Element => {
    return (
        <footer className={styles.Main}>
            <div className={styles.Content}>
                <h2>HELP US</h2>
            </div>
        </footer>
    );
};

export default Footer;
