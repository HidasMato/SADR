import { useEffect, useState } from "react";
import styles from "./AdminPanele.module.scss";
import ProfileAPI from "../../api/Profile.api";
import UsersAPI, { IGamerData, IGamerPlusData } from "../../api/Users.api";
import Button from "../../components/Button/Button";

const AdminPanele = (): JSX.Element => {
    const [status, setStatus] = useState<boolean>(false);
    const [isHaveIAdminPanele, setIsHaveIAdminPanele] = useState<boolean>(false);
    const [gamersList, setGamersList] = useState<IGamerData[]>([]);
    const [activeUser, setActiveUser] = useState<IGamerPlusData>(undefined);
    useEffect(() => {
        const getUserInfo = async () => {
            const a = await ProfileAPI.haveIAdminPanel();
            if (a.status === 200) {
                setIsHaveIAdminPanele(a.access);
                const getGamersList = async () => {
                    UsersAPI.getAllGamers().then((a) => {
                        if (a.status === 200) setGamersList(a.gamers);
                    });
                };
                getGamersList();
            }
            setStatus(true);
        };
        getUserInfo();
    }, []);
    const getUser = (id: string) => {
        UsersAPI.getOneUser(id).then((a) => {
            if (a.status === 200) setActiveUser(a.user);
        });
    };
    const Content = () => {
        const isMaster = () => {
            if (activeUser.roles.master)
                return (
                    <div className={styles.Role}>
                        <div> {"Является мастером"}</div>
                        <div>
                            {"Описание: "}
                            {activeUser?.description}
                        </div>
                        <Button
                            onClick={() => {
                                UsersAPI.unsetMaster({ id: activeUser.id, mail: activeUser.mail }).then((a) => {
                                    if (a.status === 200) getUser(activeUser.id);
                                });
                            }}
                        >
                            {"Разжаловать до игрока"}
                        </Button>
                    </div>
                );
            else
                return (
                    <div className={styles.Role}>
                        <Button
                            onClick={() => {
                                UsersAPI.setMaster({ id: activeUser.id, mail: activeUser.mail }).then((a) => {
                                    if (a.status === 200) getUser(activeUser.id);
                                });
                            }}
                        >
                            {"Сделать мастером"}
                        </Button>
                    </div>
                );
        };
        const getAdminInfo = () => {
            return <div>{"Является админом"}</div>;
        };
        return (
            <div className={styles.Main}>
                <div className={styles.Flesh}>
                    <div className={styles.ProfileFlesh}>
                        <div className={styles.MyGamers}>
                            {gamersList.map((gamer) => {
                                return (
                                    <button
                                        className={styles.Gamers}
                                        key={gamer.id}
                                        onClick={() => {
                                            getUser(gamer.id);
                                        }}
                                    >
                                        {gamer.name}
                                    </button>
                                );
                            })}
                        </div>
                        <div className={styles.PlayInfo}>
                            {activeUser && (
                                <div className={styles.PlayInfoIn}>
                                    <div className={styles.Name}>{activeUser.name}</div>
                                    <div>{`id: ${activeUser.id}`}</div>
                                    <div>
                                        {`mail: ${activeUser.mail} ${activeUser.mailveryfity ? "Подтверждена" : "Не подтверждена"}`}{" "}
                                    </div>
                                    {isMaster()}
                                    <div className={styles.Role}>
                                        {activeUser.roles.admin ? (
                                            getAdminInfo()
                                        ) : (
                                            <Button
                                                onClick={() => {
                                                    console.log("Сделать админом");
                                                }}
                                            >
                                                {"Сделать админом"}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    if (!status) return <div>Загрузка...</div>;
    else if (!isHaveIAdminPanele) return <div>Ошибка</div>;
    else return Content();
};

export default AdminPanele;
