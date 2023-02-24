import {Button, Typography} from "antd";
import {LikeFilled, LikeOutlined} from "@ant-design/icons";
import {abbreviateNumber} from "src/utils";
import {useAuth, useMeme} from "src/hooks";

const {Text} = Typography;

export const LikeButton = ({id}: { id: string }) => {
    const {session} = useAuth();
    const {meme, toggleLike} = useMeme(id);

    if(!meme) return null;

    const totalLikes = abbreviateNumber(meme.likes)

    return (
        <Button
            disabled={!session}
            icon={meme.vote === 1 ? <LikeFilled/> : <LikeOutlined/>}
            key={'like'}
            onClick={toggleLike}
            type={'text'}
            style={{width: 80}}
        >
            <Text>{totalLikes}</Text>
        </Button>
    );
}