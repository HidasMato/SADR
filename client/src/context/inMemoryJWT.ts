import config from "../config";

const inMemoryJervice = () => {
    let inMemoryJWT = null;

    const getToken = () => inMemoryJWT;

    const setToken = (token) => {
        inMemoryJWT = token;
    };

    const deleteToken = () => {
        inMemoryJWT = null;
        localStorage.setItem(config.LOGOUT_STORAGE_KEY, Date.now().toString());
    };

    return {
        getToken,
        setToken,
        deleteToken,
    };
};

export default inMemoryJervice();
