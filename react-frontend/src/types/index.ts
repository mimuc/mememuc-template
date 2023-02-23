export type TemplateType = {
    id: string
    name: string,
    shapes: ShapeInterface[]
    canvas: {
        width: number
        height: number
    }
}

export type MemeType = {
    publicId: string;
    name: string;
    imageUrl: string;
    likes: number;
    dislikes: number;
    comments: number;
    createdAt: string;
    vote: number;
    creatorDisplayName: string
}

export type CommentType = {
    id: string;
    text: string;
    createdAt: string;
    user?: {
        id: string;
        name: string;
    }
}

export type UserType = {
    name: string
}

export type SessionType = {
    username: string
    displayName: string
}


export interface ShapeInterface {
    id: string;
    type: 'text' | 'image'
    x: number
    y: number
    width?: number
    height?: number
}

export interface TextShapeInterface extends ShapeInterface {
    text: string
    fontSize?: number
    fill?: string
    fontStyle?: 'bold' | 'normal'
}

export interface ImageShapeInterface extends ShapeInterface {
    url: string
}

export type DraftType = {
    id: string;
    shapes: ShapeInterface[]
}

