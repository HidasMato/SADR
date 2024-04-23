export type PlaySetting = {
    setting: PlaySelection;
    filter: PlayFilter;
};
export type PlaySelection = {
    start: number;
    count: number;
};
export type PlayFilter = {
    minplayer: number;
    maxplayer: number;
};
