import { ReactNode } from "react";
import { Link } from "react-router-dom";
import styles from "./ButtonGreeting.module.scss";

type ButtonGreetingObject = {
    text: ReactNode;
    link: string;
};

const ButtonGreeting = ({ text, link }: ButtonGreetingObject): JSX.Element => {
    return (
        <Link to={link} className={styles.Main}>
            {text}
        </Link>
    );
};

export default ButtonGreeting;
