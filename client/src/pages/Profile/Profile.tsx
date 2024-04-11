import React, { useContext } from "react";
import styles from "./Profile.module.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Context } from "../../index.tsx";
import { API_URL } from "../../api/http/index.ts";
import { observer } from "mobx-react-lite";

type ProfileObject = {

}

const Profile = (): JSX.Element => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

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
                <div className={styles.Part}>
                    <button className={styles.Button} onClick={Out}>
                        Выйти из аккаунта
                    </button>
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
                <div className={styles.Profile_List}>
                    <Link to={'/games'}>Запишитесь на наши игры! У нас очень весело! *ссылка на игротеки*</Link>
                </div >

            );
    }
    const Out = async () => {
        const a = await store.logout()
        if (a.status == 200) {
            navigate("/")
        } else {
            alert(a.message)
        }
    }
    const getProfile = () => {
        const getRoles = () => {
            return (
                <div className={styles.Roles}>
                    {`Роли:`}
                </div>
            );
        }
        return (
            <div className={styles.Part}>
                <div className={styles.Image}>
                    <img src={`${API_URL}/user_${store.user.id}.png`} alt={`${API_URL}/image.png`} />
                </div>
                <div className={styles.Name}>
                    {store.user.nickname}
                </div>
                {getRoles()}
                {/* <button className={styles.Button}>Редактировать</button> */}
            </div>
        );
    }
    const Content = () => {
        if (store.isLoading) {
            return <div>Загрузка...</div>
        } else {
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
    }
    // if (store.user.id == undefined) {
    //     console.log(1)
    //     navigate("/")
    // }
    return Content();
};

export default observer(Profile);