
import styles from "./Button.module.scss";

type ButtonObject = {
    text: string;
    onClick: () => void;
}

const Button = ({ text, onClick }: ButtonObject): JSX.Element => {
    return (
        <button className={styles.Main} onClick={onClick}>{text}</button>
    );
};

export default Button;