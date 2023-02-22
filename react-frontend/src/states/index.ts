import {createGlobalState} from "react-use";
import {MemeType, SessionType, TemplateType} from 'src/types';

export * from './editor-states';

export const useMemesState = createGlobalState<MemeType[]>([]);

export const useSessionState = createGlobalState<SessionType | null>(null);

export const useTemplatesState = createGlobalState<TemplateType[]>([]);


