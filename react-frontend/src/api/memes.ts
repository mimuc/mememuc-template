import {authConfig, client} from "./base";
import {FilterType, MemeType} from "src/types";

export const list = async (offset: number = 0, limit: number = 10, sort: 'newest' | 'oldest' = 'newest', filter: FilterType = {creationDate: null}, search: string | null = null) => {
    const queryList = [];
    queryList.push(`limit=${limit}`, `skip=${offset}`, `sort=${sort}`);

    if (filter?.creationDate) queryList.push(`after=${+filter.creationDate.valueOf()}`);
    if (search) queryList.push(`name=${search}`);

    const query = queryList.join('&');
    return client.get(`/memes?${query}`, authConfig())
        .then(res => res.data as MemeType[]);
}

export const add = async (store: "unlisted" | "private" | "public", memeName: string, image: string, width: number, height: number, template: string) => {
    const data = {
        config: {
            store,
            return: 'json'
        },
        templates: {
            /* name: templateName, */ // TODO:
            name: template,
            memeName,
            images: image,
            canvas: {
                width,
                height
            }
        }
    }
    console.log("Performing post with", data)
    return client.post(`/memes`, data, authConfig())
        .then(res => res.data[0] as MemeType);
}

const get = async (memeId: string) => {
    return client.get(`/memes/${memeId}`, authConfig())
        .then(res => res.data as MemeType);
}


const getRandomMeme = (filter: FilterType = {creationDate: null}, search: string | null = null) => {
    const queryList = [];
    queryList.push('sort=random', 'limit=1');

    if (filter?.creationDate) queryList.push(`after=${+filter.creationDate.valueOf()}`);
    if (search) queryList.push(`name=${search}`);

    const query = queryList.join('&');
    return client.get(`/memes?${query}`, authConfig())
        .then(res => res.data[0] as MemeType);
}

const upvote = (memeId: string) => {
    return Promise.resolve(client.put(`/memes/${memeId}/like`, {}, authConfig())
        .then(res => res.data as MemeType[]));
}

const upvoteRemove = (memeId: string) => {
    return client.delete(`/memes/${memeId}/like`, authConfig())
        .then(res => res.data);
}

const downvote = (memeId: string) => {
    return client.put(`/memes/${memeId}/dislike`, {}, authConfig())
        .then(res => res.data);
}

const downvoteRemove = (memeId: string) => {
    return client.delete(`/memes/${memeId}/dislike`, authConfig())
        .then(res => res.data);
}

const addView = (memeId: string) => {
    client.put(`/memes/${memeId}/views`, {}, authConfig());
}

export const memes = {list, add, get, getRandomMeme, upvote, upvoteRemove, downvote, downvoteRemove, addView};