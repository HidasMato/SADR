import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Game.module.scss";
import GameAPI, { IGameQuery } from "../../api/Game.api";
import GamesAPI from "../../api/Games.api";
import Button from "../../components/Button/Button";
import { API_URL } from "../../context/AuthContext";

const Game = (): JSX.Element => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [gameInfo, setGameInfo] = useState<IGameQuery | undefined>(undefined);
    const [status, setStatus] = useState<boolean>(false);
    const [canIAddGame, setCanIAddGame] = useState<boolean>(false);
    useEffect(() => {
        if (id !== "new")
            GameAPI.getGame(id).then((a) => {
                if (a.status === 200) {
                    setGameInfo(a.data);
                } else {
                    console.log(a.message);
                }
                setStatus(true);
            });
        else
            GamesAPI.canIAddGame().then((a) => {
                if (a) setCanIAddGame(true);
                setStatus(true);
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
                </div>
            </div>
        );
    };
    const createGame = () => {
        GameAPI.createGame({
            name: (document.getElementById("name") as HTMLInputElement).value,
            minplayers: Number((document.getElementById("minplayers") as HTMLInputElement).value),
            maxplayers: Number((document.getElementById("maxplayers") as HTMLInputElement).value),
            mintimeplay: Number((document.getElementById("mintimeplay") as HTMLInputElement).value),
            maxtimeplay: Number((document.getElementById("maxtimeplay") as HTMLInputElement).value),
            hardless: Number((document.getElementById("hardless") as HTMLInputElement).value),
            description: (document.getElementById("description") as HTMLInputElement).value,
            image: (document.getElementById("image") as HTMLInputElement).files[0],
        }).then((a) => {
            if (a.status === 200) {
                setStatus(false);
                navigate(`/game/${a.id}`);
                navigate(0);
            } else {
                //TODO: Это заменить на визуальные показания неверности хуйни
                alert(a.message);
            }
        });
    };
    //TODO: Проверка введенных элементов, что мин < макс
    const getGameCreator = () => {
        return (
            <div className={styles.Flesh}>
                <div className={styles.PartImg}>
                    <img id="previewImage" src={`${API_URL}/image.png`} alt="Игра" />
                    <div>
                        <label htmlFor={`image`}>Выбрать изображение</label>
                    </div>
                    <input
                        className={styles.InputImg}
                        type="file"
                        name="image"
                        id="image"
                        onInput={(e) => {
                            const file = e.target as HTMLInputElement;
                            const R = file?.files;
                            const img = document.getElementById("previewImage") as HTMLImageElement;
                            if (img && R[0]) {
                                img.src = URL.createObjectURL((e.target as HTMLInputElement).files[0]);
                            }
                        }}
                    />
                    <input className={styles.Name} placeholder="Имя" type="text" name="name" id="name" />
                </div>
                <div className={styles.PartDescription}>
                    <div className={styles.PlayNumAndTime}>
                        <div>
                            {`Количество игроков: `}
                            <input name="minplayers" id="minplayers" type="number" min={1} max={20}></input>
                            {` - `}
                            <input name="maxplayers" id="maxplayers" type="number" min={1} max={20}></input>
                        </div>
                        <div>
                            {`Время игры: `}
                            <input name="mintimeplay" id="mintimeplay" type="number" min={1} max={20}></input>
                            {` - `}
                            <input name="maxtimeplay" id="maxtimeplay" type="number" min={1} max={20}></input>
                        </div>
                    </div>
                    <div className={styles.PlayNumAndTime}>
                        <div>
                            {`Сложность: `}
                            <select name="hardless" id="hardless">
                                <option value="1">{getHardless(1)}</option>
                                <option value="2">{getHardless(2)}</option>
                                <option value="3">{getHardless(3)}</option>
                            </select>
                        </div>
                    </div>
                    <textarea className={styles.Description} name="description" id="description"></textarea>
                    <Button
                        onClick={() => {
                            createGame();
                        }}
                    >
                        Создать
                    </Button>
                </div>
            </div>
        );
    };
    const getGamePage = () => {
        if (!status) return <div className={styles.Main}>Загрузка</div>;
        if (gameInfo) return <div className={styles.Main}>{getGame()}</div>;
        return <div className={styles.Main}>Ошибка</div>;
    };
    const getGameCreaterPage = () => {
        if (!status) return <div className={styles.Main}>Загрузка</div>;
        if (canIAddGame) return <div className={styles.Main}>{getGameCreator()}</div>;
        return <div className={styles.Main}>Ошибка</div>;
    };
    const getMain = () => {
        if (id === "new") return getGameCreaterPage();
        return getGamePage();
    };
    return getMain();
};

export default Game;
