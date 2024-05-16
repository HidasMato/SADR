import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./Play.module.scss";
import PlayAPI, { IPlayQuery } from "../../api/Play.api";
import Button from "../../components/Button/Button";
import { API_URL } from "../../context/AuthContext";

const Play = (): JSX.Element => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [playInfo, setPlayInfo] = useState<IPlayQuery | undefined>(undefined);
    const [status, setStatus] = useState<boolean>(false);
    const [canIChangeAddPlay, setCanIChangeAddPlay] = useState<boolean>(false);
    const [canIGoToPlay, setCanIGoToPlay] = useState<number>(0);
    useEffect(() => {
        PlayAPI.getPlay(id).then((a) => {
            if (a.status === 200) {
                setPlayInfo(a.data);
            }
            setStatus(true);
        });
        PlayAPI.canIChangePlay(id).then((a) => {
            if (a.status === 200) setCanIChangeAddPlay(a.access);
        });
        PlayAPI.canIGoToPlay(id).then((a) => {
            if (a.status === 200) setCanIGoToPlay(a.access);
        });
    }, []);
    const getPlay = () => {
        const printDate = (myDate: Date) => {
            return `${myDate.getFullYear()}.${myDate.getMonth() + 1 > 9 ? myDate.getMonth() + 1 : "0" + (myDate.getMonth() + 1)}.${myDate.getDate() > 9 ? myDate.getDate() : "0" + myDate.getDate()} ${myDate.getHours() > 9 ? myDate.getHours() : "0" + myDate.getHours()}:${myDate.getMinutes() > 9 ? myDate.getMinutes() : "0" + myDate.getMinutes()}`;
        };
        return (
            <div className={styles.Flesh}>
                <div className={styles.PartImg}>
                    <img
                        src={`${API_URL}/plays/${playInfo.id}.png`}
                        onError={(e) => {
                            e.currentTarget.src = `${API_URL}/image.png`;
                        }}
                        alt="Игротека"
                    />
                    <div className={styles.Name}>{playInfo.name}</div>
                </div>
                <div className={styles.PartDescription}>
                    <div className={styles.PlayNumAndTime}>
                        <div>{`Старт: ${printDate(playInfo.status.dateStart)}`}</div>
                        <div>{`Окончание: ${printDate(playInfo.status.dateEnd)}`}</div>
                    </div>
                    <div className={styles.PlayNumAndTime}>
                        <div>
                            {`Участники: ${playInfo.players.count} / ${playInfo.players.max}  `}
                            {playInfo.players.count >= playInfo.players.max ? (
                                "(Мест нет)"
                            ) : canIGoToPlay === 1 ? (
                                <Button
                                    onClick={() => {
                                        PlayAPI.addGamerToPlay({ id: playInfo.id }).then((a) => {
                                            if (a.status === 200) {
                                                setCanIGoToPlay(2);
                                                const r = structuredClone(playInfo);
                                                r.players.count += 1;
                                                setPlayInfo(r);
                                                alert(a.message);
                                            } else alert(a.message);
                                        });
                                    }}
                                >
                                    {"Записаться"}
                                </Button>
                            ) : (
                                canIGoToPlay === 2 && (
                                    <Button
                                        type="red"
                                        onClick={() => {
                                            PlayAPI.deleteGamerToPlay({ id: playInfo.id }).then((a) => {
                                                if (a.status === 200) {
                                                    setCanIGoToPlay(1);
                                                    const r = structuredClone(playInfo);
                                                    r.players.count -= 1;
                                                    setPlayInfo(r);
                                                    alert(a.message);
                                                } else alert(a.message);
                                            });
                                        }}
                                    >
                                        {"Отписаться"}
                                    </Button>
                                )
                            )}
                        </div>
                        <div>{`Мастер: ${playInfo.master.name}`}</div>
                    </div>
                    <div className={styles.Games}>
                        {"Игры: "}
                        {playInfo.games.map((game) => {
                            return (
                                <div className={styles.OneGame} key={"game_" + game.id}>
                                    <Link
                                        key={`game` + game.id}
                                        to={`/game/${game.id}`}
                                        target="_blank"
                                        className={styles.Game}
                                    >
                                        {game.name}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.Description}>{playInfo.description}</div>
                    {canIChangeAddPlay ? (
                        <Button
                            onClick={() => {
                                navigate(`/play/change/${id}`);
                            }}
                        >
                            {"Изменить игротеку"}
                        </Button>
                    ) : null}
                </div>
            </div>
        );
    };
    const getMain = () => {
        if (!status) return <div className={styles.Main}>Загрузка</div>;
        if (playInfo) return <div className={styles.Main}>{getPlay()}</div>;
        return <div className={styles.Main}>Ошибка</div>;
    };
    return getMain();
};

export default Play;
