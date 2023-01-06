import axios from "axios";
import {config} from "../config";

export const client = axios.create({
    baseURL: config.BASE_URL
})

