import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./Play.module.scss";
import PlayAPI, { ICommentDate, IPlayQuery } from "../../api/Play.api";
import Button from "../../components/Button/Button";
import { API_URL } from "../../context/AuthContext";

const Play = (): JSX.Element => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [playInfo, setPlayInfo] = useState<IPlayQuery | undefined>(undefined);
    const [status, setStatus] = useState<boolean>(false);
    const [canIChangeAddPlay, setCanIChangeAddPlay] = useState<boolean>(false);
    const [canIGoToPlay, setCanIGoToPlay] = useState<number>(0);
    const [comments, setComments] = useState<ICommentDate[]>([]);
    const [canIComments, setCanIComments] = useState<boolean>(false);
    useEffect(() => {
        PlayAPI.getPlay(id).then((a) => {
            if (a.status === 200) {
                setPlayInfo(a.data);
                PlayAPI.canIChangePlay(id).then((a) => {
                    if (a.status === 200) setCanIChangeAddPlay(a.access);
                });
                PlayAPI.canIGoToPlay(id).then((a) => {
                    if (a.status === 200) setCanIGoToPlay(a.access);
                });
                PlayAPI.getComments({ id }).then((a) => {
                    if (a.status === 200) setComments(a.comments);
                });
                PlayAPI.canIAddComment({ id }).then((a) => {
                    if (a.status === 200) setCanIComments(a.access);
                });
            }
            setStatus(true);
        });
    }, []);
    const getPlay = () => {
        const printDate = (myDate: Date) => {
            return `${myDate.getFullYear()}.${myDate.getMonth() + 1 > 9 ? myDate.getMonth() + 1 : "0" + (myDate.getMonth() + 1)}.${myDate.getDate() > 9 ? myDate.getDate() : "0" + myDate.getDate()} ${myDate.getHours() > 9 ? myDate.getHours() : "0" + myDate.getHours()}:${myDate.getMinutes() > 9 ? myDate.getMinutes() : "0" + myDate.getMinutes()}`;
        };
        const getChanceToRegistr = () => {
            if (!playInfo.status.status) return <div>{`ИГРА ОТМЕНЕНА`}</div>;
            if (canIGoToPlay == 0) return <div>{"Запись недоступна"}</div>;
            if (playInfo.players.count >= playInfo.players.max)
                return (
                    <div>
                        {`Участники: ${playInfo.players.count} / ${playInfo.players.max}  `}
                        {"(Мест нет)"}
                    </div>
                );
            switch (canIGoToPlay) {
                case 1:
                    return (
                        <div>
                            {`Участники: ${playInfo.players.count} / ${playInfo.players.max}  `}
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
                        </div>
                    );
                case 2:
                    return (
                        <div>
                            {`Участники: ${playInfo.players.count} / ${playInfo.players.max}  `}
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
                        </div>
                    );
            }
        };
        return (
            <div className={styles.Flesh}>
                <div className={styles.Container}>
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
                            {getChanceToRegistr()}
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
                <div className={styles.Comments}>
                    <div className={styles.Title}>
                        <label htmlFor="coment">{"Наши коментарии"}</label>
                        {playInfo.status.dateEnd < new Date() && canIComments && (
                            <div>
                                <textarea name="coment" id="coment"></textarea>
                                <Button
                                    onClick={() => {
                                        PlayAPI.addComment({
                                            id,
                                            text: (document.getElementById("coment") as HTMLInputElement).value,
                                        }).then((a) => {
                                            if (a.status === 200) {
                                                alert("Комент добавлен");
                                                navigate(0);
                                            } else alert(a.message);
                                        });
                                    }}
                                >
                                    Жобавить
                                </Button>
                            </div>
                        )}
                    </div>
                    {comments.map((com, ind) => {
                        return (
                            <div
                                key={"com" + com.id}
                                className={styles.Comment + " " + (ind % 2 === 1 ? styles.Second : "")}
                            >
                                <div className={styles.Name}>{com.name}</div>
                                <div className={styles.Date}>
                                    {" "}
                                    {com.date.getDate() < 9 ? "0" + com.date.getDate() : com.date.getDate()}
                                    {"."}
                                    {com.date.getMonth() + 1 < 9
                                        ? "0" + (com.date.getMonth() + 1)
                                        : com.date.getMonth() + 1}
                                    {"."}
                                    {com.date.getFullYear()}
                                </div>
                                <div className={styles.Text}>{com.text}</div>
                            </div>
                        );
                    })}
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
