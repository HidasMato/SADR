import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Profile.module.scss";
import ProfileAPI, { IGamerPlaysData, IMasterPlaysData, IUserData } from "../../api/Profile.api";
import Button from "../../components/Button/Button";
import { API_URL, AuthContext } from "../../context/AuthContext";

const Profile = (): JSX.Element => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<undefined | IUserData>(undefined);
    const [status, setStatus] = useState<boolean>(false);
    const [showRedactor, setShowRedactor] = useState<boolean>(false);
    const [gamerPlays, setGamerPlays] = useState<undefined | IGamerPlaysData["plays"]>(undefined);
    const [masterPlays, setMasterPlays] = useState<undefined | IMasterPlaysData["plays"]>(undefined);
    useEffect(() => {
        const getUserInfo = async () => {
            const resultUser = await ProfileAPI.getUserInfo();
            if (resultUser.status === 200) {
                if (resultUser.user) {
                    const plays = await ProfileAPI.getGamerPlays(resultUser.user.id);
                    if (plays.status === 200) {
                        setGamerPlays(plays.plays);
                    }
                }
                if (resultUser.user) {
                    const plays = await ProfileAPI.getMasterPlays(resultUser.user.id);
                    if (plays.status === 200) {
                        setMasterPlays(plays.plays);
                    }
                }
                setUserInfo(resultUser.user);
                setStatus(true);
            }
        };
        getUserInfo();
    }, []);
    const getProfileChanger = () => {
        return (
            <div className={styles.Part2}>
                <div className={styles.Buttons}>
                    <div></div>
                    <Button
                        onClick={() => {
                            setShowRedactor(false);
                        }}
                    >
                        {"Назад"}
                    </Button>
                </div>
                <label className={styles.Label} htmlFor="name">
                    {"Смена аватара"}
                </label>
                <div className={styles.InputContainer}>
                    <div className={styles.InputBlock}>
                        <label className={styles.AddImg} htmlFor="Img" id="loadImg">
                            {"Загрузить изображение"}
                        </label>
                        <input
                            className={styles.DN}
                            type="file"
                            name="Img"
                            id="Img"
                            onInput={(e) => {
                                try {
                                    const lablText = document.getElementById("loadImg") as HTMLInputElement;
                                    if (lablText) {
                                        lablText.textContent = e.currentTarget.files[0].name;
                                    }
                                } catch (error) {
                                    console.log(error);
                                }
                            }}
                        />
                    </div>
                    <Button
                        onClick={async () => {
                            const inp = document.getElementById("Img") as HTMLInputElement;
                            if (inp?.value) {
                                const resultUser = await ProfileAPI.changeImg({
                                    mail: userInfo.mail,
                                    image: inp.files[0],
                                });
                                if (resultUser.status === 200) {
                                    console.log(resultUser);
                                    setUserInfo(resultUser.user);
                                    const avatar = document.getElementById("avatar") as HTMLImageElement;
                                    if (avatar) avatar.src = URL.createObjectURL(inp.files[0]);
                                    inp.files = undefined;
                                    alert("Аватарка изменена");
                                } else alert(resultUser.message);
                            }
                        }}
                    >
                        {"Изменить"}
                    </Button>
                </div>
                <label className={styles.Label} htmlFor="name">
                    {"Смена имени"}
                </label>
                <div className={styles.InputContainer}>
                    <div className={styles.InputBlock}>
                        <input className={styles.Input} type="text" name="name" id="name" placeholder={userInfo.name} />
                    </div>
                    <Button
                        onClick={async () => {
                            const inp = document.getElementById("name") as HTMLInputElement;
                            if (inp?.value) {
                                const resultUser = await ProfileAPI.changeName({
                                    mail: userInfo.mail,
                                    newName: inp.value,
                                });
                                if (resultUser.status === 200) {
                                    setUserInfo(resultUser.user);
                                    inp.value = "";
                                    alert("Имя изменено");
                                } else alert(resultUser.message);
                            }
                        }}
                    >
                        {"Изменить"}
                    </Button>
                </div>
                <label className={styles.Label} htmlFor="oldPass">
                    {"Смена пароля"}
                </label>
                <div className={styles.InputContainer}>
                    <div className={styles.InputBlock}>
                        <label className={styles.Label} htmlFor="oldPass">
                            {"Старый пароль"}
                        </label>
                        <input className={styles.Input} type="password" name="oldPass" id="oldPass" />
                        <label className={styles.Label} htmlFor="newPass1">
                            {"Новый пароль"}
                        </label>
                        <input className={styles.Input} type="password" name="newPass1" id="newPass1" />
                        <label className={styles.Label} htmlFor="newPass2">
                            {"Повторить пароль"}
                        </label>
                        <input className={styles.Input} type="password" name="newPass2" id="newPass2" />
                    </div>
                    <Button
                        onClick={async () => {
                            const oldPass = document.getElementById("oldPass") as HTMLInputElement;
                            const newPass1 = document.getElementById("newPass1") as HTMLInputElement;
                            const newPass2 = document.getElementById("newPass2") as HTMLInputElement;
                            if (oldPass?.value && newPass1.value && newPass2.value) {
                                if (newPass1.value === newPass2.value) {
                                    const resultUser = await ProfileAPI.changePass({
                                        mail: userInfo.mail,
                                        oldPass: oldPass.value,
                                        newPass: newPass1.value,
                                    });
                                    if (resultUser.status === 200) {
                                        setUserInfo(resultUser.user);
                                        oldPass.value = "";
                                        newPass1.value = "";
                                        newPass2.value = "";
                                    } else alert(resultUser.message);
                                } else alert("Пароли не совпадают");
                            }
                        }}
                    >
                        {"Изменить"}
                    </Button>
                </div>
                <label className={styles.Label} htmlFor="mmail">
                    Смена почты
                </label>
                <div className={styles.InputContainer}>
                    <div className={styles.InputBlock}>
                        <input
                            className={styles.Input}
                            type="email"
                            name="mmail"
                            id="mmail"
                            placeholder={userInfo.mail}
                        />
                    </div>
                    <Button
                        onClick={async () => {
                            const inp = document.getElementById("mmail") as HTMLInputElement;
                            if (inp?.value) {
                                const resultUser = await ProfileAPI.changeMail({
                                    mail: inp.value,
                                });
                                if (resultUser.status === 200) {
                                    setUserInfo(resultUser.user);
                                    inp.value = "";
                                    alert("Почта изменена");
                                } else alert(resultUser.message);
                            }
                        }}
                    >
                        {"Изменить"}
                    </Button>
                </div>
            </div>
        );
    };
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
                            setShowRedactor(true);
                        }}
                    >
                        {"Редактировать аккаунт"}
                    </Button>
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
                                        {userInfo.roles.gamer ? <div className={styles.Gamer}>{"Игрок"}</div> : ""}
                                        {userInfo.roles.master ? <div className={styles.Master}>{"Мастер"}</div> : ""}
                                        {userInfo.roles.admin ? <div className={styles.Admin}>{"Админ"}</div> : ""}
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
                            {showRedactor ? getProfileChanger() : getProfile()}
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
