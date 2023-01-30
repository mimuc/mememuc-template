import {createGlobalState} from "react-use";
import {Meme, Session} from 'src/types';

export const useMemesState = createGlobalState<Meme[]>([]);

export const useSessionState = createGlobalState<Session | null>(null);