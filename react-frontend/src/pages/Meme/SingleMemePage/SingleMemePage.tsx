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
import {getTimeSince} from "src/utils";
import {useMemesState} from "src/states";
import {Meme} from "src/types";
import {api} from "src/api";
import {useAutoplay} from "src/hooks";

const {Title} = Typography;

const ModalHeader = ({meme}: { meme: Meme }) => {
    const [memes, setMemes] = useMemesState();
    const navigate = useNavigate();
    const {autoplay, startAutoplay, stopAutoplay} = useAutoplay();
    const isLast = memes.indexOf(meme) === memes.length - 1;
    const isPrevButtonDisabled = memes.findIndex(m => m.id === meme.id) === 0;

    const toggleAutoplay = () => {
        if (autoplay) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    }

    useEffect(() => {
        if (isLast) {
            // TODO: try to extend array
        }
    }, [isLast, setMemes]);

    const handleGoPrev = () => {
        const currentIndex = memes.indexOf(meme);
        navigate('../' + memes[currentIndex - 1].id);
    };
    const handleGoNext = async () => {
        const currentIndex = memes.indexOf(meme);

        navigate('../' + memes[currentIndex + 1].id);
    };
    const handleRandom = async () => {
        meme = await api.memes.getRandomMeme();
        navigate('../' + meme.id);
    };

    // TODO: add loading indicator
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

    const [memes,] = useMemesState()
    // TODO: if meme not in memes => try to load meme and append at front to memes
    const meme: Meme | undefined = memes && memes.find((m: Meme) => m.id === params.memeId);

    // Handlers
    const handleClose = () => navigate(`/memes`);

    //  TODO: handle error if meme not found (useApi should return error and data etc or redirect on not found by axios)
    if (meme === undefined) return null;

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
                        {view === 'meme' && <Image src={meme.image} preview={false} style={{borderRadius: 5}}/>}
                        {view === 'stats' && <MemeStat meme={meme}/>}
                    </div>
                    <div style={{marginTop: 20}}>
                        <div>
                            {/*TODO: how to break text without maxWidth?*/}
                            <Title level={4} style={{display: 'inline-block', maxWidth: 500}}>Mein
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
