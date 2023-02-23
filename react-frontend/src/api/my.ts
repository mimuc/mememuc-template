import {MemeType, SessionType} from "src/types";
import {client} from "src/api/base";
import Cookies from "js-cookie";
import {AxiosRequestConfig} from "axios";

const account = () => {
    const config = {
        headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
        }
    } as AxiosRequestConfig

    return client.get<SessionType>('/my', config).then(res => res.data);
}

const memes = () => {
    return Promise.resolve<MemeType[]>([])
}

export const my = {account, memes}