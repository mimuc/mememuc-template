export type Template = {
    id: string
    name: string
}

export type Meme = {
    id: string;
    name: string;
    image: string;
    totalLikes: number;
    totalComments: number;
    createdAt: string;
    liked: boolean;
    creator?: {
        id: string;
        displayName: string;
    }
}

export type User = {
    name: string
}