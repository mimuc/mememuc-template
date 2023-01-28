import {Meme} from "src/types";

const mock = [
    {
        id: '1',
        name: 'Meme 1',
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
        name: 'Meme 1',
        image: 'https://i.imgflip.com/768vkl.jpg',
        totalComments: 1100000,
        totalLikes: 6300,
        totalDislikes: 10000,
        vote: -1,
        createdAt: '2023-01-06',
    },
    {
        id: '3',
        name: 'Meme 1',
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
        name: 'Meme 1',
        image: 'https://i.imgflip.com/768vkl.jpg',
        totalComments: 1000,
        totalLikes: 6000,
        totalDislikes: 10000000,
        vote: -1,
        createdAt: '2022-03-04',
    }
] as Meme[];


const all = () => {
    return Promise.resolve(mock)
}

const get = (memeId: string) => {
    return Promise.resolve<Meme>(mock.find(m => m.id === memeId) as Meme)
}

const getRandomMeme = () => {
    return Promise.resolve<Meme>(mock[0])
}

const upvote = (memeId: string) => {
    return Promise.resolve()
}

const downvote = (memeId: string) => {
    return Promise.resolve()
}

export const memes = {all, get, getRandomMeme,upvote, downvote};