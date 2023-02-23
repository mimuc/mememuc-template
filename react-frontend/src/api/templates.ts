import {client} from "./base";
import {ImageShapeInterface, ShapeInterface, TextShapeInterface} from "src/types";
import uuid from "react-uuid";

const toLocalImageUrl = (url: string) => {
    return fetch(url)
        .then(res => res.blob())
        .then(blob => URL.createObjectURL(blob));
}

const mapTemplate = async (rawTemplate: { publicId: string, name: string, texts: any[], images: any[], canvas: { width: number, height: number } }) => {
    const textShapes = rawTemplate.texts.map((txt: any) => {
        const isString = typeof txt === 'string';

        return {
            id: uuid(),
            type: 'text',
            x: isString ? 0 : (txt?.x || 0),
            y: isString ? 0 : (txt?.y || 0),
            text: isString ? txt : txt.text,
            fontSize: isString ? 20 : (txt?.fontSize || 20),
            fill: isString ? 'black' : (txt?.fill || 'black'),
            fontStyle: isString ? 'normal' : (txt?.fontStyle || 'normal'),
        } as TextShapeInterface;
    });

    const imageShapes: ImageShapeInterface[] = [];

    for (const img of rawTemplate.images) {
        const localUrl = await toLocalImageUrl(img.url);
        imageShapes.push({
            id: uuid(),
            type: 'image',
            x: img?.x || 0,
            y: img?.y || 0,
            url: localUrl,
        } as ImageShapeInterface);
    }

    return {
        id: rawTemplate.publicId,
        name: rawTemplate.name,
        shapes: [...imageShapes, ...textShapes],
        canvas: rawTemplate.canvas
    };
};

export const all = async () => {
    console.log("Getting templates...")
    const data = await client.get<any[]>('/templates').then(res => res.data)

    console.log("Templates:", data);

    const templates = [];
    for (const template of data) {
        templates.push(await mapTemplate(template));
    }

    return templates;
}

export const add = (name: string, shapes: ShapeInterface[], canvas: { width: number, height: number }) => {
    const data = {
        name,
        image: [],
        texts: [],
        canvas
    };

    return client.post('/templates', data).then(res => res.data);
}

export const templates = {all, add};