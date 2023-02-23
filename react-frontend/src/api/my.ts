import {MemeType, SessionType} from "src/types";
import {authConfig, client} from "src/api/base";

const account = () => {
    return client.get<SessionType>('/my', authConfig()).then(res => res.data);
}

const memes = () => {
    return Promise.resolve<MemeType[]>([])
}

export const my = {account, memes}