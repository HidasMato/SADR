
import styles from "./TestComponent.module.scss";

type TestComponentObject = {
    opt1: number;
    opt2: string | Object[];
    children: React.ReactChild[];
}

const TestComponent = ({ opt1, opt2, children }): JSX.Element => {
    return (
        <div className={styles.TestComponent}>
            TEST
            {children}
            {opt1}
        </div>
    );
};

export default TestComponent;