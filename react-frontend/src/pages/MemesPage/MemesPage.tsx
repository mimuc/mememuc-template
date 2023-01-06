import {useNavigate} from "react-router-dom";
import {useCopyToClipboard, useToggle} from "react-use";
import {Button, Card, message, Segmented, Typography} from "antd";
import {
    ClockCircleOutlined,
    CommentOutlined,
    DownloadOutlined,
    HeartFilled,
    HeartOutlined,
    ShareAltOutlined
} from "@ant-design/icons";
import {api} from "src/api";
import {useApi} from "src/hooks";
import {Meme} from "src/types";
import {abbreviateNumber, getTimeSince} from "src/utils";

type ItemProps = {
    item: Meme;
}

const {Text, Title} = Typography;

const Item = ({item}: ItemProps) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage()
    const [_, copyToClipboard] = useCopyToClipboard()

    // States
    const [liked, toggleLike] = useToggle(item.liked);

    // Conversion
    const totalLikes = abbreviateNumber(item.totalLikes)
    const totalComments = abbreviateNumber(item.totalComments)
    const createdAt = getTimeSince(new Date(item.createdAt));

    // Nav events
    const navigateToMeme = () => navigate(item.id);
    const navigateToComments = () => {
        navigate(item.id, {state: 'comments'});
    }

    // Handlers
    const handleLikeToggle = async () => {
        if (liked) await api.memes.dislike(item.id);
        else await api.memes.like(item.id);

        toggleLike();
    }

    const handleDownload = () => {
        // TODO: download image
    }

    const handleShare = () => {
        // TODO: make sure this works
        copyToClipboard(window.location.href + '/' + item.id)
        messageApi.success('Meme URL copied.')
    }

    return (
        <>
            {contextHolder}
            <Card
                style={{marginBottom: 50, marginInline: 'auto', borderRadius: 15, width: 500}}
                cover={<img src={item.image} onClick={navigateToMeme} alt={item.name}/>}
                hoverable
                actions={[
                    <Button type={'text'} onClick={handleLikeToggle}>
                        {liked ? <HeartFilled/> : <HeartOutlined key={'like'}/>}{' '}
                        <Text>{totalLikes}</Text>
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
                    title={item.name}
                    description={
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>by {
                                item?.creator?.displayName
                                    ? item.creator.displayName
                                    : 'Uknown'
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
                {memes.map(item => <Item key={item.id} item={item}/>)}
            </div>
        </>
    )
}