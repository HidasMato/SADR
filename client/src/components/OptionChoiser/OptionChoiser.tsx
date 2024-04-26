import { Dispatch, SetStateAction } from "react";
import styles from "./OptionChoiser.module.scss";

type OptionChoiserObject = {
    name: string;
    value: boolean;
    setValue: Dispatch<SetStateAction<boolean>>;
};

const OptionChoiser = ({ value, setValue, name }: OptionChoiserObject): JSX.Element => {
    return (
        <div className={styles.Main}>
            <label htmlFor={name} className={styles.Title}>
                {name}
            </label>
            <input id={name} type="checkbox" checked={value} />
        </div>
    );
};

export default OptionChoiser;
