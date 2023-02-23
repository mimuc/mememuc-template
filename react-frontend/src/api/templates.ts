import Cookies from 'js-cookie';
import {client} from "./base";
import {ImageShapeInterface, TemplateType} from "src/types";

export const all = () => {
    // return client.get('/templates');

    return Promise.resolve(client.get('http://localhost:3001/templates', {
        headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
        }
    })
    .then(res => res.data));
}

export const templates = {all};