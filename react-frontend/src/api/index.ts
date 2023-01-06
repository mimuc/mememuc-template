import {client} from "./base";

export const templates = () => {
    return client.get('/templates');
}

export const api = {templates};

