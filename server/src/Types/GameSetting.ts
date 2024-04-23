export type GameSetting = {
    setting: GameSelection;
    filter: GameFilter;
};
export type GameSelection = {
    page: number | undefined;
};
export type GameFilter = {
    player: number | undefined;
    time: number | undefined;
    hardless: number | undefined;
    findname: string | undefined;
};
