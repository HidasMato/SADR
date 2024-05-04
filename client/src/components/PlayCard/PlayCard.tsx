import styles from "./PlayCard.module.scss";
import { IPlayData } from "../../api/Play.api";
import { API_URL } from "../../context/AuthContext";

type PlayCardObject = {
    play: IPlayData;
};

const PlayCard = ({ play }: PlayCardObject): JSX.Element => {
    const dateStart = new Date(play.status.dateStart);
    const dateEnd = new Date(play.status.dateEnd);
    return (
        <div className={styles.Main}>
            <img
                src={`${API_URL}/plays/${play.id}.png`}
                onError={(e) => {
                    e.currentTarget.src = `${API_URL}/image.png`;
                }}
                alt="Игротека"
            />
            <div className={styles.Name}>{play.name}</div>
            <div className={styles.Start}>
                {dateStart.getFullYear()}.
                {dateStart.getMonth() + 1 > 9 ? dateStart.getMonth() + 1 : "0" + (dateStart.getMonth() + 1)}.
                {dateStart.getDate() > 9 ? dateStart.getDate() : "0" + dateStart.getDate()}
                <br />
                {dateStart.getHours() > 9 ? dateStart.getHours() : "0" + dateStart.getHours()}:
                {dateStart.getMinutes() > 9 ? dateStart.getMinutes() : "0" + dateStart.getMinutes()}
            </div>
            <div className={styles.End}>
                {dateEnd.getFullYear()}.
                {dateEnd.getMonth() + 1 > 9 ? dateEnd.getMonth() + 1 : "0" + (dateEnd.getMonth() + 1)}.
                {dateEnd.getDate() > 9 ? dateEnd.getDate() : "0" + dateEnd.getDate()}
                <br />
                {dateEnd.getHours() > 9 ? dateEnd.getHours() : "0" + dateEnd.getHours()}:
                {dateEnd.getMinutes() > 9 ? dateEnd.getMinutes() : "0" + dateEnd.getMinutes()}
            </div>
            <div className={styles.Place}>
                {play.players.count >= play.players.max ? "Мест нет" : `${play.players.count} / ${play.players.max}`}
            </div>
            <div className={styles.Mater}>{play.master.name}</div>
        </div>
    );
};

export default PlayCard;
