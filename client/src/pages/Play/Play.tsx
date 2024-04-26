import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./Play.module.scss";
import PlayAPI, { IPlayQuery } from "../../api/Play.api";
import { API_URL } from "../../context/AuthContext";

const Play = (): JSX.Element => {
    const { id } = useParams();
    const [playInfo, setPlayInfo] = useState<IPlayQuery | undefined>(undefined);
    const [status, setStatus] = useState<boolean>(false);
    useEffect(() => {
        PlayAPI.getPlay(Number(id)).then((a) => {
            if (a.status === 200) {
                setPlayInfo(a.data);
            }
            setStatus(true);
        });
    }, []);
    const getGame = () => {
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
                    <div>{playInfo.name}</div>
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
                            ) : (
                                <button>{"Записаться"}</button>
                            )}
                        </div>
                    </div>
                    <div className={styles.Games}>
                        {playInfo.games.map((game) => {
                            return (
                                <Link
                                    key={`game` + game.id}
                                    to={`/game/${game.id}`}
                                    target="_blank"
                                    className={styles.Game}
                                >
                                    {game.name}
                                </Link>
                            );
                        })}
                    </div>
                    <div className={styles.Description}>{playInfo.description}</div>
                </div>
            </div>
        );
    };
    const getMain = () => {
        if (!status) return <div className={styles.Main}>Загрузка</div>;
        if (playInfo) return <div className={styles.Main}>{getGame()}</div>;
        return <div className={styles.Main}>Ошибка</div>;
    };
    return getMain();
};

export default Play;
