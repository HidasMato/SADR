import { useEffect, useState } from "react";
import GameCard from "../../components/GameCard/GameCard";
import styles from "./Games.module.scss";
import GameAPI, { IGameData } from "../../api/Games.api";
import { Link } from "react-router-dom";
import Option from "../../components/Option/Option";
import { ReactComponent as BackPage } from "../../images/BackPage.svg";

const Games = (): JSX.Element => {
    const [pageCount, setPageCount] = useState<number>(1);
    const [page, setPage] = useState<number>(1);
    const [games, setGames] = useState<IGameData[] | undefined>(undefined);
    const [findName, setFindName] = useState<string>("");
    const [player, setPlayer] = useState<string | undefined>(undefined);
    const [time, setTime] = useState<string | undefined>(undefined);
    const [hardless, setHardless] = useState<string | undefined>(undefined);
    const findGames = () => {
        GameAPI.getGames({
            page: page ? page : undefined,
            filter: {
                findname: findName?.length > 0 ? findName : undefined,
                player: player,
                time: time,
                hardless: hardless,
            },
        }).then((a) => {
            setPageCount(a.count);
            setGames(a.games);
        });
    };
    useEffect(() => {
        findGames();
        document
            .getElementsByTagName("header")[0]
            .scrollIntoView({ behavior: "smooth" });
    }, [page]);
    useEffect(() => {
        setPage(1);
        findGames();
        document
            .getElementsByTagName("header")[0]
            .scrollIntoView({ behavior: "smooth" });
    }, [findName, player, time, hardless]);
    const getGames = () => {
        return (
            <div className={styles.Games}>
                {Array.from(Array(Math.ceil(games.length / 4)).keys()).map(
                    (num) => {
                        return (
                            <div className={styles.Line} key={"line" + num}>
                                {Array.from(Array(4).keys()).map((ind) => {
                                    return (
                                        <Link
                                            to={
                                                "/game/" +
                                                games[num * 4 + ind]?.id
                                            }
                                            className={styles.Item}
                                            key={num * 4 + ind}>
                                            <GameCard
                                                game={games[num * 4 + ind]}
                                            />
                                        </Link>
                                    );
                                })}
                            </div>
                        );
                    }
                )}
            </div>
        );
    };
    const getSearch = () => {
        return (
            <div className={styles.Search}>
                <div>Поиск</div>
                <input
                    type="text"
                    value={findName}
                    onChange={(e) => {
                        setFindName(e.target.value);
                    }}
                />
            </div>
        );
    };
    const getFilter = () => {
        return (
            <div className={styles.Filter}>
                <Option
                    name={"Кол-во игроков"}
                    setValue={setPlayer}
                    value={player}
                    values={[
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "10",
                        "11",
                        "12",
                    ]}
                />
                <Option
                    strAdd="мин"
                    name={"Время партии"}
                    setValue={setTime}
                    value={time}
                    values={[
                        "10",
                        "20",
                        "30",
                        "40",
                        "50",
                        "60",
                        "70",
                        "80",
                        "90",
                    ]}
                />
                <Option
                    name={"Сложность"}
                    setValue={setHardless}
                    value={hardless}
                    values={["1", "2", "3", "4", "5"]}
                />
            </div>
        );
    };
    const getPageRouter = () => {
        const masPages = [page];
        for (let a = page - 1; a > 0 && a >= page - 5; a--) masPages.unshift(a);
        for (let a = page + 1; a <= pageCount && a <= page + 5; a++)
            masPages.push(a);
        const toPage = (newPage: number) => {
            if (newPage > pageCount) newPage = pageCount;
            else if (newPage < 1) newPage = 1;
            setPage(newPage);
        };
        return (
            <div className={styles.PageRouter}>
                <BackPage
                    className={styles.Svg}
                    onClick={() => {
                        if (page != 1) toPage(page - 1);
                    }}
                />
                {masPages.map((a) => {
                    if (a == page)
                        return (
                            <div
                                key={"page" + a}
                                className={styles.ThisPage}
                                onClick={() => {
                                    toPage(a);
                                }}>
                                {a}
                            </div>
                        );
                    return (
                        <div
                            key={"page" + a}
                            onClick={() => {
                                toPage(a);
                            }}>
                            {a}
                        </div>
                    );
                })}
                <BackPage
                    className={styles.Next + " " + styles.Svg}
                    onClick={() => {
                        if (page != pageCount) toPage(page + 1);
                    }}
                />
            </div>
        );
    };
    const getMain = () => {
        if (games)
            return (
                <div className={styles.Main}>
                    {getSearch()}
                    {getFilter()}
                    {getGames()}
                    {getPageRouter()}
                </div>
            );
        return <div className={styles.Main}>Загрузка...</div>;
    };
    return getMain();
};

export default Games;
