import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MasterPanele.module.scss";
import ProfileAPI, { IMasterPlay } from "../../api/Profile.api";
import UsersAPI, { IGamerData } from "../../api/Users.api";
import Button from "../../components/Button/Button";

const MasterPanele = (): JSX.Element => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<boolean>(false);
    const [isHaveIMasterPanele, setIsHaveIMasterPanele] = useState<boolean>(false);
    const [myPlays, setMyPlays] = useState<IMasterPlay[]>([]);
    const [chosenPlay, setChosenPlay] = useState<IMasterPlay>(undefined);
    const [chosen, setChosen] = useState<{ [key: number]: boolean }>({});
    const [gamersList, setGamersList] = useState<
        {
            id: number;
            name: string;
            show: boolean;
        }[]
    >([]);
    const [showAddGamers, setShowAddGamers] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);
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
                const getGamersList = async () => {
                    UsersAPI.getAllGamers().then((a) => {
                        if (a.status === 200)
                            setGamersList(
                                a.gamers.map((gamer) => {
                                    return {
                                        id: gamer.id,
                                        name: gamer.name,
                                        show: false,
                                    };
                                }),
                            );
                    });
                };
                getMasterPlays();
                getGamersList();
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
                                setGamersList(
                                    gamersList.map((gamer) => {
                                        return {
                                            id: gamer.id,
                                            name: gamer.name,
                                            show:
                                                newPlay.players.list.findIndex((val) => {
                                                    return val.id === gamer.id;
                                                }) !== -1,
                                        };
                                    }),
                                );
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
        const getAddGames = () => {
            return (
                <div className={styles.AddGameList}>
                    {gamersList.map((gamer) => {
                        if (!gamer.show) {
                            return (
                                <button
                                    key={"igame_" + gamer.id}
                                    onClick={() => {
                                        gamer.show = true;
                                        setGamersList([...gamersList]);
                                        setShowAddGamers(false);
                                    }}
                                >
                                    {gamer.name}
                                </button>
                            );
                        }
                        return null;
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
                                    <div className={styles.AddGamers}>
                                        <div ref={ref}>
                                            <Button
                                                onClick={() => {
                                                    setShowAddGamers(!showAddGamers);
                                                }}
                                            >
                                                {"Добавить игрока"}
                                            </Button>
                                            {showAddGamers && getAddGames()}
                                        </div>
                                    </div>
                                    <label htmlFor="message">{"Отправить сообщение игрокам"}</label>
                                    <textarea className={styles.Message} name="message" id="message"></textarea>
                                    <div className={styles.Send}>
                                        <Button>{"Отправить"}</Button>
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
