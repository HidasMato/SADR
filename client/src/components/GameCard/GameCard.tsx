import { API_URL } from "../../context/AuthContext";
import styles from "./GameCard.module.scss";

type GameCardObject = {
    game: {
        name: string,
        id: number
    }
}

const GameCard = ({ game }: GameCardObject): JSX.Element => {
    return (
        <div className={styles.Main + ' ' + (game ? '': styles.DisplayNone)}>
            {game ? <img src={`${API_URL}/games/${game.id}.png`} onError={(e) => { e.currentTarget.src = `${API_URL}/image.png` }} /> : null}
            {game ? game.name : null}
        </div>
    );
};

export default GameCard;