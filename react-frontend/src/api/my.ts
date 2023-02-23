import {MemeType, SessionType} from "src/types";
import Cookies from 'js-cookie';
import {authConfig, client} from "src/api/base";

const account = () => {
    return client.get<SessionType>('/my', authConfig()).then(res => res.data);
}

const memes = async () => {
    return client.get(`/my/memes`, authConfig())
    .then(res => res.data as MemeType[]);
}

export const my = {account, memes}