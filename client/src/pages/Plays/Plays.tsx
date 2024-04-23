import styles from "./Plays.module.scss";
import { Link } from "react-router-dom";
import Option from "../../components/Option/Option";
import { ReactComponent as BackPage } from "../../images/BackPage.svg";
import { useEffect, useState } from "react";
import PlayCard from "../../components/PlayCard/PlayCard";
import PlayAPI, { IPlayData } from "../../api/Plays.api";

type PlaysObject = {};
class datetime {
    private year: number;
    private mounth: number;
    private day: number;
    private hour: number;
    private minute: number;
    constructor(
        year: number,
        mounth: number,
        day: number,
        hour: number,
        minute: number
    ) {
        this.year = year;
        this.mounth = mounth;
        this.day = day;
        this.hour = hour;
        this.minute = minute;
    }
}
const Plays = (): JSX.Element => {
    const [pageCount, setPageCount] = useState<number>(1);
    const [page, setPage] = useState<number>(1);
    const [plays, setPlays] = useState<IPlayData[] | undefined>(undefined);
    const [findName, setFindName] = useState<string>("");
    const [datetimeStart, setDatetimeStart] = useState<datetime | undefined>(
        undefined
    );
    const [datetimeEnd, setDatetimeEnd] = useState<datetime | undefined>(
        undefined
    );
    const [gameMaster, setGameMaster] = useState<string | undefined>(undefined);
    const [haveFree, setHaveFree] = useState<boolean | undefined>(undefined);
    const findGames = () => {
        PlayAPI.getGames({
            page: page ? page : undefined,
            filter: {
                findname: findName?.length > 0 ? findName : undefined,
            },
        }).then((a) => {
            setPageCount(a.count);
            setPlays(a.games);
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
    }, [findName]);
    const getGames = () => {
        return (
            <div className={styles.Plays}>
                {/* {Array.from(Array(Math.ceil(plays.length / 4)).keys()).map((num) => {
                    return (
                        <div className={styles.Line} key={"line" + num}>
                            {Array.from(Array(4).keys()).map(ind => {
                                return <Link to={'/game/' + plays[num * 4 + ind]?.id} className={styles.Item} key={num * 4 + ind}><PlayCard game={plays[num * 4 + ind]} /></Link>
                            })}
                        </div>
                    )
                })} */}
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
                {/* <Option name={"Кол-во игроков"} setValue={setPlayer} value={player} values={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']} />
                <Option strAdd="мин" name={"Время партии"} setValue={setTime} value={time} values={['10', '20', '30', '40', '50', '60', '70', '80', '90']} />
                <Option name={"Сложность"} setValue={setHardless} value={hardless} values={['1', '2', '3', '4', '5']} /> */}
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
        if (plays)
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

export default Plays;
