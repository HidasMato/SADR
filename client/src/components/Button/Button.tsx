import styles from "./Button.module.scss";

type ButtonObject = {
    onClick?: () => void;
    children: JSX.Element | string;
};

const Button = ({ children, onClick }: ButtonObject): JSX.Element => {
    return (
        <button className={styles.Main} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
