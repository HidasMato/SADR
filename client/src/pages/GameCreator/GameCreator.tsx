import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./GameCreator.module.scss";
import GameAPI from "../../api/Game.api";
import Button from "../../components/Button/Button";
import OptionSelector from "../../components/OptionSelector/OptionSelector";
import { API_URL } from "../../context/AuthContext";

const GameCreator = ({ mode = "create" }: { mode?: "create" | "change" }): JSX.Element => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [status, setStatus] = useState<boolean>(false);
    const [canIBeHere, setCanIBeHere] = useState<boolean>(false);
    const [canIDelete, setCanIDelete] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [minplayers, setMinplayers] = useState<number>(1);
    const [maxplayers, setMaxplayers] = useState<number>(20);
    const [mintimeplay, setMintimeplay] = useState<number>(10);
    const [maxtimeplay, setMaxtimeplay] = useState<number>(60);
    const [hardless, setHardless] = useState<number>(1);
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<File>();
    useEffect(() => {
        const iCreate = async () => {
            const result = await GameAPI.canICreateGame();
            if (result.status === 200 && result.access) setCanIBeHere(true);
            setStatus(true);
        };
        const iUpdate = async () => {
            const result = await GameAPI.canIChangeGame();
            if (result.status === 200 && result.access) {
                const result = await GameAPI.getGame(id);
                if (result.status === 200) {
                    setName(result.data.name);
                    setDescription(result.data.description);
                    setHardless(result.data.hardless);
                    setMaxplayers(result.data.maxplayers);
                    setMaxtimeplay(result.data.maxtimeplay);
                    setMinplayers(result.data.minplayers);
                    setMintimeplay(result.data.mintimeplay);
                    GameAPI.canIDeleteGame().then((a) => {
                        if (a.status === 200) setCanIDelete(a.access);
                    });
                    setCanIBeHere(true);
                }
            }
            setStatus(true);
        };
        if (mode === "change") iUpdate();
        else iCreate();
    }, []);
    const getHardless = (hardless: number) => {
        switch (hardless) {
            case 1:
                return "Легко";
            case 2:
                return "Средне";
            case 3:
                return "Тяжело";
            default:
                return "Неопределено";
        }
    };
    const createGame = () => {
        if (mode === "create")
            GameAPI.createGame({
                name: name,
                minplayers: minplayers,
                maxplayers: maxplayers,
                mintimeplay: mintimeplay,
                maxtimeplay: maxtimeplay,
                hardless: hardless,
                description: description,
                image: image,
            }).then((a) => {
                if (a.status === 200) {
                    navigate(`/game/${a.id}`);
                    navigate(0);
                } else {
                    //TODO: Это заменить на визуальные показания неверности
                    alert(a.message);
                }
            });
        else
            GameAPI.updateGame(id, {
                name: name,
                minplayers: minplayers,
                maxplayers: maxplayers,
                mintimeplay: mintimeplay,
                maxtimeplay: maxtimeplay,
                hardless: hardless,
                description: description,
                image: image,
            }).then((a) => {
                if (a.status === 200) {
                    navigate(`/game/${id}`);
                    navigate(0);
                } else {
                    //TODO: Это заменить на визуальные показания неверности
                    alert(a.message);
                }
            });
    };
    const deleteGame = () => {
        GameAPI.deleteGame(id).then((a) => {
            if (a.status === 200) {
                navigate(`/games`);
                navigate(0);
            } else {
                //TODO: Это заменить на визуальные показания неверности
                alert(a.message);
            }
        });
    };
    //TODO: Проверка введенных элементов, что мин < макс
    const getGameCreator = () => {
        return (
            <div className={styles.Flesh}>
                <div className={styles.PartImg}>
                    <img
                        id="previewImage"
                        src={id ? `${API_URL}/games/${id}.png` : ""}
                        alt="Игра"
                        onError={(e) => {
                            e.currentTarget.src = `${API_URL}/image.png`;
                        }}
                    />
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
                                setImage((e.target as HTMLInputElement).files[0]);
                            }
                        }}
                    />
                    <input
                        className={styles.Name}
                        placeholder="Имя"
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                </div>
                <div className={styles.PartDescription}>
                    <div className={styles.PlayNumAndTime}>
                        <div>
                            {`Количество игроков: `}
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={minplayers}
                                onChange={(e) => {
                                    if (Number(e.target.value) > 20) e.target.value = "20";
                                    if (Number(e.target.value) < 1) e.target.value = "1";
                                    if (maxplayers < Number(e.target.value)) setMaxplayers(Number(e.target.value));
                                    setMinplayers(Number(e.target.value));
                                }}
                            ></input>
                            {` - `}
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={maxplayers}
                                onChange={(e) => {
                                    if (Number(e.target.value) > 20) e.target.value = "20";
                                    if (Number(e.target.value) < 1) e.target.value = "1";
                                    if (minplayers > Number(e.target.value)) setMinplayers(Number(e.target.value));
                                    setMaxplayers(Number(e.target.value));
                                }}
                            ></input>
                        </div>
                        <div>
                            {`Время игры: `}
                            <input
                                type="number"
                                min={1}
                                max={600}
                                value={mintimeplay}
                                onChange={(e) => {
                                    if (Number(e.target.value) > 600) e.target.value = "600";
                                    if (Number(e.target.value) < 1) e.target.value = "1";
                                    if (maxtimeplay < Number(e.target.value)) setMaxtimeplay(Number(e.target.value));
                                    setMintimeplay(Number(e.target.value));
                                }}
                            ></input>
                            {` - `}
                            <input
                                type="number"
                                min={1}
                                max={600}
                                value={maxtimeplay}
                                onChange={(e) => {
                                    if (Number(e.target.value) > 600) e.target.value = "600";
                                    if (Number(e.target.value) < 1) e.target.value = "1";
                                    if (mintimeplay > Number(e.target.value)) setMintimeplay(Number(e.target.value));
                                    setMaxtimeplay(Number(e.target.value));
                                }}
                            ></input>
                        </div>
                    </div>
                    <div className={styles.PlayNumAndTime}>
                        <div>
                            <OptionSelector
                                name="Сложность: "
                                value={hardless}
                                setValue={setHardless}
                                values={[1, 2, 3].map((h) => {
                                    return { id: h, value: getHardless(h) };
                                })}
                            />
                        </div>
                    </div>
                    <textarea
                        className={styles.Description}
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                    ></textarea>
                    <Button
                        onClick={() => {
                            createGame();
                        }}
                    >
                        {mode === "create" ? "Создать" : "Сохранить"}
                    </Button>
                    {canIDelete ? (
                        <Button
                            type="red"
                            onClick={() => {
                                deleteGame();
                            }}
                        >
                            {"Удалить"}
                        </Button>
                    ) : null}
                </div>
            </div>
        );
    };
    const getMain = () => {
        if (!status) return <div className={styles.Main}>Загрузка</div>;
        if (canIBeHere) return <div className={styles.Main}>{getGameCreator()}</div>;
        return <div className={styles.Main}>Ошибка</div>;
    };
    return getMain();
};

export default GameCreator;
