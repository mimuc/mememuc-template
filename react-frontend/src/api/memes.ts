import {MemeType} from "src/types";
import Cookies from 'js-cookie';
import {client} from "./base";
import {AxiosRequestConfig} from "axios";

export const all = () => {
    // return client.get('/templates');
    return Promise.resolve(client.get('http://localhost:3001/memes', {
        headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
        }
    })
    .then(res => res.data));
}

export const add = async (store: "unlisted" | "private" | "public", memeName: string, image: string, width: number, height: number) => {

     return client.post(`http://localhost:3001/memes/`, {
        config: {
            store,
            return: 'json'
        },
        template: {
            memeName,
            images: image,
            canvas: {
                width,
                height
            }
        }
     }, {
        headers: {
             Authorization: `Bearer ${Cookies.get("token")}`,
        }
     })
     .then(res => res.data);
}

const get = (memeId: string) => {
    return Promise.resolve(client.get(`http://localhost:3001/memes/{memeId}`, {
        headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
        }
    })
    .then(res => res.data));
}


const getRandomMeme = () => {
    return Promise.resolve(client.get('http://localhost:3001/memes?sort=random&limit=1', {
        headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
        }
    })
    .then(res => res.data[0]));
}

const upvote = (memeId: string) => {
    return Promise.resolve(client.put(`http://localhost:3001/memes/${memeId}/like`, {}, {
        headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
        }
    })
    .then(res => res.data));
}

const upvoteRemove = (memeId: string) => {
    return Promise.resolve(client.delete(`http://localhost:3001/memes/${memeId}/like`, {
        headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
        }
    })
    .then(res => res.data));
}

const downvote = (memeId: string) => {
    return Promise.resolve(client.put(`http://localhost:3001/memes/${memeId}/dislike`, {}, {
        headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
        }
    })
    .then(res => res.data));
}

const downvoteRemove = (memeId: string) => {
    return Promise.resolve(client.delete(`http://localhost:3001/memes/${memeId}/dislike`, {
        headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
        }
    })
    .then(res => res.data));
}

export const memes = {all, get, getRandomMeme, upvote, upvoteRemove, downvote, downvoteRemove};