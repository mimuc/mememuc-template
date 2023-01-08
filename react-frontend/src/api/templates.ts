import {client} from "./base";
import {Template} from "src/types";

export const all = () => {
    // return client.get('/templates');
    return Promise.resolve([
        {
            id: '1',
            name: 'Template 1'
        },
        {
            id: '1',
            name: 'Template 1'
        },
        {
            id: '1',
            name: 'Template 1'
        },
        {
            id: '1',
            name: 'Template 1'
        }
    ] as Template[])
}

export const templates = {all};