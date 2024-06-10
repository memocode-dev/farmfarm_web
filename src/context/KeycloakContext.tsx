// src/KeycloakContext.tsx
import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import Keycloak, {KeycloakConfig} from 'keycloak-js';
import {AxiosRequestConfig} from "axios";
import {FARMFARM_AXIOS_INSTANCE} from "@/axios/axios_instance"
import {importData} from "@/axios/import-data";

// Keycloak 인스턴스 초기화 옵션
const initOptions: KeycloakConfig = {
    url: importData.NEXT_PUBLIC_AUTH_SERVER_URL || '',
    realm: importData.NEXT_PUBLIC_AUTH_SERVER_REALM || '',
    clientId: 'react-client',
};

// Keycloak 인스턴스 생성
const kc = new Keycloak(initOptions);

kc.init({
    onLoad: 'check-sso',
    checkLoginIframe: false,
    pkceMethod: 'S256',
})

interface IUserInfo {
    id: string;
    email: string;
    username: string;
    roles: string[];
    first_name: string;
    last_name: string;
}

interface KeycloakContextValue {
    isLogined: boolean;
    login: () => void;
    logout: () => void;
    user_info: IUserInfo;
}

// Context 생성 with 초기값
const KeycloakContext = createContext<KeycloakContextValue | undefined>(undefined);

interface KeycloakProviderProps {
    children: ReactNode;
}

// Context의 Provider 컴포넌트
export const KeycloakProvider: React.FC<KeycloakProviderProps> = ({children}) => {
    const [isLogined, setIsLogined] = useState<boolean>(false);
    const [user_info, set_user_info] = useState<IUserInfo>({
        id: "",
        email: "",
        username: "",
        roles: [],
        first_name: "",
        last_name: "",
    });

    useEffect(() => {
        // 인증 상태 변경 시 isLogined 상태 업데이트
        kc.onAuthSuccess = () => {

            if (process.env.NODE_ENV !== "production") {
                localStorage.setItem("access_token", kc.token!);
            }

            const tokenParsed = kc.tokenParsed;
            const idTokenParsed = kc.idTokenParsed;

            set_user_info({
                email: idTokenParsed!.email,
                username: idTokenParsed!.username,
                roles: tokenParsed!.realm_access!.roles,
                first_name: idTokenParsed!.first_name,
                last_name: idTokenParsed!.last_name,
                id: idTokenParsed!.sub!,
            });
            setIsLogined(kc.authenticated!);
        };
        kc.onAuthLogout = () => {
            setIsLogined(kc.authenticated!);
        };
        kc.onAuthRefreshError = () => {
            setIsLogined(kc.authenticated!);
        };

        return () => {
            kc.onAuthSuccess = undefined;
            kc.onAuthLogout = undefined;
            kc.onAuthRefreshError = undefined;
        };
    }, []);

    const login = () => {
        kc.login();
    }

    const logout = () => {
        kc.logout();
    }

    useEffect(() => {

        const interceptorFunction = async (config: AxiosRequestConfig) => {
            const getAuthorizationHeader = async () => {
                if (!kc.authenticated) {
                    return {};
                }

                const isTokenExpired = kc.isTokenExpired(10);
                if (isTokenExpired) {
                    await kc.updateToken(10);
                }

                return {
                    Authorization: `Bearer ${kc.token}`,
                };
            };

            const authorizationHeader = await getAuthorizationHeader();

            return {
                ...config,
                headers: {
                    ...config.headers,
                    ...authorizationHeader,
                },
            };
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const farmfarm_axios_instance_intercepter = FARMFARM_AXIOS_INSTANCE.interceptors.request.use(interceptorFunction);

        return () => {
            FARMFARM_AXIOS_INSTANCE.interceptors.request.eject(farmfarm_axios_instance_intercepter);
        };
    }, []);

    return (
        <KeycloakContext.Provider value={{isLogined, login, logout, user_info}}>
            {children}
        </KeycloakContext.Provider>
    );
};

// Context를 사용하기 위한 Custom Hook
export const useKeycloak = (): KeycloakContextValue => {
    const context = useContext(KeycloakContext);
    if (context === undefined) {
        throw new Error('useKeycloak must be used within a KeycloakProvider');
    }
    return context;
};