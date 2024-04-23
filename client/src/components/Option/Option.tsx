import { Dispatch, SetStateAction } from "react";
import styles from "./Option.module.scss";

type OptionObject = {
    name: string;
    values: string[];
    value: string | undefined;
    setValue: Dispatch<SetStateAction<string | undefined>>;
    strAdd?: string;
};

const Option = ({
    value,
    setValue,
    name,
    values,
    strAdd,
}: OptionObject): JSX.Element => {
    return (
        <div className={styles.Main}>
            <div className={styles.Title}>{name}</div>
            <select
                name="player"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
                id="player">
                <option key={name + "--"} value={undefined}>
                    {"--"}
                </option>
                {values.map((val) => {
                    return (
                        <option key={name + val} value={val}>
                            {val + (strAdd ?? "")}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default Option;
