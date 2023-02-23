import {createGlobalState} from "react-use";
import {FilterType, MemeType} from 'src/types';

export * from './editor-states';

export const useMemesState = createGlobalState<MemeType[]>([]);

export const useFilterState = createGlobalState<FilterType>({
    creationDate: null
});
export const useSortState = createGlobalState<'latest' | 'popular'>('latest');

export const useSearchState = createGlobalState<string | null>(null)