import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Plays.module.scss";
import PlayAPI, { IMasterData, IPlayData } from "../../api/Play.api";
import Button from "../../components/Button/Button";
import OptionDateTime from "../../components/OptionDateTime/OptionDateTime";
import Option from "../../components/OptionSelector/OptionSelector";
import PlayCard from "../../components/PlayCard/PlayCard";
import { ReactComponent as BackPage } from "../../images/BackPage.svg";

const Plays = (): JSX.Element => {
    const [pageCount, setPageCount] = useState<number>(1);
    const [page, setPage] = useState<number>(1);
    const [canIAddPlay, setCanIAddPlay] = useState<boolean>(false);
    const [plays, setPlays] = useState<IPlayData[] | undefined>(undefined);
    const [findName, setFindName] = useState<string>("");
    const [datetimeStart, setDatetimeStart] = useState<Date>(new Date("2023.10.10"));
    const [datetimeEnd, setDatetimeEnd] = useState<Date>(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 28));
    const [gameMaster, setGameMaster] = useState<number | undefined>(undefined);
    const [haveFree, setHaveFree] = useState<number | undefined>(undefined);
    const [mastersList, setMastersList] = useState<IMasterData[] | undefined>(undefined);
    const findGames = () => {
        PlayAPI.getPlays({
            page: page || undefined,
            filter: {
                datestart: datetimeStart,
                dateend: datetimeEnd,
                masterid: gameMaster,
                freeplace: haveFree,
                findname: findName?.length > 0 ? findName : undefined,
            },
        }).then((a) => {
            if (a.status === 200) {
                setPageCount(a.count);
                setPlays(a.plays);
            }
        });
    };
    useEffect(() => {
        PlayAPI.canICreatePlay().then((a) => {
            if (a.status === 200 && a.access) setCanIAddPlay(true);
        });
    }, []);
    useEffect(() => {
        findGames();
        document.getElementsByTagName("header")[0].scrollIntoView({ behavior: "smooth" });
    }, [page]);
    useEffect(() => {
        let a = new Date(datetimeEnd);
        a.setMinutes(0, 0, 0);
        setDatetimeEnd(a);
        a = new Date(datetimeStart);
        a.setMinutes(0, 0, 0);
        setDatetimeStart(a);
        PlayAPI.getMasters().then((a) => {
            if (a.status === 200) setMastersList(a.masters);
        });
    }, []);
    useEffect(() => {
        setPage(1);
        findGames();
        document.getElementsByTagName("header")[0].scrollIntoView({ behavior: "smooth" });
    }, [findName, datetimeStart, datetimeEnd, gameMaster, haveFree]);
    const getPlays = () => {
        return (
            <div className={styles.Plays}>
                {plays.map((play) => {
                    return (
                        <Link to={"/play/" + play.id} className={styles.Item} key={`play-${play.id}`}>
                            <PlayCard play={play} />
                        </Link>
                    );
                })}
            </div>
        );
    };
    const getSearch = () => {
        return (
            <div className={styles.Search}>
                <div className={styles.Title}>Поиск</div>
                <input
                    type="text"
                    value={findName}
                    onChange={(e) => {
                        setFindName(e.target.value);
                    }}
                />
                {canIAddPlay && (
                    <Link className={styles.Right} to={"/play/new"}>
                        <Button>Добавить игротеку</Button>
                    </Link>
                )}
            </div>
        );
    };
    const getFilter = () => {
        return (
            <div className={styles.Filter}>
                <OptionDateTime name={"Начиная с"} value={datetimeStart} setValue={setDatetimeStart} />
                <OptionDateTime name={"Заканчивая до"} value={datetimeEnd} setValue={setDatetimeEnd} />
                {mastersList ? (
                    <Option
                        name={"Мастер"}
                        value={gameMaster}
                        setValue={setGameMaster}
                        values={mastersList?.map((master) => {
                            return { id: master.id, value: master.name };
                        })}
                    />
                ) : null}
                <Option
                    name={"Свободные места"}
                    value={haveFree}
                    setValue={setHaveFree}
                    values={[
                        {
                            id: 0,
                            value: "Мест нет",
                        },
                        {
                            id: 1,
                            value: "1 место",
                        },
                        {
                            id: 2,
                            value: "2 места",
                        },
                        {
                            id: 3,
                            value: "3 места",
                        },
                        {
                            id: 4,
                            value: "4 места",
                        },
                        {
                            id: 5,
                            value: "5 мест",
                        },
                        {
                            id: -1,
                            value: "Нет записи",
                        },
                    ]}
                />
            </div>
        );
    };
    const getPageRouter = () => {
        const masPages = [page];
        for (let a = page - 1; a > 0 && a >= page - 5; a--) masPages.unshift(a);
        for (let a = page + 1; a <= pageCount && a <= page + 5; a++) masPages.push(a);
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
                        if (page !== 1) toPage(page - 1);
                    }}
                />
                {masPages.map((a) => {
                    if (a === page)
                        return (
                            <button
                                key={"page" + a}
                                className={styles.ThisPage}
                                onClick={() => {
                                    toPage(a);
                                }}
                            >
                                {a}
                            </button>
                        );
                    return (
                        <button
                            key={"page" + a}
                            onClick={() => {
                                toPage(a);
                            }}
                        >
                            {a}
                        </button>
                    );
                })}
                <BackPage
                    className={styles.Next + " " + styles.Svg}
                    onClick={() => {
                        if (page !== pageCount) toPage(page + 1);
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
                    {getPlays()}
                    {getPageRouter()}
                </div>
            );
        return <div className={styles.Main}>Загрузка...</div>;
    };
    return getMain();
};

export default Plays;
