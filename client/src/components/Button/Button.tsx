import styles from "./Button.module.scss";

type ButtonObject = {
    onClick?: () => void;
    type?: "red";
    kvadr?: boolean;
    children: JSX.Element | string;
};

const Button = ({ children, onClick, type, kvadr = false }: ButtonObject): JSX.Element => {
    return (
        <button
            className={styles.Main + " " + (type === "red" ? styles.Red : "") + " " + (kvadr ? styles.Kvadr : "")}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
