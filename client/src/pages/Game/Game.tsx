import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Game.module.scss";
import GameAPI, { IGameQuery } from "../../api/Game.api";
import Button from "../../components/Button/Button";
import { API_URL } from "../../context/AuthContext";

const Game = (): JSX.Element => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [gameInfo, setGameInfo] = useState<IGameQuery | undefined>(undefined);
    const [status, setStatus] = useState<boolean>(false);
    const [canICreateGame, setCanIAddGame] = useState<boolean>(false);
    useEffect(() => {
        GameAPI.getGame(id).then((a) => {
            if (a.status === 200) {
                setGameInfo(a.data);
            } else {
                alert(a.message);
            }
            setStatus(true);
        });
        GameAPI.canICreateGame().then((a) => {
            if (a.status === 200 && a.access) setCanIAddGame(true);
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
                    {canICreateGame ? (
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
