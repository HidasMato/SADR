import React from "react";
import styles from "./Game.module.scss";
import TestComponent from "../../components/TestComponent/TestComponent.tsx";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

type GameObject = {

}

const Game = (): JSX.Element => {
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

export default observer(Game);