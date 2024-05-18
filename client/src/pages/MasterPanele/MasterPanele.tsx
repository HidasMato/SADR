import { useEffect, useState } from "react";
import styles from "./MasterPanele.module.scss";
import ProfileAPI, { IMasterPlay } from "../../api/Profile.api";
import UsersAPI from "../../api/Users.api";
import Button from "../../components/Button/Button";

const MasterPanele = (): JSX.Element => {
    const [status, setStatus] = useState<boolean>(false);
    const [isHaveIMasterPanele, setIsHaveIMasterPanele] = useState<boolean>(false);
    const [myPlays, setMyPlays] = useState<IMasterPlay[]>([]);
    const [chosenPlay, setChosenPlay] = useState<IMasterPlay>(undefined);
    const [chosen, setChosen] = useState<{ [key: number]: boolean }>({});
    useEffect(() => {
        const getUserInfo = async () => {
            const a = await ProfileAPI.haveIMasterPanel();
            if (a.status === 200 && a.access) {
                setIsHaveIMasterPanele(true);
                const getMasterPlays = async () => {
                    ProfileAPI.getMasterPlays().then((a) => {
                        if (a.status === 200) setMyPlays(a.plays);
                    });
                };
                getMasterPlays();
            }
            setStatus(true);
        };
        getUserInfo();
    }, []);
    const getmyPlays = () => {
        return (
            <div className={styles.MyPlays}>
                {myPlays.map((play) => {
                    return (
                        <button
                            className={styles.Play}
                            key={play.id}
                            onClick={() => {
                                const newPlay = structuredClone(play);
                                const r = {};
                                newPlay.players.list.forEach((gamer) => {
                                    r[gamer.id] = false;
                                });
                                setChosen(r);
                                setChosenPlay(newPlay);
                            }}
                        >
                            {play.name}
                        </button>
                    );
                })}
            </div>
        );
    };
    const Content = () => {
        const getPlayers = () => {
            return (
                <div className={styles.Players}>
                    {chosenPlay.players.list.map((gamer) => {
                        return (
                            <div key={gamer.id}>
                                <button
                                    className={styles.Player + " " + (chosen[gamer.id] ? styles.Active : "")}
                                    key={gamer.id}
                                    onClick={() => {
                                        const c = structuredClone(chosen);
                                        c[gamer.id] = !c[gamer.id];
                                        setChosen(c);
                                    }}
                                >
                                    {gamer.name}
                                </button>
                            </div>
                        );
                    })}
                </div>
            );
        };
        return (
            <div className={styles.Main}>
                <div className={styles.Flesh}>
                    <div className={styles.ProfileFlesh}>
                        {getmyPlays()}
                        <div className={styles.PlayInfo}>
                            {chosenPlay && (
                                <div className={styles.PlayInfoIn}>
                                    <div className={styles.Name}>{chosenPlay.name}</div>
                                    <div>
                                        {"Игроки:"}
                                        {chosenPlay.players.list.length}
                                        {"/"}
                                        {chosenPlay.players.max}
                                    </div>
                                    {getPlayers()}
                                    <label htmlFor="message">{"Отправить сообщение игрокам"}</label>
                                    <textarea className={styles.Message} name="message" id="message"></textarea>
                                    <div className={styles.Send}>
                                        <Button
                                            onClick={() => {
                                                UsersAPI.sendMail({
                                                    message: (document.getElementById("message") as HTMLInputElement)
                                                        .value,
                                                    users: Object.keys(chosen).filter((num) => {
                                                        return chosen[num];
                                                    }),
                                                }).then((a) => {
                                                    if (a.status === 200) alert("Сообщение отправлено");
                                                    else alert("Ошибка");
                                                });
                                            }}
                                        >
                                            {"Отправить"}
                                        </Button>
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
    else if (!isHaveIMasterPanele) return <div>Ошибка</div>;
    else return Content();
};

export default MasterPanele;
