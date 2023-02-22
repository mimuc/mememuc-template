import {CommentType} from "src/types";

const mock = [
    {
        id: "1",
        text: 'This is a great post!',
        createdAt: '2022-01-01',
        user: {
            id: "1",
            name: 'John Doe'
        }
    },
    {
        id: "2",
        text: 'I agree, very informative.',
        createdAt: '2022-01-02',
        user: {
            id: "2",
            name: 'Jane Smith'
        }
    },
    {
        id: "3",
        text: 'Thanks for sharing!',
        createdAt: '2022-01-03'
    },
    {
        id: "4",
        text: 'I have a question about this topic. Could you provide more information?',
        createdAt: '2022-01-04',
        user: {
            id: "3",
            name: 'Bob Johnson'
        }
    },
    {
        id: "5",
        text: 'This is a very helpful post, thank you!',
        createdAt: '2022-01-05',
        user: {
            id: "4",
            name: 'Samantha Williams'
        }
    },
    {
        id: "6",
        text: 'I completely disagree with this perspective.',
        createdAt: '2022-01-06',
        user: {
            id: "5",
            name: 'Michael Brown'
        }
    },
    {
        id: "7",
        text: 'Can you provide a source for this information?',
        createdAt: '2022-01-07',
        user: {
            id: "6",
            name: 'Emily Davis'
        }
    },
    {
        id: "8",
        text: 'I think you missed an important point here.',
        createdAt: '2022-01-08',
        user: {
            id: "7",
            name: 'David Taylor'
        }
    },
    {
        id: "9",
        text: 'Great post, I learned a lot from it!',
        createdAt: '2022-01-09',
        user: {
            id: "8",
            name: 'Jessica Johnson'
        }
    },
    {
        id: "10",
        text: 'I really appreciate your thoughts on this topic.',
        createdAt: '2022-01-10',
        user: {
            id: "9",
            name: 'William Smith'
        }
    },
    {
        id: "11",
        text: 'I agree with your conclusion.',
        createdAt: '2022-01-11',
        user: {
            id: "10",
            name: 'Ashley Williams'
        }
    },
    {
        id: "12",
        text: 'This was a very interesting read.',
        createdAt: '2022-01-12',
        user: {
            id: "11",
            name: 'Christopher Jones'
        }
    },
    {
        id: "13",
        text: 'I disagree with your point of view.',
        createdAt: '2022-01-13',
        user: {
            id: "12",
            name: 'Amanda Taylor'
        }
    }
] as CommentType[];

const forMeme = (memeId: string) => {
    return Promise.resolve<CommentType[]>(mock)
}

const add = (memeId: string, text: string) => {
    return Promise.resolve<CommentType>({text, createdAt: new Date().toDateString(), id: 'new'})
}

export const comments = {
    forMeme, add
}