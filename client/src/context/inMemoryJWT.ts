const inMemoryJervice = () => {
    let inMemoryJWT = null;


    const getToken = () => inMemoryJWT;

    const setToken = (token) => {
        inMemoryJWT = token;
    };

    const deleteToken = () => {
        inMemoryJWT = null;
    };

    return {
        getToken,
        setToken,
        deleteToken,
    };
};

export default inMemoryJervice();
