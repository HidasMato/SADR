import styles from "./ErrorPage.module.scss";
import TestComponent from "../../components/TestComponent/TestComponent";
import { useParams } from "react-router-dom";

type MainObject = {};

const ErrorPage = (): JSX.Element => {
    return <div className={styles.Main}>Ошибка</div>;
};

export default ErrorPage;
