import {authConfig, client} from "./base";
import {FilterType, MemeType} from "src/types";

export const list = async (offset: number = 0, limit: number = 10, sort: 'latest' | 'popular' = 'latest', filter: FilterType = {creationDate: null}, search: string | null = null) => {
    // TODO: use this instead of all
    // TODO: convert filter Date.parse()
    return Promise.resolve<MemeType[]>([]);
}

export const all = () => {
    //return Promise.resolve<MemeType[]>([]);

    return Promise.resolve(client.get('http://localhost:3001/memes', authConfig())
        .then(res => res.data));
}

export const add = async (store: "unlisted" | "private" | "public", memeName: string, image: string, width: number, height: number) => {
    const data = {
        config: {
            store,
            return: 'json'
        },
        templates: {
            /* name: templateName, */ // TODO:
            memeName,
            images: image,
            canvas: {
                width,
                height
            }
        }
    }

    return client.post(`http://localhost:3001/memes/`, data, authConfig())
        .then(res => res.data);
}

const get = async (memeId: string) => {
    return client.get(`http://localhost:3001/memes/${memeId}`, authConfig())
        .then(res => res.data as MemeType);
}


const getRandomMeme = (filter: FilterType = {creationDate: null}, search: string | null = null) => {
    // TODO: convert filter Date.parse()
    return client.get('http://localhost:3001/memes?sort=random&limit=1', authConfig())
        .then(res => res.data[0] as MemeType);
}

const upvote = (memeId: string) => {
    return Promise.resolve(client.put(`http://localhost:3001/memes/${memeId}/like`, {}, authConfig())
        .then(res => res.data));
}

const upvoteRemove = (memeId: string) => {
    return client.delete(`http://localhost:3001/memes/${memeId}/like`, authConfig())
        .then(res => res.data);
}

const downvote = (memeId: string) => {
    return client.put(`http://localhost:3001/memes/${memeId}/dislike`, {}, authConfig())
        .then(res => res.data);
}

const downvoteRemove = (memeId: string) => {
    return Promise.resolve(client.delete(`http://localhost:3001/memes/${memeId}/dislike`, authConfig())
        .then(res => res.data));
}

const addView = (memeId: string) => {
    client.put(`/memes/${memeId}/views`, {}, authConfig());
}

export const memes = {all, list, get, getRandomMeme, upvote, upvoteRemove, downvote, downvoteRemove, addView};