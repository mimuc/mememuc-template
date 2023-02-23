import {client} from "./base";
import {ImageShapeInterface, ShapeInterface, TemplateType} from "src/types";
import uuid from "react-uuid";

const mapTemplate = (rawTemplate: { publicId: string, name: string, texts: any[], url: string }) => {
    const textShapes = rawTemplate.texts.map((txt: any) => {
        const isString = typeof txt === 'string';

        // TODO: convert template url to image and and create imageobjecturl from image

        return {
            id: uuid(),
            type: 'text',
            x: isString ? 0 : (txt?.x || 0),
            y: isString ? 0 : (txt?.y || 0),
            text: isString ? txt : txt.text,
            fontSize: isString ? 20 : (txt?.fontSize || 20),
            fill: isString ? 'black' : (txt?.fill || 'black'),
            fontStyle: isString ? 'normal' : (txt?.fontStyle || 'normal'),
        }
    });

    const imageShapes = [{url: rawTemplate.url, x: 0, y: 0, type: 'image'} as ImageShapeInterface];

    return {id: rawTemplate.publicId, name: rawTemplate.name, shapes: [...imageShapes, ...textShapes]}
};

export const all = () => {
    return Promise.resolve<TemplateType[]>([])

    return client.get<any[]>('/templates')
        .then(res => res.data)
        .then((data) => data.map(mapTemplate));
}

export const add = (name: string, shapes: ShapeInterface[]) => {
    // TODO

    return client.post('/templates', {name, shapes}).then(res => res.data);
}

export const templates = {all, add};