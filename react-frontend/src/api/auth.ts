import {client} from "src/api/base";

export const login = (username: string, password: string) => {
    return client.post('/auth/login', {
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    }).then(res => res.data as {token: string, expiryTime: string});
}

export const register = (username: string, displayName: string, password: string) => {
    return client.post('/auth/register', {
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, displayName, password})
    });
}

export const auth = {login, register};