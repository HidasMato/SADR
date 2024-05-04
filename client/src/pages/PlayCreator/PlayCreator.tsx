import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./PlayCreator.module.scss";
import PlayAPI, { IMasterData } from "../../api/Play.api";
import Button from "../../components/Button/Button";
import OptionDateTime from "../../components/OptionDateTime/OptionDateTime";
import OptionSelector from "../../components/OptionSelector/OptionSelector";
import { API_URL } from "../../context/AuthContext";

const PlayCreator = ({ mode = "create" }: { mode?: "create" | "change" }): JSX.Element => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [datetimeStart, setDatetimeStart] = useState<Date>();
    const [datetimeEnd, setDatetimeEnd] = useState<Date>();
    const [minPlayers, setMinPlayers] = useState<number>();
    const [maxPlayers, setMaxPlayers] = useState<number>();
    const [status, setStatus] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [image, setImage] = useState<File>(undefined);
    const [description, setDescription] = useState<string>("");
    const [canIBeHere, setCanIBeHere] = useState<boolean>(false);
    const [canIDelete, setCanIDelete] = useState<boolean>(false);
    const [mastersList, setMastersList] = useState<IMasterData[]>([]);
    const [targetMaster, setTargetMaster] = useState<number | undefined>(undefined);
    const [gamesList, setGamesList] = useState<{ id: number; name: string; show: boolean }[] | undefined>([]);
    const [showAddGame, setShowAddGame] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const getCreatorInfo = async () => {
            const result = await PlayAPI.getPlayCreatorInfo();
            if (result?.status === 200) {
                setMastersList(result.masters);
                if (result.masters.length === 1) setTargetMaster(result.masters[0].id);
                const gl = result.games.map((val) => {
                    return {
                        id: val.id,
                        name: val.name,
                        show: false,
                    };
                });
                return gl;
            }
        };
        const Create = async () => {
            const result = await PlayAPI.canICreatePlay();
            if (result?.status === 200 && result.access) {
                let a = new Date(new Date(new Date().getTime() + 1000 * 60 * 60 * 24));
                a.setMinutes(0);
                setDatetimeStart(a);
                a = new Date(new Date(new Date().getTime() + 1000 * 60 * 60 * 28));
                a.setMinutes(0);
                setDatetimeEnd(a);
                setMinPlayers(1);
                setMaxPlayers(20);
                setGamesList(await getCreatorInfo());
                setCanIBeHere(true);
            }
            setStatus(true);
        };
        const Change = async () => {
            const result = await PlayAPI.canIChangePlay(id);
            if (result?.status === 200 && result.access) {
                const gl = await getCreatorInfo();
                const result = await PlayAPI.getPlay(id);
                if (result?.status === 200) {
                    setName(result.data.name);
                    setDescription(result.data.description);
                    setDatetimeStart(result.data.status.dateStart);
                    setDatetimeEnd(result.data.status.dateEnd);
                    setMinPlayers(result.data.players.min);
                    setMaxPlayers(result.data.players.max);
                    setTargetMaster(result.data.master.id);
                    setGamesList([
                        ...gl.map((game) => {
                            const f = result.data.games.find((e) => {
                                return e.id === game.id;
                            });
                            if (f) return { id: game.id, name: game.name, show: true };
                            else return game;
                        }),
                    ]);
                    PlayAPI.canIDeletePlay(id).then((a) => {
                        if (a.status === 200) setCanIDelete(a.access);
                    });
                    setCanIBeHere(true);
                }
            }
            setStatus(true);
        };
        if (mode === "change") Change();
        else Create();
    }, []);
    useEffect(() => {
        const checkIfClickedOutside = (e: any) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setShowAddGame(false);
            }
        };
        document.addEventListener("mousedown", checkIfClickedOutside);
        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside);
        };
    }, [showAddGame]);
    const createPlay = () => {
        const options = {
            name: name,
            minplayers: minPlayers,
            maxplayers: maxPlayers,
            description: description,
            image: image,
            dateend: datetimeEnd,
            datestart: datetimeStart,
            games: gamesList
                .filter((game) => {
                    return game.show;
                })
                .map((game) => {
                    return game.id;
                }),
            masterId: targetMaster,
            status: true,
        };
        if (mode === "create")
            PlayAPI.createPlay(options).then((a) => {
                if (a.status === 200) {
                    navigate(`/play/${a.id}`);
                    navigate(0);
                } else {
                    //TODO: Это заменить на визуальные показания неверности хуйни
                    alert(a.message);
                }
            });
        else if (mode === "change") {
            PlayAPI.changePlay(options, Number(id)).then((a) => {
                if (a.status === 200) {
                    navigate(`/play/${a.id}`);
                    navigate(0);
                } else {
                    //TODO: Это заменить на визуальные показания неверности хуйни
                    alert(a.message);
                }
            });
        }
    };
    const deletePlay = () => {
        PlayAPI.deletePlay(id).then((a) => {
            if (a.status === 200) {
                navigate(`/plays`);
                navigate(0);
            } else {
                //TODO: Это заменить на визуальные показания неверности хуйни
                alert(a.message);
            }
        });
    };
    const getPlayCreator = () => {
        const getAddGames = () => {
            return (
                <div className={styles.AddGameList}>
                    {gamesList.map((game) => {
                        if (!game.show) {
                            return (
                                <button
                                    key={"igame_" + game.id}
                                    onClick={() => {
                                        game.show = true;
                                        setGamesList([...gamesList]);
                                        setShowAddGame(false);
                                    }}
                                >
                                    {game.name}
                                </button>
                            );
                        }
                        return null;
                    })}
                </div>
            );
        };
        return (
            <div className={styles.Flesh}>
                <div className={styles.PartImg}>
                    <img
                        id="previewImage"
                        src={id ? `${API_URL}/plays/${id}.png` : ""}
                        alt="Игротека"
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
                        <OptionDateTime name={"Старт"} value={datetimeStart} setValue={setDatetimeStart} />
                        <OptionDateTime name={"Окончание"} value={datetimeEnd} setValue={setDatetimeEnd} />
                    </div>
                    <div className={styles.PlayNumAndTime}>
                        <div>
                            {`Количество игроков: `}
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={minPlayers}
                                onChange={(e) => {
                                    if (maxPlayers < Number(e.target.value)) setMaxPlayers(Number(e.target.value));
                                    setMinPlayers(Number(e.target.value));
                                }}
                            ></input>
                            {" - "}
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={maxPlayers}
                                onChange={(e) => {
                                    if (minPlayers > Number(e.target.value)) setMinPlayers(Number(e.target.value));
                                    setMaxPlayers(Number(e.target.value));
                                }}
                            ></input>
                        </div>
                        <OptionSelector
                            name={"Мастер:"}
                            values={mastersList.map((master) => {
                                return { id: master.id, value: master.name };
                            })}
                            value={targetMaster}
                            setValue={setTargetMaster}
                            block={mastersList.length === 1}
                        />
                    </div>
                    <div className={styles.Games}>
                        {"Игры: "}
                        <div ref={ref}>
                            <Button
                                kvadr={true}
                                onClick={() => {
                                    setShowAddGame(!showAddGame);
                                }}
                            >
                                {" + "}
                            </Button>
                            {showAddGame && getAddGames()}
                        </div>
                        {gamesList.map((game) => {
                            if (game.show)
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
                                        <button
                                            onClick={() => {
                                                game.show = false;
                                                setGamesList([...gamesList]);
                                            }}
                                        >
                                            X
                                        </button>
                                    </div>
                                );
                            return null;
                        })}
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
                            createPlay();
                        }}
                    >
                        {mode === "create" ? "Создать" : "Сохранить"}
                    </Button>
                    {canIDelete ? (
                        <Button
                            type="red"
                            onClick={() => {
                                deletePlay();
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
        if (canIBeHere) return <div className={styles.Main}>{getPlayCreator()}</div>;
        return <div className={styles.Main}>Ошибка</div>;
    };
    return getMain();
};

export default PlayCreator;
