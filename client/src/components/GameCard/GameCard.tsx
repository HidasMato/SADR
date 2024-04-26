import styles from "./GameCard.module.scss";
import { IGameData } from "../../api/Games.api";
import { API_URL } from "../../context/AuthContext";

type GameCardObject = {
    game: IGameData;
};

const GameCard = ({ game }: GameCardObject): JSX.Element => {
    return (
        <div className={styles.Main + " " + (game ? "" : styles.DisplayNone)}>
            {game ? (
                <img
                    src={`${API_URL}/games/${game.id}.png`}
                    onError={(e) => {
                        e.currentTarget.src = `${API_URL}/image.png`;
                    }}
                    alt="Аватака"
                />
            ) : null}
            {game ? game.name : null}
        </div>
    );
};

export default GameCard;
