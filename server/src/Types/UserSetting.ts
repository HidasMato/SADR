export type UserSetting = {
    setting: UserSelection;
    filter: UserFilter;
    MODE: MODE;
};
export type UserSelection = {
    start: number;
    count: number;
};
export type UserFilter = {};
export type MODE = "sequrity" | "forAll";
