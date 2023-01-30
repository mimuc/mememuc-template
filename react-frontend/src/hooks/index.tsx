import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useAsync, useUnmount} from "react-use";
import {useMemesState} from "src/states";
import {Input, Modal} from "antd";
import {CameraOutlined, LinkOutlined} from "@ant-design/icons";
import {isImgUrl} from "src/utils";
import Webcam from "react-webcam";

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

export const useUrlInputModal = () => {
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

    return () => new Promise<string | undefined>(resolve =>
        Modal.info({
            closable: true,
            icon: <LinkOutlined/>,
            title: 'Enter image URL',
            content: <Input placeholder={'Image URL'} onChange={(e: any) => {
                setImageUrl(e.target.value)
            }}/>,
            onCancel: () => resolve(undefined),
            onOk: () => {
                const url = imageUrl && imageUrl.trim();
                if (url && isImgUrl(url)) resolve(url);
                else resolve(undefined);
            }
        })
    );
}

export const useWebcamInputModal = () => {
    const webcamRef = useRef();

    return () => new Promise<string | undefined>(resolve =>
        Modal.info({
            closable: true,
            width: 690,
            icon: <CameraOutlined/>,
            title: 'Take a photo',
            bodyStyle: {paddingInline: 0},
            content: <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Webcam
                    width={640}
                    audio={false}
                    ref={webcamRef as any}
                    screenshotFormat={"image/jpeg"}
                />
            </div>,
            onCancel: () => resolve(undefined),
            onOk: () => {
                if (webcamRef.current == null) return;

                const webcam = webcamRef.current as Webcam;
                const imageSrc = webcam.getScreenshot();

                if (imageSrc) fetch(imageSrc).then(res => res.blob()).then(blob => {
                    const url = URL.createObjectURL(blob);
                    resolve(url);
                });
            }
        })
    );
}