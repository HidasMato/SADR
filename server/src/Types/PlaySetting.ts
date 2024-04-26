export type PlaySetting = {
    setting: PlaySelection;
    filter: PlayFilter;
};
export type PlaySelection = {
    page: number | undefined;
};
export type PlayFilter = {
    datestart: Date;
    dateend: Date;
    masterid: number | undefined;
    freeplace: number | undefined;
    findname: string | undefined;
};
