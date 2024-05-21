import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./Game.module.scss";
import GameAPI, { ICommentDate, IGameQuery } from "../../api/Game.api";
import PlayAPI, { IPlayData } from "../../api/Play.api";
import Button from "../../components/Button/Button";
import { API_URL } from "../../context/AuthContext";

const Game = (): JSX.Element => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [gameInfo, setGameInfo] = useState<IGameQuery | undefined>(undefined);
    const [status, setStatus] = useState<boolean>(false);
    const [canIChangeGame, setCanIChangeGame] = useState<boolean>(false);
    const [myPlays, setMyPlays] = useState<IPlayData[]>(undefined);
    const [comments, setComments] = useState<ICommentDate[]>([]);
    const [canIComments, setCanIComments] = useState<boolean>(false);
    useEffect(() => {
        GameAPI.getGame(id).then((a) => {
            if (a.status === 200) {
                setGameInfo(a.data);
            } else {
                alert(a.message);
            }
            setStatus(true);
        });
        GameAPI.canIChangeGame().then((a) => {
            if (a.status === 200 && a.access) setCanIChangeGame(true);
        });
        PlayAPI.getNextPlays({ id: id }).then((a) => {
            if (a.status === 200) setMyPlays(a.plays);
        });
        GameAPI.getComments({ id }).then((a) => {
            if (a.status === 200) setComments(a.comments);
        });
        GameAPI.canIAddComment({ id }).then((a) => {
            console.log(a);
            if (a.status === 200) setCanIComments(a.access);
        });
    }, []);
    const getHardless = (hardless: number) => {
        switch (hardless) {
            case 1:
                return "легко";
            case 2:
                return "средне";
            case 3:
                return "тяжело";
            default:
                return "неопределено";
        }
    };
    const getGame = () => {
        return (
            <div className={styles.Flesh}>
                <div className={styles.GameAbout}>
                    <div className={styles.PartImg}>
                        <img
                            src={`${API_URL}/games/${gameInfo.id}.png`}
                            onError={(e) => {
                                e.currentTarget.src = `${API_URL}/image.png`;
                            }}
                            alt="Игра"
                        />
                        <div className={styles.Name}>{gameInfo.name}</div>
                    </div>
                    <div className={styles.PartDescription}>
                        <div className={styles.PlayNumAndTime}>
                            <div>{`Количество игроков: ${gameInfo.minplayers}-${gameInfo.maxplayers}`}</div>
                            <div>{`Время игры: ${gameInfo.mintimeplay}-${gameInfo.maxtimeplay} минут`}</div>
                        </div>
                        <div className={styles.PlayNumAndTime}>{`Сложность: ${getHardless(gameInfo.hardless)}`}</div>
                        <div className={styles.Description}>{gameInfo.description}</div>
                        {canIChangeGame ? (
                            <Button
                                onClick={() => {
                                    navigate(`/game/change/${id}`);
                                }}
                            >
                                {"Изменить игру"}
                            </Button>
                        ) : null}
                    </div>
                </div>
                {myPlays && (
                    <div className={styles.NextPlays}>
                        <div>{"Ждите игру на игротеках:"}</div>
                        <div>
                            {myPlays.map((play) => {
                                return (
                                    <Link
                                        className={styles.Play + " " + (play.status.status ? "" : styles.Disactive)}
                                        target="_blank"
                                        key={play.id}
                                        to={`/play/${play.id}`}
                                    >
                                        {play.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
                <div className={styles.Comments}>
                    <div className={styles.Title}>
                        <label htmlFor="coment">{"Наши коментарии"}</label>
                        {canIComments && (
                            <div>
                                <textarea name="coment" id="coment"></textarea>
                                <Button
                                    onClick={() => {
                                        GameAPI.addComment({
                                            id,
                                            text: (document.getElementById("coment") as HTMLInputElement).value,
                                        }).then((a) => {
                                            console.log(a);
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
        if (gameInfo) return <div className={styles.Main}>{getGame()}</div>;
        return <div className={styles.Main}>Ошибка</div>;
    };
    return getMain();
};

export default Game;
