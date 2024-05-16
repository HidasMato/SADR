import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Profile.module.scss";
import ProfileAPI, { IGamerPlay, IMasterPlay, IUserData } from "../../api/Profile.api";
import Button from "../../components/Button/Button";
import { API_URL, AuthContext } from "../../context/AuthContext";

const Profile = (): JSX.Element => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<undefined | IUserData>(undefined);
    const [status, setStatus] = useState<boolean>(false);
    const [gamerPlays, setGamerPlays] = useState<undefined | IGamerPlay[]>(undefined);
    const [masterPlays, setMasterPlays] = useState<undefined | IMasterPlay[]>(undefined);
    const [isHaveIMasterPanele, setIsHaveIMasterPanele] = useState<boolean>(false);
    const [isHaveIAdminPanele, setIsHaveIAdminPanele] = useState<boolean>(false);
    useEffect(() => {
        const getUserInfo = async () => {
            const resultUser = await ProfileAPI.getUserInfo();
            if (resultUser.status === 200) {
                const getGamerPlays = async () => {
                    ProfileAPI.getGamerPlays(resultUser.user.id).then((plays) => {
                        if (plays.status === 200) setGamerPlays(plays.plays);
                    });
                };
                const getMasterPlays = async () => {
                    ProfileAPI.getMasterPlays(resultUser.user.id).then((plays) => {
                        if (plays.status === 200) setMasterPlays(plays.plays);
                    });
                };
                const masterPanel = async () => {
                    ProfileAPI.haveIMasterPanel().then((a) => {
                        if (a.status === 200) setIsHaveIMasterPanele(a.access);
                    });
                };
                const adminPanel = async () => {
                    ProfileAPI.haveIAdminPanel().then((a) => {
                        if (a.status === 200) setIsHaveIAdminPanele(a.access);
                    });
                };
                masterPanel();
                adminPanel();
                getGamerPlays();
                getMasterPlays();
                setUserInfo(resultUser.user);
                setStatus(true);
            }
        };
        getUserInfo();
    }, []);
    const getProfile = () => {
        const getOnePlay = (play: any, ind: number) => {
            return (
                <Link className={styles.Play} key={ind} to={`/play/${play.id}`}>
                    {play.name}
                </Link>
            );
        };
        const getGamerPlays = () => {
            return (
                <div className={styles.PlaysContainer}>
                    <div>Список игротек</div>
                    {gamerPlays && gamerPlays.length > 0 ? (
                        <div className={styles.Plays}>
                            {Array.from(Array(Math.ceil(gamerPlays.length / 2)).keys()).map((blockNum) => {
                                return (
                                    <div key={"TwoPlays" + blockNum} className={styles.TwoPlays}>
                                        {gamerPlays.slice(2 * blockNum, 2 * (blockNum + 1)).map((play, ind) => {
                                            return getOnePlay(play, ind);
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={styles.Profile_List}>
                            <Link to={"/games"}>Запишитесь на наши игры! У нас очень весело! *ссылка на игротеки*</Link>
                        </div>
                    )}
                </div>
            );
        };
        const getMasterPlays = () => {
            return (
                <div className={styles.PlaysContainer}>
                    <div>Список игротек мастера</div>
                    {masterPlays?.length ? (
                        <div className={styles.Plays}>
                            {Array.from(Array(Math.ceil(masterPlays.length / 2)).keys()).map((blockNum) => {
                                return (
                                    <div key={"TwoPlays" + blockNum} className={styles.TwoPlays}>
                                        {masterPlays.slice(2 * blockNum, 2 * (blockNum + 1)).map((play, ind) => {
                                            return getOnePlay(play, ind);
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={styles.Profile_List}>
                            <Link to={"/games"}>Начни уже что-нибудь водить</Link>
                        </div>
                    )}
                </div>
            );
        };
        return (
            <div className={styles.Part2}>
                <div className={styles.Buttons}>
                    <Button
                        onClick={async () => {
                            await logout();
                            navigate("/");
                        }}
                    >
                        {"Выйти из аккаунта"}
                    </Button>
                    <Button
                        onClick={() => {
                            navigate("/profile/redact");
                        }}
                    >
                        {"Редактировать аккаунт"}
                    </Button>
                </div>
                <div className={styles.Buttons}>
                    {isHaveIMasterPanele && (
                        <Button
                            onClick={async () => {
                                navigate("/masterpanele");
                            }}
                        >
                            {"Панель мастера"}
                        </Button>
                    )}
                    {isHaveIAdminPanele && (
                        <Button
                            onClick={() => {
                                navigate("/adminpanele");
                            }}
                        >
                            {"Панель администратора"}
                        </Button>
                    )}
                </div>
                {getGamerPlays()}
                {masterPlays ? getMasterPlays() : null}
            </div>
        );
    };
    const Content = () => {
        if (userInfo) {
            return (
                <div className={styles.Main}>
                    <div className={styles.Flesh}>
                        <div className={styles.ProfileFlesh}>
                            <div className={styles.Part}>
                                <div className={styles.Image}>
                                    <img
                                        src={`${API_URL}/users/${userInfo.id}.png`}
                                        onError={(e) => {
                                            e.currentTarget.src = `${API_URL}/image.png`;
                                        }}
                                        id="avatar"
                                        alt="Аватарка"
                                    />
                                </div>
                                <div className={styles.Name}>{userInfo.name}</div>
                                <div className={styles.UnderImage}>
                                    <div className={styles.Role}>
                                        {`Роли`}
                                        {":"}
                                    </div>
                                    <div className={styles.Roles}>
                                        {userInfo.roles.gamer && <div className={styles.Gamer}>{"Игрок"}</div>}
                                        {userInfo.roles.master && <div className={styles.Master}>{"Мастер"}</div>}
                                        {userInfo.roles.admin && <div className={styles.Admin}>{"Админ"}</div>}
                                    </div>
                                </div>
                                {userInfo.mailveryfity ? (
                                    <div className={styles.MailVeryfity}>
                                        <div>{userInfo.mail}</div>
                                        <div>{"Почта подтверждена"}</div>
                                    </div>
                                ) : (
                                    <div className={styles.MailVeryfity}>
                                        <div>{userInfo.mail}</div>
                                        <Button
                                            onClick={() => {
                                                console.log("Отправить повторно");
                                            }}
                                        >
                                            {"Подтвердить почту"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {getProfile()}
                        </div>
                    </div>
                </div>
            );
        } else {
            return <div className={styles.Main}>Загрузка</div>;
        }
    };
    if (!status) return <div>Загрузка...</div>;
    else if (!userInfo) return <div>Ошибка</div>;
    else return Content();
};

export default Profile;
