import {MemeType, SessionType} from "src/types";
import Cookies from 'js-cookie';
import {authConfig, client} from "src/api/base";

const account = () => {
    return client.get<SessionType>('/my', authConfig()).then(res => res.data);
}

const memes = async () => {
    return client.put(`http://localhost:3001/my/memes`, {}, {
        headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
        }
    })
    .then(res => res.data as MemeType[]);
}

export const my = {account, memes}