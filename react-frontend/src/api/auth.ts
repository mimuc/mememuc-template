import {client} from "src/api/base";
import {AxiosRequestConfig} from "axios";

export const login = (username: string, password: string) => {
    return client.post('/auth/login', {username, password}, {
        headers: {'Content-Type': 'application/json'},
    } as AxiosRequestConfig).then(res => res.data as { token: string, expiryTime: string });
}

export const register = (username: string, displayName: string, password: string) => {
    return client.post('/auth/register', {username, displayName, password},
        {
            headers: {'Content-Type': 'application/json'},
        } as AxiosRequestConfig);
}

export const auth = {login, register};