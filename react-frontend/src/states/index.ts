import {createGlobalState} from "react-use";
import {MemeType} from 'src/types';

export * from './editor-states';

export const useMemesState = createGlobalState<MemeType[]>([]);


