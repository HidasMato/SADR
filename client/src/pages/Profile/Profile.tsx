import { useContext, useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../context/AuthContext";
import UserProfileAPI, {
    IGamerPlaysData,
    IMasterPlaysData,
    IUserData,
} from "../../api/UserProfile.api";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../components/Button/Button";

const Profile = (): JSX.Element => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<undefined | IUserData>(undefined);
    const [gamerPlays, setGamerPlays] = useState<
        undefined | IGamerPlaysData["plays"]
    >(undefined);
    const [masterPlays, setMasterPlays] = useState<
        undefined | IMasterPlaysData["plays"]
    >(undefined);
    useEffect(() => {
        UserProfileAPI.getUserInfo().then((a) => {
            setUserInfo(a);
        });
    }, []);
    useEffect(() => {
        if (userInfo?.roles.gamer) {
            UserProfileAPI.getGamerPlays(userInfo.id).then((a) => {
                setGamerPlays(a.plays);
            });
        }
        if (userInfo?.roles.master) {
            UserProfileAPI.getMasterPlays(userInfo.id).then((a) => {
                setMasterPlays(a.plays);
            });
        }
    }, [userInfo]);
    const getPart2 = () => {
        const Out = async () => {
            const a = await logout();
            navigate("/");
        };
        const getGamerPlays = () => {
            const getOnePlay = (play: any, ind: number) => {
                return (
                    <Link
                        className={styles.Play}
                        key={ind}
                        to={`/play/${play.id}`}
                    >
                        {play.name}
                    </Link>
                );
            };
            return (
                <div className={styles.PlaysContainer}>
                    <div>Список игротек</div>
                    {gamerPlays && gamerPlays.length > 0 ? (
                        <div className={styles.Plays}>
                            {Array.from(
                                Array(Math.ceil(gamerPlays.length / 2)).keys(),
                            ).map((blockNum) => {
                                return (
                                    <div
                                        key={"TwoPlays" + blockNum}
                                        className={styles.TwoPlays}
                                    >
                                        {gamerPlays
                                            .slice(
                                                2 * blockNum,
                                                2 * (blockNum + 1),
                                            )
                                            .map((play, ind) => {
                                                return getOnePlay(play, ind);
                                            })}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={styles.Profile_List}>
                            <Link to={"/games"}>
                                Запишитесь на наши игры! У нас очень весело!
                                *ссылка на игротеки*
                            </Link>
                        </div>
                    )}
                </div>
            );
        };
        const getMasterPlays = () => {
            const getOnePlay = (play: any, ind: number) => {
                return (
                    <Link
                        className={styles.Play}
                        key={ind}
                        to={`/play/${play.id}`}
                    >
                        {play.name}
                    </Link>
                );
            };
            return (
                <div className={styles.PlaysContainer}>
                    <div>Список игротек мастера</div>
                    {masterPlays?.length ? (
                        <div className={styles.Plays}>
                            {Array.from(
                                Array(Math.ceil(masterPlays.length / 2)).keys(),
                            ).map((blockNum) => {
                                return (
                                    <div
                                        key={"TwoPlays" + blockNum}
                                        className={styles.TwoPlays}
                                    >
                                        {masterPlays
                                            .slice(
                                                2 * blockNum,
                                                2 * (blockNum + 1),
                                            )
                                            .map((play, ind) => {
                                                return getOnePlay(play, ind);
                                            })}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={styles.Profile_List}>
                            <Link to={"/games"}>
                                Начни уже что-нибудь водить
                            </Link>
                        </div>
                    )}
                </div>
            );
        };
        return (
            <div className={styles.Part2}>
                <div className={styles.Buttons}>
                    <Button
                        text={"Редактировать аккаунт"}
                        onClick={() => {
                            console.log("Редактировать аккаунт");
                        }}
                    />
                    <Button text={"Выйти из аккаунта"} onClick={Out} />
                </div>
                {getGamerPlays()}
                {masterPlays ? getMasterPlays() : null}
            </div>
        );
    };
    const getProfile = () => {
        return (
            <div className={styles.Part}>
                <div className={styles.Image}>
                    <img
                        src={`${API_URL}/users/${userInfo.id}.png`}
                        onError={(e) => {
                            e.currentTarget.src = `${API_URL}/image.png`;
                        }}
                    />
                </div>
                <div className={styles.Name}>{userInfo.nickname}</div>
                <div className={styles.UnderImage}>
                    <div className={styles.Role}>
                        {`Роли`}
                        {":"}
                    </div>
                    <div className={styles.Roles}>
                        {userInfo.roles.gamer ? (
                            <div className={styles.Gamer}>{"Игрок"}</div>
                        ) : (
                            ""
                        )}
                        {userInfo.roles.master ? (
                            <div className={styles.Master}>{"Мастер"}</div>
                        ) : (
                            ""
                        )}
                        {userInfo.roles.admin ? (
                            <div className={styles.Admin}>{"Админ"}</div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
                {userInfo.mailVeryfity ? (
                    <div className={styles.MailVeryfity}>
                        {"Почта подтверждена"}
                    </div>
                ) : (
                    <div className={styles.MailVeryfity}>
                        {"Подтвердите почту"}
                        <Button
                            text={"Отправить повторно"}
                            onClick={() => {
                                console.log("Отправить повторно");
                            }}
                        />
                    </div>
                )}
            </div>
        );
    };
    const Content = () => {
        if (userInfo != undefined) {
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
            return <div className={styles.Main}>Загрузка</div>;
        }
    };
    return Content();
};

export default Profile;
