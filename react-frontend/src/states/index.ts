import {createGlobalState} from "react-use";
import {FilterType, MemeType, SessionType} from 'src/types';

export * from './editor-states';

export const useMemesState = createGlobalState<MemeType[]>([]);

export const useFilterState = createGlobalState<FilterType>({
    creationDate: null
});
export const useSortState = createGlobalState<'newest' | 'oldest'>('newest');

export const useSearchState = createGlobalState<string | null>(null)

export const useSessionState = createGlobalState<SessionType | null>(null);

export const useCanvasSizeState = createGlobalState<{ width: number; height: number }>({width: 700, height: 700})