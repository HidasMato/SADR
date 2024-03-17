import React from "react";
import styles from "./Profile.module.scss";
import TestComponent from "../../components/TestComponent/TestComponent.tsx";
import { useParams } from "react-router-dom";

type ProfileObject={

}

const Profile = ():JSX.Element=>{
	const {id} = useParams();
	return(
		<div className={styles.Profile}>
            Profile
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

export default Profile;