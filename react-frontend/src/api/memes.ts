import {MemeType} from "src/types";
import Cookies from 'js-cookie';
import {client} from "./base";

/* const mock = [
    {
        id: '1',
        name: 'I\'m not a scientist, but I think we can all agree that...',
        image: 'https://i.imgflip.com/768vkl.jpg',
        totalComments: 100,
        totalLikes: 6500,
        totalDislikes: 1000,
        vote: 0,
        createdAt: '2022-11-11',
        creator: {
            id: '1',
            displayName: 'John Doe'
        }
    },
    {
        id: '2',
        name: 'I\'m not sure if this is a good idea, but I\'m going to do it anyway',
        image: 'https://i.imgflip.com/768vkl.jpg',
        totalComments: 1100000,
        totalLikes: 6300,
        totalDislikes: 10000,
        vote: -1,
        createdAt: '2023-01-06',
    },
    {
        id: '3',
        name: 'I\'m not sure what\'s going on, but I\'m pretty sure it\'s not good',
        image: 'https://i.imgflip.com/768vkl.jpg',
        totalComments: 2300,
        totalLikes: 1300,
        totalDislikes: 100,
        createdAt: '2022-03-04',
        vote: 1,
        creator: {
            id: '1',
            displayName: 'John Doe'
        }
    },
    {
        id: '4',
        name: 'Here come dat boi',
        image: 'https://i.imgflip.com/768vkl.jpg',
        totalComments: 1000,
        totalLikes: 6000,
        totalDislikes: 10000000,
        vote: -1,
        createdAt: '2022-03-04',
    }
] as MemeType[];
 */

/* const all = () => {
    return Promise.resolve(mock)
}
 */

export const all = () => {
    // return client.get('/templates');
    return Promise.resolve(client.get('http://localhost:3001/memes', {
        headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
        }
    })
    .then(res => res.data));
}

/* const get = (memeId: string) => {
    return Promise.resolve<MemeType>(mock.find(m => m.id === memeId) as MemeType)
} */

const get = (memeId: string) => {
    // return client.get('/templates');
    return Promise.resolve(client.get(`http://localhost:3001/memes/{memeId}`, {
        headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
        }
    })
    .then(res => res.data));
}

/* const getRandomMeme = () => {
    return Promise.resolve<MemeType>(mock[0])
} */

const getRandomMeme = () => {
    // return client.get('/templates');
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

const downvote = (memeId: string) => {
    return Promise.resolve(client.put(`http://localhost:3001/memes/${memeId}/dislike`, {}, {
        headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
        }
    })
    .then(res => res.data));
}

export const memes = {all, get, getRandomMeme,upvote, downvote};