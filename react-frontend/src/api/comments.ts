import {CommentType} from "src/types";
import { authConfig, client } from "./base";

const mapComment = ((data: {content: string, publicId: string, createdAt: string, creatorDisplayName: string}) => {
    return {
        text: data.content,
        id: data.publicId,
        createdAt: data.createdAt,
        user: {
            name: data.creatorDisplayName
        }
    } as CommentType;
});

const forMeme = async (memeId: string) => {
    return client.get(`/memes/${memeId}/comments`, authConfig())
    .then(res => {
        return res.data.map((d: { content: string; publicId: string; createdAt: string; creatorDisplayName: string; }) => mapComment(d));
    });
}

const add = async (memeId: string, text: string) => {
    return client.post(`/memes/${memeId}/comments`, {
        content: text,
        memePublicId: memeId
    }, authConfig())
    .then(res => {
        return mapComment(res.data);
    });
}

export const comments = {
    forMeme, add
}