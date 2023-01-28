import {createGlobalState} from "react-use";
import {Meme} from 'src/types';

export const useMemesState = createGlobalState<Meme[]>([]);