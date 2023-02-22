import {useNavigate} from "react-router-dom";
import {Button, Card, Typography} from "antd";
import {CommentOutlined} from "@ant-design/icons";
import {DislikeButton, DownloadButton, LikeButton, ShareButton} from "src/components";
import {useMemesState} from "src/states";
import {MemeType} from "src/types";
import {abbreviateNumber, getTimeSince} from "src/utils";

type ItemProps = {
    meme: MemeType;
}

const {Text} = Typography;

const MemeItem = ({meme}: ItemProps) => {
    const navigate = useNavigate();

    // Conversion
    const totalComments = abbreviateNumber(meme.totalComments)
    const createdAt = getTimeSince(new Date(meme.createdAt));

    // Nav events
    const navigateToMeme = () => navigate(meme.id);

    return (
        <Card
            style={{marginBottom: 50, marginInline: 'auto', borderRadius: 15, width: 500}}
            cover={<img src={meme.image} onClick={navigateToMeme} alt={meme.name}/>}
            hoverable
            actions={[
                <LikeButton meme={meme}/>,
                <DislikeButton meme={meme}/>,
                <Button type={'ghost'} onClick={navigateToMeme}>
                    <CommentOutlined key={'comment'}/>
                    <Text>{totalComments}</Text>
                </Button>,
                <DownloadButton meme={meme}/>,
                <ShareButton meme={meme}/>
            ]}
        >
            <div onClick={navigateToMeme}>
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
            </div>
            </Card>
    );
}

export const MemeListPage = () => {
    const [memes,] = useMemesState() as [MemeType[], any];

    return (
        <>
            <div>
                {memes.map(item => <MemeItem key={item.id} meme={item}/>)}
            </div>
        </>
    )
}