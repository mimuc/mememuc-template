import {authConfig, client} from "./base";

export const list = async (offset: number = 0, limit: number = 10) => {
    // TODO: use this instead of all
    return Promise.resolve([]);
}

export const all = async () => {

    return Promise.resolve([]);

    // // return client.get('/templates');
    // const memes = await client.get<any[]>('http://localhost:3001/memes', {
    //     headers: {
    //         Authorization: `Bearer ${Cookies.get("token")}`,
    //     }
    // } as AxiosRequestConfig).then(res => res.data);
}

export const add = async (store: "unlisted" | "private" | "public", memeName: string, image: string, width: number, height: number) => {
    const data = {
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
    }

    return client.post(`http://localhost:3001/memes/`, data, authConfig())
        .then(res => res.data);
}

const get = (memeId: string) => {
    return client.get(`http://localhost:3001/memes/${memeId}`, authConfig())
        .then(res => res.data);
}


const getRandomMeme = () => {
    return client.get('http://localhost:3001/memes?sort=random&limit=1', authConfig())
        .then(res => res.data[0]);
}

const upvote = (memeId: string) => {
    return client.put(`http://localhost:3001/memes/${memeId}/like`, {},)
        .then(res => res.data);
}

const downvote = (memeId: string) => {
    return client.put(`http://localhost:3001/memes/${memeId}/dislike`, {}, authConfig())
        .then(res => res.data);
}

export const memes = {all, list, get, getRandomMeme, upvote, downvote};