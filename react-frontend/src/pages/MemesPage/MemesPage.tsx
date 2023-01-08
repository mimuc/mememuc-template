import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCopyToClipboard} from "react-use";
import {Button, Card, message, Segmented, Typography} from "antd";
import {
    ClockCircleOutlined,
    CommentOutlined, DislikeFilled, DislikeOutlined,
    DownloadOutlined,
    HeartOutlined, LikeFilled, LikeOutlined,
    ShareAltOutlined
} from "@ant-design/icons";
import {api} from "src/api";
import {useApi} from "src/hooks";
import {Meme} from "src/types";
import {abbreviateNumber, getTimeSince} from "src/utils";

type ItemProps = {
    meme: Meme;
}

const {Text, Title} = Typography;

const MemeItem = ({meme}: ItemProps) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage()
    const [_, copyToClipboard] = useCopyToClipboard()

    // States
    const [vote, setVote] = useState(meme.vote);

    // Conversion
    const totalLikes = abbreviateNumber(meme.totalLikes)
    const totalDislikes = abbreviateNumber(meme.totalDislikes)
    const totalComments = abbreviateNumber(meme.totalComments)
    const createdAt = getTimeSince(new Date(meme.createdAt));

    // Nav events
    const navigateToMeme = () => navigate(meme.id);
    const navigateToComments = () => {
        // TODO: open comments
    }

    // Handlers
    const handleUpvoteToggle = async () => {
        if (vote === 1) {
            await api.memes.downvote(meme.id)
            setVote(0);
        } else {
            await api.memes.upvote(meme.id)
            setVote(1);
        }
    }

    const handleDownvoteToggle = async () => {
        if (vote === -1) {
            await api.memes.upvote(meme.id)
            setVote(0);
        } else {
            await api.memes.downvote(meme.id)
            setVote(-1);
        }
    }

    const handleDownload = () => {
        // TODO: download image
    }

    const handleShare = () => {
        // TODO: make sure this works
        copyToClipboard(window.location.href + '/' + meme.id)
        messageApi.success('Meme URL copied.')
    }

    return (
        <>
            {contextHolder}
            <Card
                style={{marginBottom: 50, marginInline: 'auto', borderRadius: 15, width: 500}}
                cover={<img src={meme.image} onClick={navigateToMeme} alt={meme.name}/>}
                hoverable
                actions={[
                    <Button type={'text'} onClick={handleUpvoteToggle}>
                        {vote === 1 ? <LikeFilled/> : <LikeOutlined key={'like'}/>}{' '}
                        <Text>{totalLikes}</Text>
                    </Button>,
                    <Button type={'text'} onClick={handleDownvoteToggle}>
                        {vote === -1 ? <DislikeFilled/> : <DislikeOutlined key={'like'}/>}{' '}
                        <Text>{totalDislikes}</Text>
                    </Button>,
                    <Button type={'text'} onClick={navigateToComments}>
                        <CommentOutlined key={'comment'}/>
                        <Text>{totalComments}</Text>
                    </Button>,
                    <Button type={'text'} onClick={handleDownload}>
                        <DownloadOutlined key={'download'}/>
                    </Button>,
                    <Button type={'text'} onClick={handleShare}>
                        <ShareAltOutlined key={'share'}/>
                    </Button>
                ]}
            >
                <Card.Meta
                    title={meme.name}
                    description={
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>by {
                                meme?.creator?.displayName
                                    ? meme.creator.displayName
                                    : 'Unknown'
                            }
                            </span>
                            <span>{createdAt}</span>
                        </div>
                    }
                />
            </Card>
        </>
    );
}

export const MemesPage = () => {
    // TODO: apply sorter 'popular' | 'latest'
    // TODO: add filter
    const memes = useApi(api.memes.all);

    if (!memes) return null;

    return (
        <>
            <div style={{
                position: 'fixed',
                zIndex: 100,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: 'white',
                paddingBlock: 10,
                boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.08), 0 2px 4px 0 rgba(0, 0, 0, 0.12)"
            }}>
                <Title style={{display: 'inline-block', margin: 0}} level={2}>Memes</Title>
                <div>
                    <Segmented
                        options={[
                            {
                                value: 'latest',
                                label: 'Latest',
                                icon: <ClockCircleOutlined/>,
                            },
                            {
                                value: 'popular',
                                label: 'Popular',
                                icon: <HeartOutlined/>,
                            },
                        ]}
                    />
                </div>
            </div>
            <div style={{paddingTop: 120}}>
                {memes.map(item => <MemeItem key={item.id} meme={item}/>)}
            </div>
        </>
    )
}