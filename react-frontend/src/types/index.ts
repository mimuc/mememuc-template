export type Template = {
    id: string
    name: string
}

export type Meme = {
    id: string;
    name: string;
    image: string;
    totalLikes: number;
    totalDislikes: number;
    totalComments: number;
    createdAt: string;
    vote: number;
    creator?: {
        id: string;
        displayName: string;
    }
}

export type User = {
    name: string
}