import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProfileRedact.module.scss";
import ProfileAPI, { IUserData } from "../../api/Profile.api";
import Button from "../../components/Button/Button";
import { API_URL } from "../../context/AuthContext";

const ProfileRedact = (): JSX.Element => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<undefined | IUserData>(undefined);
    const [status, setStatus] = useState<boolean>(false);
    useEffect(() => {
        const getUserInfo = async () => {
            const resultUser = await ProfileAPI.getUserInfo();
            if (resultUser.status === 200) {
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
                            navigate("/profile");
                        }}
                    >
                        {"Назад"}
                    </Button>
                </div>
                <label className={styles.Label} htmlFor="Img">
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
                                    setUserInfo(resultUser.user);
                                    const avatar = document.getElementById("avatar") as HTMLImageElement;
                                    if (avatar) avatar.src = URL.createObjectURL(inp.files[0]);
                                    inp.files = undefined;
                                    alert("Аватарка изменена");
                                    navigate(0);
                                } else alert(resultUser.message);
                            }
                        }}
                    >
                        {"Изменить"}
                    </Button>
                </div>
                <label className={styles.Label} htmlFor="nick">
                    {"Смена имени"}
                </label>
                <div className={styles.InputContainer}>
                    <div className={styles.InputBlock}>
                        <input className={styles.Input} type="text" name="nick" id="nick" placeholder={userInfo.name} />
                    </div>
                    <Button
                        onClick={async () => {
                            const inp = document.getElementById("nick") as HTMLInputElement;
                            if (inp?.value) {
                                const resultUser = await ProfileAPI.changeName({
                                    mail: userInfo.mail,
                                    newName: inp.value,
                                });
                                if (resultUser.status === 200) {
                                    setUserInfo(resultUser.user);
                                    inp.value = "";
                                    alert("Имя изменено");
                                    navigate(0);
                                } else alert(resultUser.message);
                            }
                        }}
                    >
                        {"Изменить"}
                    </Button>
                </div>
                <label className={styles.Label} htmlFor="mil">
                    Смена почты
                </label>
                <div className={styles.InputContainer}>
                    <div className={styles.InputBlock}>
                        <input className={styles.Input} type="email" name="mil" id="mil" placeholder={userInfo.mail} />
                    </div>
                    <Button
                        onClick={async () => {
                            const inp = document.getElementById("mil") as HTMLInputElement;
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
                                        alert("Пароль успешно изменен");
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
                <label className={styles.Label} htmlFor="description">
                    {"Смена описания"}
                </label>
                <div className={styles.InputContainer}>
                    <div className={styles.InputBlock}>
                        <textarea
                            className={styles.Input + " " + styles.Textarea}
                            name="description"
                            id="description"
                        />
                    </div>
                    <Button
                        onClick={async () => {
                            const inp = document.getElementById("description") as HTMLInputElement;
                            if (inp?.value) {
                                const resultUser = await ProfileAPI.changeDescription({
                                    mail: userInfo.mail,
                                    description: inp.value,
                                });
                                if (resultUser.status === 200) {
                                    setUserInfo(resultUser.user);
                                    inp.value = "";
                                    alert("Описание изменено");
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
                            {getProfileChanger()}
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

export default ProfileRedact;
