import React from "react";
import styles from "./Profile.module.scss";
import TestComponent from "../../components/TestComponent/TestComponent.tsx";
import { Link, useParams } from "react-router-dom";

type ProfileObject = {

}

const Profile = (): JSX.Element => {
    const { id } = useParams();
    const request = {
        image: 'хз пока как мы это будем делвть',
        userName: 'BDanil',
        role: 'Smesharik',
        plays: [
            {
                name: 'Игротека1',
                link: 'тут ссыль'
            },
            {
                name: 'Игротека2',
                link: 'тут ссыль'
            },
            {
                name: 'Игротека3',
                link: 'тут ссыль'
            },
            {
                name: 'Игротека4',
                link: 'тут ссыль'
            },
            {
                name: 'Игротека5',
                link: 'тут ссыль'
            }
        ]
    }
    const getPlays = () => {
        if (request.plays.length != 0)
            return (
                <div className={styles.Profile_List}>
                    Список игротек
                    {
                        Array.from(Array(Math.ceil(request.plays.length / 2)).keys()).map((blockNum) => {
                            return <div key={"TwoPlays" + blockNum} className={styles.TwoPlays}>
                                {
                                    request.plays.slice(2 * blockNum, 2 * (blockNum + 1)).map((play) => {
                                        return (
                                            <div className={styles.Play}>
                                                {
                                                    <Link to={play.link}>
                                                        {play.name}
                                                    </Link>
                                                }
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        })
                    }
                </div>
            );
        else
            return (
                // А ссылки с гридами чота не сочетаются :(
                // Хз можно ли так реализовать
                // Но было бы прикольно
                <div className={styles.Profile_List}>
                    <Link to={'/games'}>Запишитесь на наши игры! У нас очень весело! *ссылка на игротеки*</Link>
                </div >

            );
    }
    const getProfile = () => {
        if (request)
            return (
                <div className={styles.ProfileGrid}>
                    <div className={styles.Profile_Image}>
                        <div className={styles.Image}><img src={request.image} alt="Изображение пользователя" /></div>
                    </div>
                    <div className={styles.Profile_Name}>
                        {request.userName}
                    </div>
                    <div className={styles.Profile_Role}>
                        Роль пользователя:
                        {request.role}
                    </div>
                    {getPlays()}
                    <div className={styles.Profile_Admin}>
                        <button className={styles.Button}>Редактировать</button>
                    </div>
                </div>
            );
        else
            return (
                <div>Загрузка....</div>
            );
    }
    const Content = () => {
        return (
            <div className={styles.Main}>
                <div className={styles.Flesh}>
                    <div className={styles.ProfileFlesh}>
                        {getProfile()}
                    </div>
                </div>
            </div>
        );
    }
    return Content();
};

export default Profile;