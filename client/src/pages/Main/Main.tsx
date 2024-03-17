import React from "react";
import styles from "./Main.module.scss";
import TestComponent from "../../components/TestComponent/TestComponent.tsx";
import { useParams } from "react-router-dom";

type MainObject={

}

const Main = ():JSX.Element=>{
	const {id} = useParams();
	return(
		<div className={styles.Main}>
            Main
		</div>
	);
};

export default Main;