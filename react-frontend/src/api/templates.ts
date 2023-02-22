import {client} from "./base";
import {ImageShapeInterface, TemplateType} from "src/types";

export const all = () => {
    // return client.get('/templates');

    return Promise.resolve([
        {
            id: '1',
            name: 'Template 1',
            shapes: [
                {id: '10', text: 'Text Here', x: 10, y: 10, fontSize: 40, fill: 'blue', type: 'text'},
                {id: '11', text: 'Text Here', x: 50, y: 300, fontSize: 40, fill: 'red', type: 'text'},
                {id: '12', text: 'Text Here', x: 100, y: 100, fontSize: 40, fill: 'green', type: 'text'},
                {id: '13', url: 'https://picsum.photos/200/300', x: 100, y: 100, type: 'image'} as ImageShapeInterface,
            ],
        },
        {
            id: '2',
            name: 'Template 1',
            shapes: [],

        },
        {
            id: '3',
            name: 'Template 1',
            shapes: [],
        },
        {
            id: '4',
            name: 'Template 1',
            shapes: [],
        }
    ] as TemplateType[])
}

export const templates = {all};