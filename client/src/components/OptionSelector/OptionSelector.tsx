import { Dispatch, SetStateAction } from "react";
import styles from "./OptionSelector.module.scss";

type OptionSelectorObject = {
    name: string;
    values:
        | string[]
        | number[]
        | {
              id: number;
              value: string;
          }[];
    value: string | number | undefined;
    setValue: Dispatch<SetStateAction<string | number | undefined>>;
    strAdd?: string;
    block?: boolean;
};

const OptionSelector = ({
    value,
    setValue,
    name,
    values,
    strAdd,
    block = false,
}: OptionSelectorObject): JSX.Element => {
    return (
        <div className={styles.Main}>
            <div className={styles.Title}>{name}</div>
            <select
                disabled={block}
                name="player"
                value={value}
                onChange={(e) => {
                    if (e.target.value === "--") setValue(undefined);
                    else setValue(e.target.value);
                }}
                id="player"
            >
                <option key={name + "--"} value={"--"}>
                    {"--"}
                </option>
                {values.map(
                    (
                        val:
                            | string
                            | number
                            | {
                                  id: number;
                                  value: string;
                              },
                    ) => {
                        return (
                            <option
                                key={name + (typeof val === "object" ? val?.id : val)}
                                value={typeof val === "object" ? val?.id : val}
                            >
                                {typeof val === "object" ? val?.value : val + (strAdd ?? "")}
                            </option>
                        );
                    },
                )}
            </select>
        </div>
    );
};

export default OptionSelector;
