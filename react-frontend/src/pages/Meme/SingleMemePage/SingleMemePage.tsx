import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Image, Modal, Segmented, Typography} from "antd";
import {
    LeftOutlined,
    PauseOutlined,
    PictureOutlined,
    PlayCircleOutlined,
    RadarChartOutlined,
    ReloadOutlined,
    RightOutlined,
} from "@ant-design/icons";
import {Comments, DislikeButton, DownloadButton, LikeButton, MemeStat, ShareButton} from "src/components";
import {api} from "src/api";
import {useFilterState, useMemesState, useSearchState, useSortState} from "src/states";
import {useAutoplay, useMeme} from "src/hooks";
import {getTimeSince} from "src/utils";
import {MemeType} from "src/types";

const {Title} = Typography;

const ModalHeader = ({meme}: { meme: MemeType }) => {
    const [memes, setMemes] = useMemesState();
    const [sort,] = useSortState();
    const [search,] = useSearchState();
    const [filter,] = useFilterState();

    const navigate = useNavigate();
    const {autoplay, startAutoplay, stopAutoplay} = useAutoplay();
    const isLast = memes.indexOf(meme) === memes.length - 1;
    const isPrevButtonDisabled = memes.findIndex(m => m.publicId === meme.publicId) === 0;


    const toggleAutoplay = () => {
        if (autoplay) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    }

    useEffect(() => {
        if (isLast) {
            api.memes.list(memes.length, 10, sort, filter, search).then(memes => {
                setMemes(prev => [...prev, ...memes]);
            }).catch(console.error)
        }
    }, [isLast, setMemes]);

    const handleGoPrev = () => {
        const currentIndex = memes.indexOf(meme);
        navigate('../' + memes[currentIndex - 1].publicId);
    };
    const handleGoNext = async () => {
        const currentIndex = memes.indexOf(meme);

        navigate('../' + memes[currentIndex + 1].publicId);
    };
    const handleRandom = async () => {
        meme = await api.memes.getRandomMeme(filter, search);
        navigate('../' + meme.publicId);
    };

    return (
        <div style={{marginBottom: 20}}>
            <Button.Group size={'small'}
                          style={{display: 'block', margin: 'auto', width: 'fit-content'}}>
                <Button icon={<LeftOutlined/>} onClick={handleGoPrev} style={{width: 50}} type={'link'}
                        disabled={isPrevButtonDisabled}/>
                <Button icon={<ReloadOutlined/>} onClick={handleRandom} style={{width: 50}} type={'link'}/>
                <Button icon={autoplay ? <PauseOutlined/> : <PlayCircleOutlined/>} onClick={toggleAutoplay}
                        style={{width: 50}} type={'link'}/>
                <Button icon={<RightOutlined/>} onClick={handleGoNext} style={{width: 50}} type={'link'}
                        disabled={isLast}/>
            </Button.Group>
        </div>
    )
}

// TODO: make components resize themselves
export const SingleMemePage = () => {
    const params = useParams();
    const navigate = useNavigate()
    const [view, setView] = useState<'meme' | 'stats'>("meme")

    const {meme} = useMeme(params.memeId as string)

    // Handlers
    const handleClose = () => navigate(`/memes`);

    useEffect( () => { // TODO: 
        if(meme) api.memes.addView(meme.publicId); //FIXME:
    }, [meme]);

    if (meme === null) return null;

    const createdAt = getTimeSince(new Date(meme.createdAt));

    return (
        <Modal open onCancel={handleClose} footer={null} width={1100}>
            <ModalHeader meme={meme}/>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                {/* Add meme stat view */}
                <div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        {/* Toggle for stats <-> meme */}
                        <div>
                            <Segmented
                                onChange={setView as any}
                                options={[
                                    {
                                        value: 'meme',
                                        icon: <PictureOutlined/>,
                                    },
                                    {
                                        value: 'stats',
                                        icon: <RadarChartOutlined/>,
                                    },
                                ]}
                            />
                        </div>
                        <div style={{color: '#00000073'}}>
                            {createdAt}
                        </div>

                    </div>
                    <div style={{marginTop: 20}}>
                        {view === 'meme' && <Image src={meme.imageUrl} preview={false} style={{borderRadius: 5}}/>}
                        {view === 'stats' && <MemeStat meme={meme}/>}
                    </div>
                    <div style={{marginTop: 20}}>
                        <div>
                            <Title level={4} style={{display: 'inline-block', maxWidth: 500, whiteSpace: 'break-spaces'}}>Mein
                                {meme.name}
                            </Title>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBlock: 10,
                        }}>
                            <LikeButton meme={meme}/>
                            <DislikeButton meme={meme}/>
                            <DownloadButton meme={meme}/>
                            <ShareButton meme={meme}/>
                        </div>
                    </div>
                </div>
                <Comments meme={meme}/>
            </div>
        </Modal>
    );
}
