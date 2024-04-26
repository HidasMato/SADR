import axios from "axios";
import { createContext, useState, useEffect } from "react";
import inMemoryJWT from "./inMemoryJWT";
import config from "../config";

export const API_URL = "http://localhost:2052";

export const AuthAPI = axios.create({
    withCredentials: true,
    baseURL: `${API_URL}/api`,
});

export interface LoginResponse {
    accessToken: string;
}

interface AuthContextValue {
    login: ({ mail, pass }: { mail: string; pass: string }) => Promise<returnAuth>;
    logout: () => Promise<returnAuth>;
    registration: ({ mail, pass, nickname }: { mail: string; pass: string; nickname: string }) => Promise<returnAuth>;
    isAppReady: boolean;
    isUserLogged: boolean;
}

interface returnAuth {
    status: number;
    message?: string;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AuthProvider = ({ children }) => {
    const [isAppReady, setIsAppReady] = useState(false);
    const [isUserLogged, setIsUserLogged] = useState(false);

    const login = async ({ mail, pass }: { mail: string; pass: string }): Promise<returnAuth> => {
        try {
            const responce = await AuthAPI.post<LoginResponse>("/user/login", {
                mail,
                pass,
            });
            inMemoryJWT.setToken(responce.data.accessToken);
            setIsUserLogged(true);
            return { status: 200 };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    };
    const registration = async ({
        mail,
        pass,
        nickname,
    }: {
        mail: string;
        pass: string;
        nickname: string;
    }): Promise<returnAuth> => {
        try {
            const responce = await AuthAPI.post<LoginResponse>("/user/registration", { mail, pass, nickname });
            inMemoryJWT.setToken(responce.data.accessToken);
            setIsUserLogged(true);
            return { status: 200 };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    };
    const logout = async (): Promise<returnAuth> => {
        try {
            await AuthAPI.post<LoginResponse>("/user/logout");
            setIsUserLogged(false);
            inMemoryJWT.deleteToken();
            return { status: 200 };
        } catch (error) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
    };
    const refresh = () => {
        axios
            .get<LoginResponse>(`${API_URL}/api/user/refresh`, {
                withCredentials: true,
            })
            .then((responce) => {
                inMemoryJWT.setToken(responce.data.accessToken);
                setIsUserLogged(true);
            })
            .catch(() => {
                setIsUserLogged(false);
            })
            .finally(() => {
                setIsAppReady(true);
            });
    };
    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        const handlePersistedLogOut = (event: StorageEvent) => {
            if (event.key === config.LOGOUT_STORAGE_KEY) {
                inMemoryJWT.deleteToken();
                setIsUserLogged(false);
            }
        };
        window.addEventListener("storage", handlePersistedLogOut);
        return () => {
            window.removeEventListener("storage", handlePersistedLogOut);
        };
    }, []);

    useEffect(() => {
        AuthAPI.interceptors.request.use((config) => {
            config.headers.Authorization = `Bearer ${inMemoryJWT.getToken()}`;
            return config;
        });
        AuthAPI.interceptors.response.use(
            (config) => {
                return config;
            },
            async (error) => {
                const originalReqquest = error.config;
                if (error.response.status === 401 && error.config && originalReqquest._isRetry) {
                    originalReqquest._isRetry = false;
                    try {
                        refresh();
                        return AuthAPI.request(originalReqquest);
                    } catch (error) {
                        console.log("Не авторизован");
                    }
                }
                throw error;
            },
        );
    }, []);

    return (
        <AuthContext.Provider
            value={{
                login,
                logout,
                registration,
                isAppReady,
                isUserLogged,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
