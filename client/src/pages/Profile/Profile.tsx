import React from "react";
import styles from "./Profile.module.scss";
import TestComponent from "../../components/TestComponent/TestComponent.tsx";
import { useParams } from "react-router-dom";

type ProfileObject={

}

const Profile = ():JSX.Element=>{
	const {id} = useParams();
	return(
		<div className={styles.Main}>
			<div className={styles.Flesh}>
				<div className={styles.ProfileFlesh}>
					<div className={styles.ProfileGrid}>
						<div className={styles.Profile_Image}>
							<div className={styles.Image}>profile_image</div>
						</div>
						<div className={styles.Profile_Name}>
							BDanil
						</div>
						<div className={styles.Profile_Role}>
							Роль пользователя: Smesharik
						</div>
						<div className={styles.Profile_List}>
							Список игротек
						</div>
						<div className={styles.Profile_Admin}>
							<button className={styles.Button}>Редактировать</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;