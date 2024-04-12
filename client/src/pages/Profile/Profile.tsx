import React, { ReactElement, useContext, useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Context } from "../../index.tsx";
import { API_URL } from "../../api/http/index.ts";
import { observer } from "mobx-react-lite";
import UserPlaysApi from "../../api/UserPlaysApi.ts";
import { GamerPlays, MasterPlays } from "../../api/models/UserPlays.ts";

const Profile = (): JSX.Element => {
    const { store } = useContext(Context);
    const navigate = useNavigate();
    const [gamerPlays, setGamerPlays] = useState<undefined | GamerPlays[]>(undefined);
    const [masterPlays, setMasterPlays] = useState<undefined | MasterPlays[]>(undefined);
    useEffect(() => {
        if (store.user?.id) {
            UserPlaysApi.getGamerPlays(store.user.id).then(a => {
                if (a.status == 200) {
                    console.log('Записан на игротеки', a.plays)
                    setGamerPlays(a.plays)
                }
                else {
                    console.log(a.status, a.message)
                    setGamerPlays(undefined)
                }
            })
        }
        if (store.user?.role.master) {
            UserPlaysApi.getMasterPlays(store.user.id).then(a => {
                if (a.status == 200) {
                    setMasterPlays(a.plays)
                    console.log('Проводит игротеки', a.plays)
                }
                else {
                    console.log(a.status, a.message)
                    setMasterPlays(undefined)
                }
            })
        }
    }, [store.user])
    const getPart2 = () => {
        const Out = async () => {
            const a = await store.logout()
            if (a.status == 200) {
                navigate("/")
            } else {
                alert(a.message)
            }
            navigate("/")
        }
        const getGamerPlays = () => {
            const getOnePlay = (play: any, ind: number) => {
                return (
                    <Link className={styles.Play} key={ind} to={`/play/${play.id}`}>
                        {play.name}
                    </Link>
                )
            }
            return (
                <div className={styles.PlaysContainer}>
                    <div>Список игротек</div>
                    {gamerPlays
                        ? <div className={styles.Plays}>
                            {Array.from(Array(Math.ceil(gamerPlays.length / 2)).keys()).map((blockNum) => {
                                return <div key={"TwoPlays" + blockNum} className={styles.TwoPlays}>
                                    {gamerPlays.slice(2 * blockNum, 2 * (blockNum + 1)).map((play, ind) => {
                                        return getOnePlay(play, ind);
                                    })}
                                </div>
                            })}
                        </div>
                        : <div className={styles.Profile_List}>
                            <Link to={'/games'}>Запишитесь на наши игры! У нас очень весело! *ссылка на игротеки*</Link>
                        </div >}
                </div>
            );
        }
        const getMasterPlays = () => {
            const getOnePlay = (play: any, ind: number) => {
                return (
                    <Link className={styles.Play} key={ind} to={`/play/${play.id}`}>
                        {play.name}
                    </Link>
                )
            }
            return (
                <div className={styles.PlaysContainer}>
                    <div>Список игротек мастера</div>
                    {masterPlays?.length
                        ? <div className={styles.Plays}>
                            {Array.from(Array(Math.ceil(masterPlays.length / 2)).keys()).map((blockNum) => {
                                return <div key={"TwoPlays" + blockNum} className={styles.TwoPlays}>
                                    {masterPlays.slice(2 * blockNum, 2 * (blockNum + 1)).map((play, ind) => {
                                        return getOnePlay(play, ind);
                                    })}
                                </div>
                            })
                            }
                        </div>
                        : <div className={styles.Profile_List}>
                            <Link to={'/games'}>Начни уже что-нибудь водить</Link>
                        </div >}
                </div>
            );
        }
        return (
            <div className={styles.Part2}>
                <div className={styles.Buttons}>
                    <button className={styles.Button}>Редактировать аккаунт</button>
                    <button className={styles.Button} onClick={Out}>Выйти из аккаунта</button>
                </div>
                {getGamerPlays()}
                {masterPlays ? getMasterPlays() : null}
            </div>
        );

    }
    const getProfile = () => {
        return (
            <div className={styles.Part}>
                <div className={styles.Image}>
                    <img src={`${API_URL}/user_${store.user?.id}.png`} onError={(e) => { e.currentTarget.src = `${API_URL}/image.png` }} />
                </div>
                <div className={styles.Name}>
                    {store.user?.nickname}
                </div>
                <div className={styles.UnderImage}>
                    <div className={styles.Role}>{`Роли`}{':'}</div>
                    <div className={styles.Roles}>
                        {store.user?.role.user ? <div className={styles.Gamer}>{"Игрок"}</div> : ""}
                        {store.user?.role.master ? <div className={styles.Master}>{"Мастер"}</div> : ""}
                        {store.user?.role.admin ? <div className={styles.Admin}>{"Админ"}</div> : ""}
                    </div>
                </div>
                {store.user?.mailVeryfity
                    ? <div className={styles.MailVeryfity}>
                        {"Почта подтверждена"}
                    </div>
                    : <div className={styles.MailVeryfity}>
                        {"Подтвердите почту"}
                        <button className={styles.Button}>Отправить повторно</button></div>
                }
            </div>
        );
    }
    const Content = () => {
        if (store.isLoading) {
            return <div>Загрузка...</div>
        } else if (store.user) {
            return (
                <div className={styles.Main}>
                    <div className={styles.Flesh}>
                        <div className={styles.ProfileFlesh}>
                            {getProfile()}
                            {getPart2()}
                        </div>
                    </div>
                </div>
            );
        } else {
            navigate("/")
            return (
                <div>Вам недоступна эта страница</div>
            )
        }
    }
    return Content();
};

export default observer(Profile);