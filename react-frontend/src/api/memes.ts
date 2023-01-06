import {Meme} from "src/types";

const all = () => {
    return Promise.resolve([
        {
            id: '1',
            name: 'Meme 1',
            image: 'https://i.imgflip.com/768vkl.jpg',
            totalComments: 100,
            totalLikes: 6500,
            liked: true,
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
            liked: false,
            createdAt: '2023-01-06',
        },
        {
            id: '3',
            name: 'Meme 1',
            image: 'https://i.imgflip.com/768vkl.jpg',
            totalComments: 2300,
            totalLikes: 1300,
            createdAt: '2022-03-04',
            liked: false,
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
            liked: false,
            createdAt: '2022-03-04',
        }
    ] as Meme[])
}

const like = (memeId: string) => {
    return Promise.resolve()
}

const dislike = (memeId: string) => {
    return Promise.resolve()
}

export const memes = {all, like, dislike};