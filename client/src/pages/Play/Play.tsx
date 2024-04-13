
import styles from "./Play.module.scss";
import TestComponent from "../../components/TestComponent/TestComponent";
import { useParams } from "react-router-dom";

type PlayObject = {

}

const Play = (): JSX.Element => {
    const { id } = useParams();
    return (
        <div className={styles.Main}>
            Play
            {id}
            <TestComponent opt1={1} opt2={"Hello!"}>
                <div>
                    {id}
                </div>
                <div>
                    This thing2!
                </div>
                <div>
                    This thing3!
                </div>
            </TestComponent>
        </div>
    );
};

export default Play;