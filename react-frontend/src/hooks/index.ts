import {useAsync} from "react-use";

export const useApi = <T, >(endpoint: () => Promise<T>) => {
    const loadable = useAsync(endpoint);

    return loadable.value ? loadable.value as T : null;
}