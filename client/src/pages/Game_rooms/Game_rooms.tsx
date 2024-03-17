import React from "react";
import styles from "./Game_rooms.module.scss";
import TestComponent from "../../components/TestComponent/TestComponent.tsx";
import { useParams } from "react-router-dom";

type Game_roomsObject={

}

const Game_rooms = ():JSX.Element=>{
	const {id} = useParams();
	return(
		<div className={styles.Game_rooms}>
            Game_rooms
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

export default Game_rooms;