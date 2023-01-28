import {useEffect, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useAsync, useUnmount} from "react-use";
import {useMemesState} from "src/states";

export const useApi = <T, >(endpoint: () => Promise<T>) => {
    const loadable = useAsync(endpoint);

    return loadable.value ? loadable.value as T : null;
}

export const useAutoplay = () => {
    const [timer, setTimer] = useState<number>(0);
    const {memeId} = useParams();
    const [memes,] = useMemesState();
    const [autoplay, setAutoplay] = useState<number | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const startAutoplay = () => {
        searchParams.set('autoplay', '5');
        setSearchParams(searchParams);
    }
    const stopAutoplay = () => {
        setAutoplay(null);

        searchParams.delete('autoplay');
        setSearchParams(searchParams);
        clearTimeout(timer);
    }

    useEffect(() => {
        const autoplayParam = searchParams.get('autoplay');
        const autoplay = autoplayParam && !isNaN(parseInt(autoplayParam)) ? parseInt(autoplayParam) : null;
        setAutoplay(autoplay);

        if (autoplay) {
            // Cycle through list of memes with modulo
            const timer: any = setTimeout(() => {
                const index = memes.findIndex(meme => meme.id === memeId);
                const nextMeme = memes[(index + 1) % memes.length];
                navigate(`/memes/${nextMeme.id}?${searchParams}`);
            }, autoplay * 1000);
            setTimer(timer);
        }
    }, [searchParams, memeId, memes, navigate]);

    useUnmount(() => clearTimeout(timer));

    return {
        autoplay,
        startAutoplay,
        stopAutoplay
    };
}