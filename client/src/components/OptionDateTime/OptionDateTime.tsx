import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./OptionDateTime.module.scss";
import { ReactComponent as BackPage } from "../../images/BackPage.svg";

type OptionDateTimeObject = {
    name: string;
    value: Date;
    setValue: Dispatch<SetStateAction<Date>>;
};

const OptionDateTime = ({ value, setValue, name }: OptionDateTimeObject): JSX.Element => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [viewDate, setViewDate] = useState(new Date(value));
    const ref = useRef<HTMLDivElement>(null);
    const getCalendar = () => {
        const startMounth = new Date(viewDate.getFullYear(), viewDate.getMonth());
        const endMounth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
        let weeks = 1;
        const Days = [];
        const dayWeekStart = startMounth.getDay() === 0 ? 6 : startMounth.getDay() - 1;
        for (let j = 0; j < 7; j++) {
            if (dayWeekStart > j) Days[j] = undefined;
            else if (dayWeekStart === j) Days[j] = 1;
            else Days[j] = Days[j - 1] + 1;
        }
        for (let i = 7; i < endMounth.getDate(); i += 7) {
            for (let j = 0; j < 7; j++) {
                if (Days[j + weeks * 7 - 1] < endMounth.getDate()) Days[j + weeks * 7] = Days[j + weeks * 7 - 1] + 1;
                else Days[j + weeks * 7] = undefined;
            }
            weeks++;
        }
        const getMounthName = (mounthNumber: number) => {
            switch (mounthNumber) {
                case 0:
                    return "Январь";
                case 1:
                    return "Февраль";
                case 2:
                    return "Март";
                case 3:
                    return "Апрель";
                case 4:
                    return "Май";
                case 5:
                    return "Июнь";
                case 6:
                    return "Июль";
                case 7:
                    return "Август";
                case 8:
                    return "Сентябрь";
                case 9:
                    return "Октябрь";
                case 10:
                    return "Ноябрь";
                default:
                    return "Декабрь";
            }
        };
        return (
            <div className={styles.Calendar}>
                <div className={styles.Year}>
                    <BackPage
                        className={styles.Svg}
                        onClick={() => {
                            const nv = new Date(viewDate);
                            nv.setMonth(nv.getMonth() - 1);
                            setViewDate(nv);
                        }}
                    />
                    {viewDate.getFullYear()} {getMounthName(viewDate.getMonth())}
                    <BackPage
                        className={styles.Next + " " + styles.Svg}
                        onClick={() => {
                            const nv = new Date(viewDate);
                            nv.setMonth(nv.getMonth() + 1);
                            setViewDate(nv);
                        }}
                    />
                </div>
                <div className={styles.Days}>
                    {Array.from(Array(weeks).keys()).map((week) => {
                        return (
                            <div className={styles.Week} key={"week" + week}>
                                {Array.from(Array(7).keys()).map((day) => {
                                    if (Days[week * 7 + day])
                                        return (
                                            <button
                                                className={
                                                    styles.Day +
                                                    " " +
                                                    (Days[week * 7 + day] === new Date().getDate() &&
                                                    viewDate.getMonth() === new Date().getMonth() &&
                                                    viewDate.getFullYear() === new Date().getFullYear()
                                                        ? styles.Now
                                                        : "") +
                                                    " " +
                                                    (Days[week * 7 + day] === value.getDate() &&
                                                    viewDate.getMonth() === value.getMonth() &&
                                                    viewDate.getFullYear() === value.getFullYear()
                                                        ? styles.Select
                                                        : "")
                                                }
                                                key={`day ${week}-${day}`}
                                                onClick={() => {
                                                    const nv = new Date(viewDate);
                                                    nv.setDate(Days[week * 7 + day]);
                                                    setValue(nv);
                                                }}
                                            >
                                                {Days[week * 7 + day]}
                                            </button>
                                        );
                                    else
                                        return (
                                            <div
                                                className={styles.Day + " " + styles.Hidden}
                                                key={`day ${week}-${day}`}
                                            ></div>
                                        );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };
    useEffect(() => {
        const checkIfClickedOutside = (e: any) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener("mousedown", checkIfClickedOutside);
        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside);
        };
    }, [showCalendar]);
    return (
        <div className={styles.Main} ref={ref}>
            <div className={styles.Title}>
                {name}
                <button
                    onClick={(e) => {
                        setViewDate(value);
                        setShowCalendar(!showCalendar);
                    }}
                >
                    {value.getFullYear()}.
                    {value.getMonth() + 1 > 9 ? value.getMonth() + 1 : "0" + (value.getMonth() + 1)}.
                    {value.getDate() > 9 ? value.getDate() : "0" + value.getDate()} {value.getHours()}:
                    {value.getMinutes() > 9 ? value.getMinutes() : "0" + value.getMinutes()}
                    <BackPage className={styles.Svg} />
                </button>
            </div>
            {showCalendar && (
                <div className={styles.Choise}>
                    {getCalendar()}
                    {/* Время */}
                </div>
            )}
        </div>
    );
};

export default OptionDateTime;
