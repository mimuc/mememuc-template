import {MemeType} from "src/types";
import Cookies from 'js-cookie';
import {client} from "./base";
import {AxiosRequestConfig} from "axios";

export const all = async () => {

    return Promise.resolve([]);

    // // return client.get('/templates');
    // const memes = await client.get<any[]>('http://localhost:3001/memes', {
    //     headers: {
    //         Authorization: `Bearer ${Cookies.get("token")}`,
    //     }
    // } as AxiosRequestConfig).then(res => res.data);
}

export const add = () => {
    return Promise.resolve();
    // TODO: and if logged in attribute to user

}
const get = (memeId: string) => {
    return Promise.resolve<MemeType>({} as MemeType);
    // return client.get('/templates');
    // return Promise.resolve(client.get(`http://localhost:3001/memes/{memeId}`, {
    //     headers: {
    //         Authorization: `Bearer ${Cookies.get("token")}`,
    //     }
    // })
    //     .then(res => res.data));
}


const getRandomMeme = () => {
    return Promise.resolve<MemeType>({} as MemeType);
    // // return client.get('/templates');
    // return Promise.resolve(client.get('http://localhost:3001/memes?sort=random&limit=1', {
    //     headers: {
    //         Authorization: `Bearer ${Cookies.get("token")}`,
    //     }
    // })
    //     .then(res => res.data[0]));
}

const upvote = (memeId: string) => {
    return Promise.resolve()
}

const downvote = (memeId: string) => {
    return Promise.resolve()
}

export const memes = {all, get, getRandomMeme, upvote, downvote};