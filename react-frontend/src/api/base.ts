import axios, {AxiosRequestConfig} from "axios";
import {config} from "../config";
import Cookies from "js-cookie";

export const client = axios.create({
    baseURL: config.BASE_URL
})

// TODO: how to set this config as default after login?
export const authConfig = () => {
    const token = Cookies.get("token");
    if (!token) {
        return {};
    } else {
        return {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            }
        } as AxiosRequestConfig;
    }
}